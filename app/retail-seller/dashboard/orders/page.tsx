'use client';

import { useState, useEffect } from 'react';
import { ITransaction } from '@/types/transaction';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-2 text-foreground/60">View and manage your orders</p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-accent-grey/20 bg-white shadow">
          <table className="min-w-full divide-y divide-accent-grey/20">
            <thead className="bg-accent-cyan-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-grey/20 bg-white">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-accent-cyan-light/30">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    #{order._id?.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {order.items.length} item(s)
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.payoutStatus)}
                      <span className="text-sm capitalize">{order.payoutStatus}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">
                    {formatDate(order.purchaseDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No orders yet</p>
        </div>
      )}
    </div>
  );
}

