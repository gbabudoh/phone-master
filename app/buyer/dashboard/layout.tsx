'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart,
  Settings, 
  MessageCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

function UserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  const getUserDisplayName = () => {
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/60">Logged in as</p>
          <p className="text-lg font-semibold text-foreground">{getUserDisplayName()}</p>
          <p className="mt-1 text-sm text-foreground/60">Buyer Account</p>
        </div>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['buyer']}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border border-accent-grey/20 bg-white p-6">
              <UserInfo />
              <h2 className="mb-6 text-xl font-bold text-foreground">My Account</h2>
              <nav className="space-y-2">
                <Link
                  href="/buyer/dashboard"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/buyer/dashboard/orders"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/buyer/dashboard/wishlist"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/buyer/dashboard/messages"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/buyer/dashboard/settings"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
