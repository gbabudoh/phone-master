'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Package, CheckCircle2, Clock, Truck } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch buyer orders - placeholder for now
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="mt-2 text-foreground/60">Track and manage your orders</p>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="text-foreground/60">Loading...</p></div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-lg border border-accent-grey/20 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-foreground/60">Order ID</p>
                  <p className="font-semibold">#{order._id?.substring(0, 12)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="border-t border-accent-grey/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60">{order.items?.length || 0} item(s)</p>
                    <p className="text-sm text-foreground/60">Ordered on {formatDate(order.purchaseDate)}</p>
                  </div>
                  <p className="text-lg font-bold">{formatPrice(order.totalAmount || 0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No orders yet</p>
          <p className="mt-2 text-sm text-foreground/40">Your orders will appear here once you make a purchase</p>
        </div>
      )}
    </div>
  );
}
