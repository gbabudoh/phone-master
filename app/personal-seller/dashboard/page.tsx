'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, TrendingUp, PoundSterling, Settings, Eye, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeListings: 0,
    totalSales: 0,
    revenue: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/seller/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const { user } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return '';
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.email?.split('@')[0] || 'User';
  };

  const getRoleDisplayName = () => {
    if (!user) return '';
    switch (user.role) {
      case 'personal_seller':
        return "Individual Seller";
      case 'retail_seller':
        return "Retail Seller";
      case 'wholesale_seller':
        return "Wholesale Seller";
      case 'buyer':
        return "Buyer";
      default:
        return user.role;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user ? `Welcome, ${getUserDisplayName()}` : 'Dashboard Overview'}
            </h1>
            <p className="mt-2 text-foreground/60">
              {user ? `${getRoleDisplayName()}'s Dashboard` : "Welcome back! Here's your account summary"}
            </p>
          </div>
          {user && <RoleBadge role={user.role} />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Active Listings</p>
              <p className="mt-2 text-3xl font-bold">{stats.activeListings}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Sales</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalSales}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Revenue</p>
              <p className="mt-2 text-3xl font-bold">{formatPrice(stats.revenue || 0)}</p>
            </div>
            <PoundSterling className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Views</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/personal-seller/dashboard/inventory/new"
              className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-primary-dark cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/personal-seller/dashboard/inventory"
              className="block rounded-lg border border-primary bg-white px-4 py-3 text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              Manage Inventory
            </Link>
            <Link
              href="/personal-seller/dashboard/analytics"
              className="block rounded-lg border border-primary bg-white px-4 py-3 text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              View Analytics
            </Link>
            <Link
              href="/personal-seller/dashboard/orders"
              className="block rounded-lg border border-primary bg-white px-4 py-3 text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <div className="text-center py-8 text-foreground/60">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

