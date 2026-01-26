'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, Ban, UserCircle, TrendingUp, Eye, ArrowLeft, Trash2, X, ShoppingCart } from 'lucide-react';
import { IUser, UserStatus } from '@/types/user';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface BuyerStats {
  totalOrders: number;
  totalSpent: number;
}

interface BuyerWithStats extends IUser {
  stats?: BuyerStats;
}

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerWithStats | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await fetch('/api/admin/buyers');
      if (response.ok) {
        const data = await response.json();
        setBuyers(data.buyers || []);
      }
    } catch (error) {
      console.error('Failed to fetch buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      const response = await fetch(`/api/admin/buyers/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchBuyers();
        if (selectedBuyer && selectedBuyer._id === userId) {
          setSelectedBuyer({ ...selectedBuyer, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update buyer status:', error);
    }
  };

  const handleDeleteBuyer = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this buyer? This action cannot be undone.')) return;
    try {
      const response = await fetch(`/api/admin/buyers/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchBuyers();
        setShowViewModal(false);
      }
    } catch (error) {
      console.error('Failed to delete buyer:', error);
    }
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyer.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || buyer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600';
      case 'suspended': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'suspended') return 'Deactivated';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading buyers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/admin/dashboard" className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group cursor-pointer">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Buyer Management</h1>
            <p className="mt-2 text-lg text-gray-500">Manage buyer accounts</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-sm text-gray-500">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Admin Controlled</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Buyers</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{buyers.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600"><TrendingUp className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Active</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{buyers.filter((b) => b.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><UserCircle className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Deactivated</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{buyers.filter((b) => b.status === 'suspended').length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600"><Ban className="h-6 w-6" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-sm grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Search Buyers</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Email or name..." className="w-full rounded-2xl border border-gray-100 bg-white/50 py-3 pl-12 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredBuyers.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBuyers.map((buyer) => (
                <tr key={buyer._id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{buyer.email}</span>
                      {buyer.profile?.firstName && (
                        <span className="text-xs text-gray-500">{buyer.profile.firstName} {buyer.profile.lastName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${getStatusColor(buyer.status || '')}`}>
                      {getStatusLabel(buyer.status || '')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-900">{buyer.stats?.totalOrders || 0}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(buyer.stats?.totalSpent || 0)}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                    {buyer.createdAt ? formatDate(buyer.createdAt) : '-'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Status Toggle */}
                      {buyer.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(buyer._id!, 'suspended')}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          <span>Deactivate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(buyer._id!, 'active')}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <UserCircle className="h-3.5 w-3.5" />
                          <span>Activate</span>
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteBuyer(buyer._id!)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                      {/* View */}
                      <button
                        onClick={() => { setSelectedBuyer(buyer); setShowViewModal(true); }}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-16 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No buyers found</p>
          <p className="text-gray-500 mt-2">Adjust your filters or try a different search term.</p>
        </div>
      )}

      {/* View Buyer Modal */}
      {showViewModal && selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Buyer Details</h2>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedBuyer.profile?.firstName?.charAt(0) || selectedBuyer.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedBuyer.profile?.firstName} {selectedBuyer.profile?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedBuyer.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                  <span className={`inline-flex mt-1 rounded-xl px-2.5 py-1 text-xs font-bold ${getStatusColor(selectedBuyer.status || '')}`}>
                    {getStatusLabel(selectedBuyer.status || '')}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Joined</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedBuyer.createdAt ? formatDate(selectedBuyer.createdAt) : '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Orders</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedBuyer.stats?.totalOrders || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Spent</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatPrice(selectedBuyer.stats?.totalSpent || 0)}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                {selectedBuyer.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(selectedBuyer._id!, 'suspended')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-100 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedBuyer._id!, 'active')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Activate</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteBuyer(selectedBuyer._id!)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
