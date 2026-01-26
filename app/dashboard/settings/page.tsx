'use client';

import { useState, useEffect } from 'react';
import { Save, User, Building, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    vatNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        companyName: user.sellerDetails?.companyName || '',
        vatNumber: user.sellerDetails?.vatNumber || '',
      });
    }
  }, [user]);

  // Only show business tab for retail_seller and wholesale_seller
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    ...(user?.role === 'retail_seller' || user?.role === 'wholesale_seller'
      ? [{ id: 'business', label: 'Business', icon: Building }]
      : []),
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save settings
    alert('Settings saved!');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-2 text-foreground/60">Manage your account settings</p>
          </div>
          {user && <RoleBadge role={user.role} />}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-accent-grey/20">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/60 hover:border-accent-grey/40 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {activeTab === 'business' && (user?.role === 'retail_seller' || user?.role === 'wholesale_seller') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Business Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                placeholder="Enter your business name"
              />
            </div>
            {user?.role === 'wholesale_seller' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">VAT Number</label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="Enter your VAT number"
                />
              </div>
            )}
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {activeTab === 'payment' && (
          <div>
            <p className="text-foreground/60">Payment settings coming soon</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <p className="text-foreground/60">Notification settings coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

