'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  PoundSterling, 
  Settings, 
  Users,
  BarChart3,
  FileText,
  Upload,
  Store,
  FileSpreadsheet,
  MessageCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import VerificationBanner from '@/components/auth/VerificationBanner';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

function AdminPanelLink() {
  const { user } = useAuth();
  
  if (user?.role !== 'wholesale_seller') {
    return null;
  }

  return (
    <div className="border-t border-accent-grey/20 pt-2 mt-2">
      <Link
        href="/admin/dashboard"
        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
      >
        <Users className="h-4 w-4" />
        <span>Admin Panel</span>
      </Link>
    </div>
  );
}

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
          <p className="mt-1 text-sm text-foreground/60">Retail Seller Account</p>
        </div>
        <RoleBadge role={user.role} />
      </div>
      <div className="mt-3 flex items-center space-x-2 text-xs text-primary">
        <Store className="h-3 w-3" />
        <span>3% Commission Rate</span>
      </div>
    </div>
  );
}

export default function RetailDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['retail_seller', 'wholesale_seller']}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <VerificationBanner />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border border-accent-grey/20 bg-white p-6">
              <UserInfo />
              <h2 className="mb-6 text-xl font-bold text-foreground">Retail Dashboard</h2>
              <nav className="space-y-2">
                <Link
                  href="/retail-seller/dashboard"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/inventory"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Package className="h-4 w-4" />
                  <span>Inventory</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/bulk-upload"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Bulk Upload</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/analytics"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/reports"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/orders"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/messages"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/payouts"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <PoundSterling className="h-4 w-4" />
                  <span>Payouts</span>
                </Link>
                <Link
                  href="/retail-seller/dashboard/settings"
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <AdminPanelLink />
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
