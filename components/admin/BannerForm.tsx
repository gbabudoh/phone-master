'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { IBanner } from '@/types/banner';
import Image from 'next/image';

interface BannerFormProps {
  banner?: IBanner;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BannerForm({ banner, onSuccess, onCancel }: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    linkUrl: '',
    linkText: '',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        description: banner.description || '',
        imageUrl: banner.imageUrl || '',
        videoUrl: banner.videoUrl || '',
        linkUrl: banner.linkUrl || '',
        linkText: banner.linkText || '',
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        order: banner.order || 0,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString().split('T')[0]
          : '',
        endDate: banner.endDate
          ? new Date(banner.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [banner]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'banners');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (file.type.startsWith('video/')) {
        setFormData({ ...formData, videoUrl: data.url, imageUrl: '' });
      } else {
        setFormData({ ...formData, imageUrl: data.url, videoUrl: '' });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      };

      const url = banner?._id ? `/api/banners/${banner._id}` : '/api/banners';
      const method = banner?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save banner');
      }

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-foreground/60 hover:text-foreground cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold">
          {banner ? 'Edit Banner' : 'Create New Banner'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Banner Media (Image or Video) *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {formData.imageUrl || formData.videoUrl ? (
              <div className="relative h-64 w-full bg-gray-50 rounded-lg border border-accent-grey/10">
                {formData.videoUrl ? (
                  <video
                    src={formData.videoUrl}
                    className="h-full w-full rounded-lg object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <Image
                    src={formData.imageUrl}
                    alt="Banner preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                     className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-foreground cursor-pointer"
                  >
                    {uploading ? 'Uploading...' : 'Change Media'}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-accent-grey/40 bg-accent-cyan-light/20 transition-colors hover:border-primary hover:bg-accent-cyan-light/40"
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="mt-2 text-sm text-foreground/60">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-accent-grey" />
                    <span className="mt-2 text-sm font-medium text-foreground/60">
                      Click to upload image or video
                    </span>
                    <span className="mt-1 text-xs text-foreground/40">
                      JPEG, PNG, Video (max 100MB)
                    </span>
                  </>
                )}
              </div>
            )}
            

          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Link URL
              </label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Link Text
              </label>
              <input
                type="text"
                value={formData.linkText}
                onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                placeholder="Learn More"
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-accent-grey/20 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-accent-grey/20 px-4 py-2 text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : banner ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

