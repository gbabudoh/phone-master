'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Package, Clock, Search, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import RoleBadge from '@/components/auth/RoleBadge';

export default function BuyerDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    wishlistItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch buyer stats - placeholder for now
    // In a real app, you'd fetch from an API
  }, []);

  const getUserDisplayName = () => {
    if (!user) return '';
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user ? `Welcome, ${getUserDisplayName()}` : 'Buyer Dashboard'}
            </h1>
            <p className="mt-2 text-foreground/60">
              Manage your orders and browse the marketplace
            </p>
          </div>
          {user && <RoleBadge role={user.role} />}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.totalOrders}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Pending Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-accent-grey/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/60">Wishlist Items</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.wishlistItems}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/search-marketplace"
              className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-primary-dark cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Browse Marketplace</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/buyer/dashboard/orders"
              className="flex items-center justify-between rounded-lg border border-primary bg-white px-4 py-3 text-primary transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>View My Orders</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/buyer/dashboard/wishlist"
              className="flex items-center justify-between rounded-lg border border-accent-grey/30 bg-white px-4 py-3 text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>View Wishlist</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/buyer/dashboard/orders" className="text-sm text-primary hover:underline cursor-pointer">
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
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-foreground/60">
              <ShoppingBag className="mx-auto h-10 w-10 text-accent-grey mb-2" />
              <p>No orders yet</p>
              <Link href="/search-marketplace" className="mt-2 inline-block text-sm text-primary hover:underline cursor-pointer">
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Marketplace Categories */}
      <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Browse Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link href="/search-marketplace?category=handset" className="rounded-lg border border-accent-grey/20 p-4 text-center transition-colors hover:bg-accent-cyan-light hover:border-primary cursor-pointer">
            <Package className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">Handsets</p>
          </Link>
          <Link href="/search-marketplace?category=accessory" className="rounded-lg border border-accent-grey/20 p-4 text-center transition-colors hover:bg-accent-cyan-light hover:border-primary cursor-pointer">
            <Package className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">Accessories</p>
          </Link>
          <Link href="/wholesale" className="rounded-lg border border-accent-grey/20 p-4 text-center transition-colors hover:bg-accent-cyan-light hover:border-primary cursor-pointer">
            <Package className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">Wholesale</p>
          </Link>
          <Link href="/retail" className="rounded-lg border border-accent-grey/20 p-4 text-center transition-colors hover:bg-accent-cyan-light hover:border-primary cursor-pointer">
            <Package className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">Retail</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
