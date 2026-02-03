'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, ArrowLeft, Facebook, Instagram, Linkedin, Twitter, Globe, Mail, PoundSterling } from 'lucide-react';
import Link from 'next/link';

interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  linkedInUrl: string;
  commissionRate: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: '',
    supportEmail: '',
    facebookUrl: '',
    instagramUrl: '',
    xUrl: '',
    linkedInUrl: '',
    commissionRate: 10,
    minWithdrawal: 1000,
    maxWithdrawal: 100000,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            platformName: data.settings.platformName || '',
            supportEmail: data.settings.supportEmail || '',
            facebookUrl: data.settings.facebookUrl || '',
            instagramUrl: data.settings.instagramUrl || '',
            xUrl: data.settings.xUrl || '',
            linkedInUrl: data.settings.linkedInUrl || '',
            commissionRate: data.settings.commissionRate || 10,
            minWithdrawal: data.settings.minWithdrawal || 1000,
            maxWithdrawal: data.settings.maxWithdrawal || 100000,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PlatformSettings, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
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
            <p className="mt-2 text-lg text-gray-500 font-medium tracking-tight">Manage platform configuration and business rules</p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-bold backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 shadow-sm ${
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
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:shadow-primary/5">
          <h2 className="mb-8 flex items-center space-x-3 text-2xl font-black text-gray-900 tracking-tight">
            <div className="p-2.5 rounded-2xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <span>Platform Settings</span>
          </h2>

          <div className="space-y-6">
            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-primary transition-colors">
                <Globe className="h-3.5 w-3.5" />
                <span>Platform Name</span>
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                placeholder="e.g. Phone Master"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>Support Email</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="support@example.com"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Financial Rules */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:shadow-primary/5">
          <h2 className="mb-8 flex items-center space-x-3 text-2xl font-black text-gray-900 tracking-tight">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10">
              <PoundSterling className="h-6 w-6 text-emerald-600" />
            </div>
            <span>Financial Rules</span>
          </h2>

          <div className="space-y-6">
            <div className="group">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.commissionRate}
                  onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-bold focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">%</div>
              </div>
              <p className="mt-3 text-xs text-gray-400 font-medium italic leading-relaxed">
                Percentage of each transaction taken as platform revenue
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  Min Withdrawal (p)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.minWithdrawal}
                  onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-bold focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all"
                />
              </div>
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  Max Withdrawal (p)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.maxWithdrawal}
                  onChange={(e) => handleChange('maxWithdrawal', parseInt(e.target.value))}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-bold focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-xl hover:shadow-primary/5 lg:col-span-2">
          <h2 className="mb-8 flex items-center space-x-3 text-2xl font-black text-gray-900 tracking-tight">
            <div className="p-2.5 rounded-2xl bg-primary/10">
              <Twitter className="h-6 w-6 text-primary" />
            </div>
            <span>Social Media Links</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-[#1877F2] transition-colors">
                <Facebook className="h-4 w-4" />
                <span>Facebook URL</span>
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-[#1877F2]/30 focus:bg-white focus:ring-4 focus:ring-[#1877F2]/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-[#E4405F] transition-colors">
                <Instagram className="h-4 w-4" />
                <span>Instagram URL</span>
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-[#E4405F]/30 focus:bg-white focus:ring-4 focus:ring-[#E4405F]/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-gray-900 transition-colors">
                <Twitter className="h-4 w-4" />
                <span>X (Twitter) URL</span>
              </label>
              <input
                type="url"
                value={settings.xUrl}
                onChange={(e) => handleChange('xUrl', e.target.value)}
                placeholder="https://x.com/..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-gray-900/30 focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="group">
              <label className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.1em] text-gray-400 group-focus-within:text-[#0A66C2] transition-colors">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={settings.linkedInUrl}
                onChange={(e) => handleChange('linkedInUrl', e.target.value)}
                placeholder="https://linkedin.com/company/..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm font-semibold focus:border-[#0A66C2]/30 focus:bg-white focus:ring-4 focus:ring-[#0A66C2]/5 focus:outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="relative group flex items-center space-x-3 rounded-[2rem] bg-gray-900 px-12 py-5 text-white transition-all hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 font-black tracking-tight cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Save className={`h-6 w-6 relative z-10 transition-transform ${saving ? 'animate-pulse' : 'group-hover:scale-110'}`} />
          <span className="relative z-10 text-lg">{saving ? 'Applying Changes...' : 'Save Configuration'}</span>
        </button>
      </div>
    </div>
  );
}
