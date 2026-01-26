'use client';

import { useState, useEffect } from 'react';
import { PoundSterling, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    paidOut: 0,
  });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await fetch('/api/seller/payouts');
      if (response.ok) {
        const data = await response.json();
        setPayouts(data.payouts || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
        <p className="mt-2 text-foreground/60">Track your earnings and payouts</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earnings</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatPrice(stats.totalEarnings || 0)}
              </p>
            </div>
            <PoundSterling className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Pending</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatPrice(stats.pendingPayouts || 0)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Paid Out</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatPrice(stats.paidOut || 0)}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Payouts List */}
      {payouts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-accent-grey/20 bg-white shadow">
          <table className="min-w-full divide-y divide-accent-grey/20">
            <thead className="bg-accent-cyan-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-grey/20 bg-white">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-accent-cyan-light/30">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {payout.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {formatPrice(payout.amount || 0)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        payout.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground/60">
                    {payout.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <PoundSterling className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No payouts yet</p>
        </div>
      )}
    </div>
  );
}

