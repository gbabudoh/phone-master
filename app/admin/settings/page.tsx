'use client';

import { useState } from 'react';
import { Settings, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PlatformSettings {
  commissionRate: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  platformName: string;
  supportEmail: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    commissionRate: 10,
    minWithdrawal: 1000,
    maxWithdrawal: 100000,
    platformName: 'Phone Master',
    supportEmail: 'support@phonemaster.com',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field: keyof PlatformSettings, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // TODO: Implement settings API
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Back Link */}
      <div className="space-y-4">
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform cursor-pointer" />
          <span className="cursor-pointer">Back to Dashboard</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Settings</h1>
            <p className="mt-2 text-lg text-gray-500">Manage platform configuration and business rules</p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-bold backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 ${
            message.includes('success')
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Platform Settings */}
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 shadow-sm transition-all hover:bg-white/50">
          <h2 className="mb-6 flex items-center space-x-3 text-xl font-black text-gray-900">
            <Settings className="h-6 w-6 text-primary" />
            <span>Platform Settings</span>
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 shadow-sm transition-all hover:bg-white/50">
          <h2 className="mb-6 text-xl font-black text-gray-900 tracking-tight">Financial Rules</h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              />
              <p className="mt-2 text-xs text-gray-400 font-medium italic">
                Percentage of each transaction taken as platform revenue
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Min Withdrawal (p)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.minWithdrawal}
                  onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                  className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Max Withdrawal (p)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.maxWithdrawal}
                  onChange={(e) => handleChange('maxWithdrawal', parseInt(e.target.value))}
                  className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 rounded-2xl bg-primary px-8 py-4 text-white transition-all hover:bg-primary-dark hover:shadow-xl active:scale-95 disabled:opacity-50 font-bold cursor-pointer"
        >
          <Save className="h-5 w-5 cursor-pointer" />
          <span className="cursor-pointer">{saving ? 'Saving...' : 'Apply Changes'}</span>
        </button>
      </div>
    </div>
  );
}
