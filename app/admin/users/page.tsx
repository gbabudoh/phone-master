'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, Ban, CheckCircle2, Users, ArrowLeft } from 'lucide-react';
import { IUser, UserRole, UserStatus } from '@/types/user';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'wholesale_seller':
        return 'bg-purple-500/10 text-purple-600';
      case 'retail_seller':
        return 'bg-blue-500/10 text-blue-600';
      case 'personal_seller':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading users...</p>
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">User Management</h1>
            <p className="mt-2 text-lg text-gray-500">Manage and monitor all platform users</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-sm text-gray-500">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{users.length} Total Users</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar - Glassmorphic */}
      <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by email or name..."
            className="w-full rounded-2xl border border-gray-100 bg-white/50 py-4 pl-12 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-white/50 py-4 px-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all appearance-none cursor-pointer font-bold text-gray-700"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="personal_seller">Personal Seller</option>
            <option value="retail_seller">Retail Seller</option>
            <option value="wholesale_seller">Wholesale Seller</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{user.email}</span>
                      {user.profile?.firstName && (
                        <span className="text-xs text-gray-500">
                          {user.profile.firstName} {user.profile.lastName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${
                      user.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                      user.status === 'suspended' ? 'bg-red-500/10 text-red-600' :
                      'bg-orange-500/10 text-orange-600'
                    }`}>
                      {user.status?.replace('_', ' ').charAt(0).toUpperCase() + (user.status?.replace('_', ' ').slice(1) || '')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                    {user.createdAt ? formatDate(user.createdAt) : '-'}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {user.status !== 'active' && (
                        <button
                          onClick={() => user._id && handleStatusChange(user._id, 'active')}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Activate"
                        >
                          <CheckCircle2 className="h-4 w-4 cursor-pointer" />
                        </button>
                      )}
                      {user.status !== 'suspended' && (
                        <button
                          onClick={() => user._id && handleStatusChange(user._id, 'suspended')}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Suspend"
                        >
                          <Ban className="h-4 w-4 cursor-pointer" />
                        </button>
                      )}
                      <button 
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 cursor-pointer" />
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
            <Users className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No users found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}

