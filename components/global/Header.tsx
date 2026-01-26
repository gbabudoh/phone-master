'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardUrl = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'personal_seller':
        return '/personal-seller/dashboard';
      case 'retail_seller':
        return '/retail-seller/dashboard';
      case 'wholesale_seller':
        return '/wholesale-seller/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'buyer':
        return '/buyer/dashboard';
      default:
        return '/';
    }
  };

  const getSellUrl = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'personal_seller':
        return '/personal-seller/dashboard/inventory/new';
      case 'retail_seller':
        return '/retail-seller/dashboard/inventory/new';
      case 'wholesale_seller':
        return '/wholesale-seller/dashboard/inventory/new';
      default:
        return '/login';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
          <img src="/logo.png" alt="Phone Master" className="h-14 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="/wholesale"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary cursor-pointer"
          >
            Wholesale
          </Link>
          <Link
            href="/retail"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary cursor-pointer"
          >
            Retail
          </Link>
          <Link
            href="/individual"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary cursor-pointer"
          >
            Individual
          </Link>
          <Link
            href="/support"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary cursor-pointer"
          >
            Support
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/search-marketplace"
            className="hidden p-2 text-foreground transition-colors hover:text-primary sm:block cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          {user ? (
            <>
              <div className="hidden items-center space-x-3 sm:flex">
                <RoleBadge role={user.role} className="text-xs px-2 py-0.5" />
                <Link
                  href={getDashboardUrl()}
                  className="p-2 text-foreground transition-colors hover:text-primary cursor-pointer"
                  aria-label="Dashboard"
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
              {(user.role === 'retail_seller' || user.role === 'wholesale_seller' || user.role === 'personal_seller') && (
                <Link
                  href={getSellUrl()}
                  className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark sm:block cursor-pointer"
                >
                  Sell
                </Link>
              )}
              {user.role === 'wholesale_seller' && (
                <Link
                  href="/admin/banners"
                  className="hidden rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light sm:block cursor-pointer"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="hidden rounded-lg border border-accent-grey/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light sm:flex sm:items-center sm:space-x-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light sm:block cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark sm:block cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-accent-grey/20 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="/wholesale"
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wholesale
            </Link>
            <Link
              href="/retail"
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Retail
            </Link>
            <Link
              href="/individual"
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Individual
            </Link>
            <Link
              href="/support"
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <Link
              href="/search-marketplace"
              className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>
            {user ? (
              <>
                <Link
                  href={getDashboardUrl()}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {(user.role === 'retail_seller' || user.role === 'wholesale_seller' || user.role === 'personal_seller') && (
                  <Link
                    href={getSellUrl()}
                    className="block rounded-lg bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary-dark cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sell
                  </Link>
                )}
                {user.role === 'wholesale_seller' && (
                  <Link
                    href="/admin/banners"
                    className="block rounded-lg border border-primary px-3 py-2 text-base font-medium text-primary hover:bg-accent-cyan-light cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg border border-accent-grey/20 px-3 py-2 text-left text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent-cyan-light cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block rounded-lg bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary-dark cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

