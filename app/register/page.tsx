'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Smartphone, Shield, Zap, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, Building2, Store, UserCircle } from 'lucide-react';

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

      // Redirect based on selected role
      switch (formData.role) {
        case 'personal_seller':
          router.push('/personal-seller/dashboard');
          break;
        case 'retail_seller':
          router.push('/retail-seller/dashboard');
          break;
        case 'wholesale_seller':
          router.push('/wholesale-seller/dashboard');
          break;
        case 'buyer':
          router.push('/buyer/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'buyer', label: 'Buyer', icon: UserCircle, description: 'Browse and purchase devices' },
    { value: 'personal_seller', label: 'Personal Seller', icon: User, description: 'Sell up to 5 devices' },
    { value: 'retail_seller', label: 'Retail Seller', icon: Store, description: 'Unlimited listings, 3% commission' },
    { value: 'wholesale_seller', label: 'Wholesale Seller', icon: Building2, description: 'Bulk sales, 5% commission' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent-cyan-light/20 to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(1, 79, 134, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg">
              <Smartphone className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Phone Master</h1>
            <p className="mt-2 text-foreground/60">Create your account</p>
          </div>

          {/* Desktop Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
            <p className="mt-2 text-foreground/60">Join Phone Master and start trading mobile devices</p>
          </div>

          <div className="rounded-2xl border border-accent-grey/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
            {error && (
              <div className="mb-6 animate-in slide-in-from-top-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Registration Failed</p>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-foreground">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-4 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="John"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-foreground">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-4 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Doe"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-4 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-12 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Create a strong password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-foreground/50">
                  Use at least 8 characters with a mix of letters, numbers, and symbols
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  Account Type
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: option.value as typeof formData.role })}
                        disabled={loading}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-accent-cyan-light shadow-md'
                            : 'border-accent-grey/20 bg-white hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? 'bg-primary text-white' : 'bg-accent-cyan-light text-primary'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {option.label}
                              </h3>
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <p className="mt-1 text-xs text-foreground/60">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Store Name - Only for Retail and Wholesale Sellers */}
              {(formData.role === 'retail_seller' || formData.role === 'wholesale_seller') && (
                <div className="animate-in slide-in-from-top-2">
                  <label htmlFor="storeName" className="mb-2 block text-sm font-semibold text-foreground">
                    Store Name <span className="text-foreground/40 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                    <input
                      id="storeName"
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-4 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your store or business name"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-foreground/50">
                    This will be displayed to buyers on your product listings
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password || !formData.firstName || !formData.lastName}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-accent-grey/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-foreground/40">Already have an account?</span>
                </div>
              </div>

              <Link
                href="/login"
                className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition-all hover:bg-accent-cyan-light hover:shadow-md cursor-pointer"
              >
                <span>Sign in instead</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-foreground/40">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

