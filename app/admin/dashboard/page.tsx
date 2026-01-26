'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, CreditCard, AlertCircle, Settings, Image } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingApprovals: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value / 100);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm font-medium text-gray-500 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>System Live</span>
        </div>
      </div>

      {/* Alert */}
      {stats.pendingApprovals > 0 && (
        <div className="relative overflow-hidden group rounded-2xl border border-yellow-200/50 bg-yellow-50/50 backdrop-blur-md p-5 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <AlertCircle className="h-24 w-24 text-yellow-600" />
          </div>
          <div className="bg-yellow-100 p-2.5 rounded-xl">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-yellow-900 text-lg">Pending Approvals</h3>
            <p className="text-yellow-800/80 mt-1">
              You have <span className="font-bold text-yellow-900">{stats.pendingApprovals}</span> seller accounts pending approval.{' '}
            <Link href="/admin/sellers" className="ml-2 font-bold underline hover:no-underline text-yellow-900 cursor-pointer">
                Review now →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', href: '/admin/users', linkText: 'View all users' },
          { label: 'Active Sellers', value: stats.totalSellers, icon: Users, color: 'purple', href: '/admin/sellers', linkText: 'Manage sellers' },
          { label: 'Total Products', value: stats.totalProducts, icon: ShoppingBag, color: 'emerald', href: '/admin/products', linkText: 'View products' },
          { label: 'Transactions', value: stats.totalTransactions, icon: CreditCard, color: 'orange', href: '/admin/transactions', linkText: 'View history' },
        ].map((stat, i) => (
          <div 
            key={i}
            className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="mt-3 text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300 cursor-pointer`}>
                <stat.icon className="h-7 w-7 cursor-pointer" />
              </div>
            </div>
            <Link
              href={stat.href}
              className="mt-6 flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              {stat.linkText} <span className="ml-1 cursor-pointer">→</span>
            </Link>
          </div>
        ))}

        {/* Total Revenue - Special Styling */}
        <div className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 lg:col-span-2 xl:col-span-1 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider">Total Revenue</p>
              <p className="mt-3 text-4xl font-black text-primary tracking-tight">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 cursor-pointer">
              <TrendingUp className="h-7 w-7 cursor-pointer" />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-primary/60 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-2" />
            Commission earned to date
          </p>
        </div>

        {/* Quick Actions - Glassmorphic */}
        <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Manage Banners', href: '/admin/banners', icon: Image },
              { label: 'Review Sellers', href: '/admin/sellers', icon: Users },
              { label: 'Settings', href: '/admin/settings', icon: Settings }
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/10 transition-all duration-200 group cursor-pointer"
              >
                <span className="text-sm font-bold cursor-pointer">{action.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
