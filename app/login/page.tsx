'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogIn, Mail, Lock, Smartphone, Shield, Zap, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

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
      
      // Fetch user to get role for redirect
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        const userRole = data.user?.role;
        
        // Redirect based on role
        switch (userRole) {
          case 'personal_seller':
            router.push('/personal-seller/dashboard');
            break;
          case 'retail_seller':
            router.push('/retail-seller/dashboard');
            break;
          case 'wholesale_seller':
            router.push('/wholesale-seller/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'buyer':
            router.push('/buyer/dashboard');
            break;
          default:
            router.push('/');
        }
      } else {
        router.push('/buyer/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg">
              <Smartphone className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Phone Master</h1>
            <p className="mt-2 text-foreground/60">Welcome back</p>
          </div>

          {/* Desktop Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Sign In</h2>
            <p className="mt-2 text-foreground/60">Enter your credentials to continue</p>
          </div>

          <div className="rounded-2xl border border-accent-grey/20 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
            {error && (
              <div className="mb-6 animate-in slide-in-from-top-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <span className="text-xs font-bold text-red-600">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">Login Failed</p>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-4 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary-dark hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-accent-grey/20 bg-white py-3 pl-12 pr-12 text-foreground transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
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
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      <span>Sign In</span>
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
                  <span className="bg-white px-2 text-foreground/40">New to Phone Master?</span>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-primary bg-white px-6 py-3 font-semibold text-primary transition-all hover:bg-accent-cyan-light hover:shadow-md cursor-pointer"
              >
                <span>Create an account</span>
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


