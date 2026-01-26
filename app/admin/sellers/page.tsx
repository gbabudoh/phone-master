'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, Ban, CheckCircle2, TrendingUp, Eye, ArrowLeft, Clock, Trash2, X } from 'lucide-react';
import { IUser, UserStatus } from '@/types/user';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface SellerStats {
  totalSales: number;
  totalEarnings: number;
  activeListings: number;
  rating: number;
}

interface SellerWithStats extends IUser {
  stats?: SellerStats;
  sellerDetails?: {
    companyName?: string;
    plan?: string;
  };
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<SellerWithStats | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers');
      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      const response = await fetch(`/api/admin/sellers/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchSellers();
      }
    } catch (error) {
      console.error('Failed to update seller status:', error);
    }
  };

  const handleDeleteSeller = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this seller? This action cannot be undone.')) return;
    try {
      const response = await fetch(`/api/admin/sellers/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchSellers();
        setShowViewModal(false);
      }
    } catch (error) {
      console.error('Failed to delete seller:', error);
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || seller.role === filterRole;
    const matchesStatus = filterStatus === 'all' || seller.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'wholesale_seller': return 'bg-purple-500/10 text-purple-600';
      case 'retail_seller': return 'bg-blue-500/10 text-blue-600';
      case 'personal_seller': return 'bg-green-500/10 text-green-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getRoleLabel = (role: string) => role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-600';
      case 'suspended': return 'bg-red-500/10 text-red-600';
      default: return 'bg-orange-500/10 text-orange-600';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'pending_verification') return 'Pending';
    if (status === 'active') return 'Approved';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading sellers...</p>
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Seller Management</h1>
            <p className="mt-2 text-lg text-gray-500">Manage individual, retail, and wholesale sellers</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-sm text-gray-500">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">Admin Controlled</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Sellers</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{sellers.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600"><TrendingUp className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Approved</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{sellers.filter((s) => s.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Pending</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{sellers.filter((s) => s.status === 'pending_verification').length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600"><Clock className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Suspended</p>
              <p className="mt-2 text-3xl font-black text-gray-900">{sellers.filter((s) => s.status === 'suspended').length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600"><Ban className="h-6 w-6" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-sm grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Search Sellers</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Email or name..." className="w-full rounded-2xl border border-gray-100 bg-white/50 py-3 pl-12 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Seller Type</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none cursor-pointer">
            <option value="all">All Types</option>
            <option value="personal_seller">Personal Seller</option>
            <option value="retail_seller">Retail Seller</option>
            <option value="wholesale_seller">Wholesale Seller</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-white/50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Approved</option>
            <option value="pending_verification">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredSellers.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{seller.email}</span>
                      {seller.profile?.firstName && (
                        <span className="text-xs text-gray-500">{seller.profile.firstName} {seller.profile.lastName}</span>
                      )}
                      {seller.sellerDetails?.companyName && (
                        <span className="text-xs text-primary font-medium">{seller.sellerDetails.companyName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${getRoleBadgeColor(seller.role)}`}>
                      {getRoleLabel(seller.role)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${getStatusColor(seller.status || '')}`}>
                      {getStatusLabel(seller.status || '')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{formatPrice(seller.stats?.totalEarnings || 0)}</span>
                      <span className="text-xs text-gray-500">{seller.stats?.totalSales || 0} sales</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                    {seller.createdAt ? formatDate(seller.createdAt) : '-'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Status Dropdown */}
                      <select
                        value={seller.status || 'pending_verification'}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus === 'delete') {
                            handleDeleteSeller(seller._id!);
                          } else {
                            handleStatusChange(seller._id!, newStatus as UserStatus);
                          }
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${getStatusColor(seller.status || '')}`}
                      >
                        <option value="pending_verification">Pending</option>
                        <option value="active">Approved</option>
                        <option value="suspended">Suspended</option>
                        <option value="delete" className="text-red-600">Delete</option>
                      </select>
                      {/* View Button */}
                      <button
                        onClick={() => { setSelectedSeller(seller); setShowViewModal(true); }}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        title="View Details"
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
            <Shield className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No sellers found</p>
          <p className="text-gray-500 mt-2">Adjust your filters or try a different search term.</p>
        </div>
      )}

      {/* View Seller Modal */}
      {showViewModal && selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Seller Details</h2>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedSeller.profile?.firstName?.charAt(0) || selectedSeller.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedSeller.profile?.firstName} {selectedSeller.profile?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedSeller.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Account Type</p>
                  <span className={`inline-flex mt-1 rounded-xl px-2.5 py-1 text-xs font-bold ${getRoleBadgeColor(selectedSeller.role)}`}>
                    {getRoleLabel(selectedSeller.role)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                  <span className={`inline-flex mt-1 rounded-xl px-2.5 py-1 text-xs font-bold ${getStatusColor(selectedSeller.status || '')}`}>
                    {getStatusLabel(selectedSeller.status || '')}
                  </span>
                </div>
                {selectedSeller.sellerDetails?.companyName && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Store Name</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedSeller.sellerDetails.companyName}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Sales</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedSeller.stats?.totalSales || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Earnings</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatPrice(selectedSeller.stats?.totalEarnings || 0)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Active Listings</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedSeller.stats?.activeListings || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Joined</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedSeller.createdAt ? formatDate(selectedSeller.createdAt) : '-'}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <select
                  value={selectedSeller.status || 'pending_verification'}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus === 'delete') {
                      handleDeleteSeller(selectedSeller._id!);
                    } else {
                      handleStatusChange(selectedSeller._id!, newStatus as UserStatus);
                      setSelectedSeller({ ...selectedSeller, status: newStatus as UserStatus });
                    }
                  }}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pending_verification">Set Pending</option>
                  <option value="active">Approve</option>
                  <option value="suspended">Suspend</option>
                  <option value="delete" className="text-red-600">Delete Account</option>
                </select>
                <button
                  onClick={() => handleDeleteSeller(selectedSeller._id!)}
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
