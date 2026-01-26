'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { ITransaction } from '@/types/transaction';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<(ITransaction & { buyerEmail?: string; sellerEmail?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Back Link */}
      <div className="space-y-4">
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform cursor-pointer" />
          <span className="cursor-pointer">Back to Dashboard</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Transaction Management</h1>
            <p className="mt-2 text-lg text-gray-500">View and monitor all platform transactions</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-sm text-gray-500">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="font-medium">{transactions.length} Total Transactions</span>
          </div>
        </div>
      </div>

      {/* Search Bar - Glassmorphic */}
      <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction ID..."
            className="w-full rounded-2xl border border-gray-100 bg-white/50 py-4 pl-12 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100/50 px-2.5 py-1 rounded-lg">
                      #{tx._id?.substring(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-900">{tx.buyerEmail || tx.buyerId.substring(0, 8)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-900">{tx.sellerEmail || tx.sellerId.substring(0, 8)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-gray-900">{formatPrice(tx.totalAmount)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-emerald-600">{formatPrice(tx.commissionFee)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${
                      tx.payoutStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600' :
                      tx.payoutStatus === 'pending' ? 'bg-orange-500/10 text-orange-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {tx.payoutStatus?.charAt(0).toUpperCase() + (tx.payoutStatus?.slice(1) || '')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right text-sm text-gray-500 font-medium whitespace-nowrap">
                    {formatDate(tx.purchaseDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-16 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No transactions found</p>
          <p className="text-gray-500 mt-2">There are currently no transactions to display.</p>
        </div>
      )}
    </div>
  );
}

