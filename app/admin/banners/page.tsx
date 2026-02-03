'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { IBanner } from '@/types/banner';
import BannerForm from '@/components/admin/BannerForm';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners?admin=true');
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleToggleActive = async (banner: IBanner) => {
    try {
      const response = await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Failed to update banner:', error);
    }
  };

  const handleReorder = async (banner: IBanner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex((b) => b._id === banner._id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const newOrder = banners[newIndex].order || 0;
    const currentOrder = banner.order || 0;

    try {
      await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });
      await fetch(`/api/banners/${banners[newIndex]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: currentOrder }),
      });
      fetchBanners();
    } catch (error) {
      console.error('Failed to reorder banner:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBanner(null);
    fetchBanners();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading banners...</p>
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Banner Management</h1>
            <p className="mt-2 text-lg text-gray-500">Manage advertisement banners and promotions</p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 rounded-2xl bg-primary px-6 py-3 text-white transition-all hover:bg-primary-dark hover:shadow-lg active:scale-95 cursor-pointer font-bold"
          >
            <Plus className="h-5 w-5 cursor-pointer" />
            <span className="cursor-pointer">Add Banner</span>
          </button>
        </div>
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingBanner(null);
          }}
        />
      )}

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Order</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Performance</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner, index) => (
              <tr key={banner._id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(banner, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4 cursor-pointer" />
                    </button>
                    <span className="text-sm font-black text-gray-900 w-4 text-center">{banner.order || 0}</span>
                    <button
                      onClick={() => handleReorder(banner, 'down')}
                      disabled={index === banners.length - 1}
                      className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4 cursor-pointer" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-white/20 shadow-sm bg-gray-100">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[12rem]">{banner.title}</span>
                    {banner.description && (
                      <span className="text-xs text-gray-500 truncate max-w-[12rem]">{banner.description}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`inline-flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      banner.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                        : 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20'
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <Eye className="h-3.5 w-3.5 cursor-pointer" />
                        <span className="cursor-pointer">Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 cursor-pointer" />
                        <span className="cursor-pointer">Hidden</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900">{banner.clicks || 0}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Total Clicks</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <Edit className="h-4 w-4 cursor-pointer" />
                    </button>
                    <button
                      onClick={() => banner._id && handleDelete(banner._id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

