'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  LogIn, Mail, Lock, Smartphone, Shield,
  ArrowRight, Loader2, Eye, EyeOff, CheckCircle,
} from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Shield, text: 'Escrow-protected transactions' },
  { icon: CheckCircle, text: 'IMEI verification on every device' },
  { icon: Smartphone, text: 'Wholesale, retail & personal tiers' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        switch (data.user?.role) {
          case 'personal_seller':  router.push('/personal-seller/dashboard');  break;
          case 'retail_seller':    router.push('/retail-seller/dashboard');    break;
          case 'wholesale_seller': router.push('/wholesale-seller/dashboard'); break;
          case 'admin':            router.push('/admin/dashboard');            break;
          case 'buyer':            router.push('/buyer/dashboard');            break;
          default:                 router.push('/');
        }
      } else {
        router.push('/buyer/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] flex-col bg-linear-to-br from-primary via-[#013a63] to-[#01294a] px-12 py-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-white">Phone Master</span>
          </Link>

          <div className="flex-1">
            <h2 className="text-4xl font-black leading-tight text-white mb-4">
              Welcome back to<br />
              <span className="text-cyan-300">Phone Master</span>
            </h2>
            <p className="text-lg font-medium text-white/60 mb-12">
              Your secure marketplace for buying and selling mobile devices — wholesale, retail, or personal.
            </p>

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

          <p className="text-xs text-white/30 mt-12">
            © {new Date().getFullYear()} Phone Master. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-8">

        {/* Mobile brand header */}
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-gray-900">Phone Master</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Sign in</h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Create one free
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
                  <p className="text-sm font-bold text-red-800">Login Failed</p>
                  <p className="mt-0.5 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    placeholder="Enter your password"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="group w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    <><LogIn className="h-4 w-4" /> Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  )}
                </span>
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs font-medium text-gray-400">
            By signing in you agree to our{' '}
            <Link href="/terms" className="text-gray-600 underline underline-offset-2 hover:text-primary">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-gray-600 underline underline-offset-2 hover:text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>

    </div>
  );
}
