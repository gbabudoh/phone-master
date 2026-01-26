'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, TrendingUp, PoundSterling, Eye, Plus, Upload, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

export default function RetailDashboardPage() {
  const [stats, setStats] = useState({
    activeListings: 0,
    totalSales: 0,
    revenue: 0,
    totalViews: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    avgOrderValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/seller/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({ ...prev, ...data.stats }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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

  const getStoreName = () => {
    return user?.sellerDetails?.companyName || null;
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user ? `Welcome back, ${getUserDisplayName()}` : 'Retail Dashboard'}
            </h1>
            {getStoreName() && (
              <p className="mt-1 text-lg font-semibold text-primary">{getStoreName()}</p>
            )}
            <p className="mt-1 text-foreground/60">
              Manage your retail store and track performance
            </p>
          </div>
          {user && <RoleBadge role={user.role} />}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{formatPrice(stats.revenue || 0)}</p>
              <div className="mt-1 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <PoundSterling className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalSales || 0}</p>
              <div className="mt-1 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+8.2% from last month</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Active Listings</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.activeListings || 0}</p>
              <p className="mt-1 text-xs text-foreground/50">Unlimited allowed</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Total Views</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalViews || 0}</p>
              <div className="mt-1 flex items-center text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3" />
                <span>-2.1% from last month</span>
              </div>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-accent-grey/20 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
          <p className="text-sm font-medium text-foreground/60">Pending Orders</p>
          <p className="mt-1 text-xl font-bold text-primary">{stats.pendingOrders || 0}</p>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-gradient-to-r from-green-50 to-green-100 p-4">
          <p className="text-sm font-medium text-foreground/60">Conversion Rate</p>
          <p className="mt-1 text-xl font-bold text-green-700">{stats.conversionRate || 0}%</p>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-gradient-to-r from-blue-50 to-blue-100 p-4">
          <p className="text-sm font-medium text-foreground/60">Avg. Order Value</p>
          <p className="mt-1 text-xl font-bold text-blue-700">{formatPrice(stats.avgOrderValue || 0)}</p>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/retail-seller/dashboard/inventory/new"
              className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-primary-dark cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/retail-seller/dashboard/bulk-upload"
              className="flex items-center space-x-2 rounded-lg border border-primary bg-white px-4 py-3 text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Upload Products</span>
            </Link>
            <Link
              href="/retail-seller/dashboard/inventory"
              className="block rounded-lg border border-accent-grey/30 bg-white px-4 py-3 text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              Manage Inventory
            </Link>
            <Link
              href="/retail-seller/dashboard/reports"
              className="block rounded-lg border border-accent-grey/30 bg-white px-4 py-3 text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              Generate Reports
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/retail-seller/dashboard/orders" className="text-sm text-primary hover:underline cursor-pointer">
              View all
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-accent-grey/10 p-3">
                  <div>
                    <p className="text-sm font-medium">Order #{order._id?.substring(0, 8)}</p>
                    <p className="text-xs text-foreground/60">{order.items?.length || 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.totalAmount || 0)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.payoutStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.payoutStatus || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-foreground/60">
              <ShoppingCart className="mx-auto h-10 w-10 text-accent-grey mb-2" />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Retail Benefits Banner */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Retail Seller Benefits</h3>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li>✓ Unlimited product listings</li>
              <li>✓ Only 3% commission per sale</li>
              <li>✓ Bulk upload via CSV</li>
              <li>✓ Priority customer support</li>
            </ul>
          </div>
          <div className="hidden sm:block">
            <TrendingUp className="h-16 w-16 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
