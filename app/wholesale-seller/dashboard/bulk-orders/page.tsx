'use client';

import { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function BulkOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchBulkOrders(); }, []);

  const fetchBulkOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders?type=bulk');
      if (response.ok) { const data = await response.json(); setOrders(data.orders || []); }
    } catch (error) { console.error('Failed to fetch bulk orders:', error); }
    finally { setLoading(false); }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bulk Orders</h1>
        <p className="mt-2 text-foreground/60">Manage and track your wholesale bulk orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by order ID..." className="w-full rounded-lg border border-accent-grey/20 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-accent-grey/20 px-4 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer">
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <p className="text-sm text-foreground/60">Total Bulk Orders</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <p className="text-sm text-foreground/60">Processing</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <p className="text-sm text-foreground/60">Shipped</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <p className="text-sm text-foreground/60">Delivered</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="text-foreground/60">Loading...</p></div>
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-accent-grey/20 bg-white shadow">
          <table className="min-w-full divide-y divide-accent-grey/20">
            <thead className="bg-accent-cyan-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-grey/20 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-accent-cyan-light/30">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">#{order._id?.substring(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.items?.length || 0} product(s)</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0} units</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{formatPrice(order.totalAmount || 0)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status || 'processing')}
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status || 'processing')}`}>{order.status || 'processing'}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">{formatDate(order.purchaseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <Truck className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No bulk orders found</p>
          <p className="mt-2 text-sm text-foreground/40">Bulk orders from B2B customers will appear here</p>
        </div>
      )}
    </div>
  );
}
