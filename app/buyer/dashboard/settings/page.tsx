'use client';

import { useState } from 'react';
import { Save, User, MapPin, Bell, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';
import { IUser } from '@/types/user';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSave = () => {
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

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

      <div className="mb-6 border-b border-accent-grey/20">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors cursor-pointer ${
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

      <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
        {activeTab === 'profile' && (
          user ? (
            <ProfileForm user={user} onSave={onSave} key={user.email || 'user-loaded'} />
          ) : (
            <div className="text-center py-4 text-gray-500">Loading profile...</div>
          )
        )}

        {activeTab === 'address' && (
          <AddressForm onSave={onSave} />
        )}

        {activeTab === 'notifications' && (
          <div>
            <p className="text-foreground/60">Notification settings coming soon</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Changes Saved!</h3>
              <p className="text-sm text-gray-500">Your profile settings have been successfully updated.</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileForm({ user, onSave }: { user: IUser, onSave: () => void }) {
  const [formData, setFormData] = useState({
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    email: user.email || '',
    phone: user.profile?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">First Name</label>
          <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Last Name</label>
          <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
      </div>
      <button type="submit" className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer">
        <Save className="h-4 w-4" />
        <span>Save Changes</span>
      </button>
    </form>
  );
}

function AddressForm({ onSave }: { onSave: () => void }) {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postcode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="Street address" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">City</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Postcode</label>
          <input type="text" value={formData.postcode} onChange={(e) => setFormData({ ...formData, postcode: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
        </div>
      </div>
      <button type="submit" className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer">
        <Save className="h-4 w-4" />
        <span>Save Address</span>
      </button>
    </form>
  );
}
