'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Store, Building2, CheckCircle2, ArrowRight, Loader2, Info, LucideIcon } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UpgradePage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'personal_seller' | 'retail_seller' | 'wholesale_seller'>('personal_seller');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');

  const plans: {
    id: 'personal_seller' | 'retail_seller' | 'wholesale_seller';
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    features: string[];
  }[] = [
    {
      id: 'personal_seller',
      title: 'Individual Seller',
      description: 'Perfect for selling used personal devices.',
      icon: User,
      color: 'blue',
      features: ['Sell up to 5 devices', 'No monthly fee', 'Basic support'],
    },
    {
      id: 'retail_seller',
      title: 'Retail Seller',
      description: 'For small businesses and frequent sellers.',
      icon: Store,
      color: 'purple',
      features: ['Unlimited listings', '3% commission', 'Store profile', 'Priority support'],
    },
    {
      id: 'wholesale_seller',
      title: 'Wholesale Seller',
      description: 'For bulk sellers and large distributors.',
      icon: Building2,
      color: 'orange',
      features: ['Bulk listing tools', '5% commission', 'VAT invoicing', 'Dedicated account manager'],
    },
  ];

  const handleUpgrade = async () => {
    setError('');
    setLoading(true);

    if ((selectedRole === 'retail_seller' || selectedRole === 'wholesale_seller') && !storeName.trim()) {
      setError('Please enter your store name.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          storeName: storeName.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upgrade failed');
      }

      // Refresh user session to reflect new role
      await refreshUser();

      // Redirect to new dashboard
      switch (selectedRole) {
        case 'personal_seller':
          router.push('/personal-seller/dashboard');
          break;
        case 'retail_seller':
          router.push('/retail-seller/dashboard');
          break;
        case 'wholesale_seller':
          router.push('/wholesale-seller/dashboard');
          break;
      }
    } catch (err: unknown) {
       const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Seller Plan</h1>
          <p className="mt-2 text-lg text-gray-600">Upgrade your account and start selling today.</p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedRole === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedRole(plan.id)}
                className={`relative cursor-pointer rounded-2xl border-2 bg-white p-6 transition-all hover:shadow-lg ${
                  isSelected ? `border-${plan.color}-500 ring-4 ring-${plan.color}-50` : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isSelected && (
                  <div className={`absolute right-4 top-4 text-${plan.color}-500`}>
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                )}
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${plan.color}-100 text-${plan.color}-600`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{plan.title}</h3>
                <p className="mb-6 text-sm text-gray-500">{plan.description}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Store Name Input */}
        {(selectedRole === 'retail_seller' || selectedRole === 'wholesale_seller') && (
          <div className="mx-auto mt-8 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
              <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-gray-900">
                Store Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Enter your business name"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                This name will appear on your public seller profile.
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex items-center space-x-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Confirm & Upgrade Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
