'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, CreditCard, AlertCircle, Settings, Image, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import RevenueChart from '@/components/admin/RevenueChart';
import RecentActivityTable from '@/components/admin/RecentActivityTable';

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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-foreground/60 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            Overview
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            Good afternoon, Admin. Here&apos;s your daily digest.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm ring-1 ring-gray-900/5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>System Operational</span>
        </div>
      </div>

      {/* Alert Section */}
      {stats.pendingApprovals > 0 && (
        <div className="relative overflow-hidden group rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 backdrop-blur-md p-6 flex items-start space-x-5 shadow-sm hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300">
          <div className="bg-amber-100/80 p-3 rounded-2xl shadow-inner shadow-amber-200/50">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-amber-900 text-lg">Action Required</h3>
                <p className="text-amber-800/80 mt-1 font-medium">
                  There are <span className="font-black text-amber-900 text-xl">{stats.pendingApprovals}</span> seller accounts waiting for your approval.
                </p>
              </div>
              <Link href="/admin/sellers" className="hidden sm:flex items-center space-x-2 bg-white/80 hover:bg-white text-amber-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer">
                <span>Review Requests</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <Link href="/admin/sellers" className="sm:hidden mt-3 inline-flex font-bold underline text-amber-900">
              Review now →
            </Link>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Revenue', 
            value: formatCurrency(stats.totalRevenue), 
            change: '+12.5%', 
            trend: 'up',
            icon: TrendingUp, 
            color: 'violet', 
            bg: 'from-violet-500 to-fuchsia-600'
          },
          { 
            label: 'Active Users', 
            value: stats.totalUsers.toLocaleString(), 
            change: '+5.2%', 
            trend: 'up',
            icon: Users, 
            color: 'blue', 
            bg: 'from-blue-500 to-cyan-500' 
          },
          { 
            label: 'Products Listed', 
            value: stats.totalProducts.toLocaleString(), 
            change: '+2.4%', 
            trend: 'up',
            icon: ShoppingBag, 
            color: 'emerald', 
            bg: 'from-emerald-500 to-teal-500' 
          },
          { 
            label: 'Total Orders', 
            value: stats.totalTransactions.toLocaleString(), 
            change: '-1.2%', 
            trend: 'down',
            icon: CreditCard, 
            color: 'rose', 
            bg: 'from-rose-500 to-pink-600' 
          },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
              <stat.icon className="h-32 w-32" />
            </div>
            
            <div className="relative">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.bg} text-white shadow-lg shadow-${stat.color}-500/20 group-hover:shadow-${stat.color}-500/40 transition-shadow`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.change && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                    stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                    <span className="ml-1 opacity-60 font-medium">vs last mo</span>
                  </span>
                )}
              </div>
              
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-sm text-gray-500 mt-1">Income overview for the current year</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="h-[300px] w-full bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
             {/* Integrated Chart Component */}
             <RevenueChart />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link href="/admin/users" className="text-sm font-bold text-primary hover:text-primary-dark cursor-pointer">
              View All
            </Link>
          </div>
          {/* Integrated Activity Table */}
          <RecentActivityTable />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 px-1">Quick Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Manage Banners', desc: 'Update homepage visuals', href: '/admin/banners', icon: Image, color: 'indigo' },
            { label: 'Review Sellers', desc: 'Approve pending requests', href: '/admin/sellers', icon: Users, color: 'blue' },
            { label: 'Legal & CMS', desc: 'Manage Terms, Privacy, etc.', href: '/admin/pages', icon: Settings, color: 'violet' },
            { label: 'Platform Settings', desc: 'Configure system options', href: '/admin/settings', icon: Settings, color: 'slate' },
            { label: 'Transactions', desc: 'Monitor payments', href: '/admin/transactions', icon: CreditCard, color: 'emerald' }
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="group flex flex-col p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/10 transition-all duration-300 cursor-pointer"
            >
              <div className={`h-12 w-12 rounded-2xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{action.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
