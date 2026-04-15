'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserPlus, Mail, Lock, User, Smartphone, Shield,
  ArrowRight, Loader2, Eye, EyeOff, CheckCircle2,
  Building2, Store, UserCircle, CheckCircle,
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'buyer',
    label: 'Buyer',
    icon: UserCircle,
    description: 'Browse and purchase devices',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    selectedBg: 'bg-blue-600',
  },
  {
    value: 'personal_seller',
    label: 'Personal Seller',
    icon: User,
    description: 'Sell up to 5 personal devices',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    selectedBg: 'bg-teal-600',
  },
  {
    value: 'retail_seller',
    label: 'Retail Seller',
    icon: Store,
    description: 'Unlimited listings · 3% fee',
    color: 'text-primary',
    bg: 'bg-primary/10',
    selectedBg: 'bg-primary',
  },
  {
    value: 'wholesale_seller',
    label: 'Wholesale Seller',
    icon: Building2,
    description: 'Bulk sales · 5% fee · API access',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    selectedBg: 'bg-indigo-600',
  },
] as const;

const TRUST_ITEMS = [
  { icon: Shield, text: 'Escrow-protected transactions' },
  { icon: CheckCircle, text: 'IMEI verification on every device' },
  { icon: Smartphone, text: 'Wholesale, retail & personal tiers' },
];

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: '', color: 'bg-gray-200' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-yellow-400' },
    { label: 'Good', color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];
  return { score, ...levels[score] };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'buyer' as 'buyer' | 'personal_seller' | 'retail_seller' | 'wholesale_seller',
    storeName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      switch (formData.role) {
        case 'personal_seller': router.push('/personal-seller/dashboard'); break;
        case 'retail_seller':   router.push('/retail-seller/dashboard');   break;
        case 'wholesale_seller':router.push('/wholesale-seller/dashboard'); break;
        case 'buyer':           router.push('/buyer/dashboard');           break;
        default:                router.push('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col bg-linear-to-br from-primary via-[#013a63] to-[#01294a] px-12 py-16 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-white">Phone Master</span>
          </Link>

          {/* Headline */}
          <div className="flex-1">
            <h2 className="text-4xl font-black leading-tight text-white mb-4">
              Nigeria&apos;s Smartest<br />
              <span className="text-cyan-300">Phone Marketplace</span>
            </h2>
            <p className="text-lg font-medium text-white/60 mb-12">
              Join thousands of buyers and sellers trading mobile devices securely every day.
            </p>

            {/* Trust signals */}
            <div className="flex flex-col gap-5">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <p className="text-sm font-semibold text-white/80">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-xs text-white/30 mt-12">
            © {new Date().getFullYear()} Phone Master. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-8 overflow-y-auto">
        {/* Mobile brand header */}
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-gray-900">Phone Master</span>
          </Link>
        </div>

        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                  <span className="text-xs font-black text-red-600">!</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">Registration Failed</p>
                  <p className="mt-0.5 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                {(['firstName', 'lastName'] as const).map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="mb-1.5 block text-sm font-bold text-gray-700">
                      {field === 'firstName' ? 'First Name' : 'Last Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id={field}
                        type="text"
                        required
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                        placeholder={field === 'firstName' ? 'John' : 'Doe'}
                        disabled={loading}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    placeholder="Create a strong password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {formData.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength.score ? strength.color : 'bg-gray-100'
                          }`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className="text-xs font-semibold text-gray-500">
                        Strength: <span className="text-gray-700">{strength.label}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Account Type</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ROLE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: option.value })}
                        disabled={loading}
                        className={`relative rounded-2xl border-2 p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? option.selectedBg + ' text-white' : option.bg + ' ' + option.color
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                                {option.label}
                              </p>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                            </div>
                            <p className="mt-0.5 text-[11px] font-medium text-gray-400 leading-tight">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Store name — retail & wholesale only */}
              {(formData.role === 'retail_seller' || formData.role === 'wholesale_seller') && (
                <div>
                  <label htmlFor="storeName" className="mb-1.5 block text-sm font-bold text-gray-700">
                    Store Name <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="storeName"
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                      placeholder="Your store or business name"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Displayed on your listings to buyers
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password || !formData.firstName || !formData.lastName}
                className="group w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Create Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs font-medium text-gray-400">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-gray-600 underline underline-offset-2 hover:text-primary">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-gray-600 underline underline-offset-2 hover:text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>

    </div>
  );
}
