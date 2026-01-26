'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, PoundSterling, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  interface SalesChartData {
    month: string;
    revenue: number;
  }

  interface ProductChartData {
    name: string;
    sales: number;
  }

  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalViews: 0,
    activeListings: 0,
  });
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [productData, setProductData] = useState<ProductChartData[]>([]);

  const processSalesData = useCallback((orders: { purchaseDate: string | Date; totalAmount: number }[]) => {
    // Group orders by month
    const monthly: Record<string, number> = {};
    orders.forEach((order) => {
      const date = new Date(order.purchaseDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly[month] = (monthly[month] || 0) + order.totalAmount;
    });
    
    return Object.entries(monthly)
      .map(([month, revenue]): SalesChartData => ({ month, revenue: revenue / 100 }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  }, []);

  const processProductData = useCallback((orders: { items?: { productTitle: string; quantity: number }[] }[]) => {
    // Count product sales
    const productCounts: Record<string, number> = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        productCounts[item.productTitle] = (productCounts[item.productTitle] || 0) + item.quantity;
      });
    });
    
    return Object.entries(productCounts)
      .map(([name, sales]): ProductChartData => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/seller/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(prev => data.stats || prev);
        }

        const ordersResponse = await fetch('/api/seller/orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setSalesData(processSalesData(ordersData.orders || []));
          setProductData(processProductData(ordersData.orders || []));
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [processProductData, processSalesData]);

  const statCards = [
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue || 0),
      icon: PoundSterling,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Listings',
      value: stats.activeListings,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-2 text-foreground/60">Track your sales performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-lg border border-accent-grey/20 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`rounded-full ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Sales Over Time</h2>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatPrice((value || 0) * 100)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#014f86" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-foreground/60">
              No sales data available
            </div>
          )}
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Top Products</h2>
          {productData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#014f86" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-foreground/60">
              No product data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

