'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Save, X, Upload, Smartphone, Package, Gift } from 'lucide-react';
import Link from 'next/link';
import { IProduct } from '@/types/product';

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<'handset' | 'accessory' | 'service_voucher'>('handset');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '1',
    images: [] as string[],
    // Handset details
    brand: '',
    model: '',
    IMEI: '',
    condition: 'used' as 'new' | 'refurbished' | 'used',
    grade: 'A' as 'A' | 'B' | 'C',
    networkStatus: 'unlocked' as 'unlocked' | 'locked',
    storage: '',
    color: '',
    networkLock: '',
    // Accessory details
    accessoryType: 'case' as 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other',
    compatibility: '',
    oem: 'aftermarket' as 'original' | 'aftermarket',
    accessoryBrand: '',
    // Service details
    serviceType: 'top_up' as 'top_up' | 'unlocking' | 'repair_voucher',
    provider: '',
    validity: '',
    serviceNetwork: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      // Check if user is a seller
      if (user.role === 'buyer') {
        router.push('/personal-seller/dashboard');
        return;
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'buyer') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build product data based on category
      const productData: Partial<IProduct> = {
        title: formData.title,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100), // Convert to pence
        stock: parseInt(formData.stock),
        images: formData.images,
        category,
        status: 'draft', // Save as draft initially
      };

      if (category === 'handset') {
        productData.handsetDetails = {
          brand: formData.brand,
          model: formData.model,
          IMEI: formData.IMEI,
          condition: formData.condition,
          grade: formData.grade,
          networkStatus: formData.networkStatus,
          storage: formData.storage,
          color: formData.color,
          networkLock: formData.networkLock || undefined,
        };
      } else if (category === 'accessory') {
        productData.accessoryDetails = {
          type: formData.accessoryType,
          compatibility: formData.compatibility.split(',').map(s => s.trim()).filter(Boolean),
          oem: formData.oem,
          brand: formData.accessoryBrand || undefined,
        };
      } else if (category === 'service_voucher') {
        productData.serviceDetails = {
          type: formData.serviceType,
          provider: formData.provider,
          validity: formData.validity || undefined,
          network: formData.serviceNetwork || undefined,
        };
      }

      const response = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/personal-seller/dashboard/inventory');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', 'products');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to upload image');
        }

        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="mt-2 text-foreground/60">Create a new product listing</p>
        </div>
        <Link
          href="/personal-seller/dashboard/inventory"
          className="flex items-center space-x-2 rounded-lg border border-accent-grey/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Product Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setCategory('handset')}
              className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all ${
                category === 'handset'
                  ? 'border-primary bg-accent-cyan-light'
                  : 'border-accent-grey/20 hover:border-primary/50'
              }`}
            >
              <Smartphone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Handset</h3>
                <p className="text-xs text-foreground/60">Mobile phones</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCategory('accessory')}
              className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all ${
                category === 'accessory'
                  ? 'border-primary bg-accent-cyan-light'
                  : 'border-accent-grey/20 hover:border-primary/50'
              }`}
            >
              <Package className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Accessory</h3>
                <p className="text-xs text-foreground/60">Cases, chargers, etc.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCategory('service_voucher')}
              className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all ${
                category === 'service_voucher'
                  ? 'border-primary bg-accent-cyan-light'
                  : 'border-accent-grey/20 hover:border-primary/50'
              }`}
            >
              <Gift className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Service Voucher</h3>
                <p className="text-xs text-foreground/60">Top-ups, unlocking</p>
              </div>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                placeholder="e.g., iPhone 15 Pro 256GB - Blue"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                placeholder="Describe your product in detail..."
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Price (£) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category-Specific Fields */}
        {category === 'handset' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Handset Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., Apple, Samsung"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., iPhone 15 Pro"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">IMEI *</label>
                <input
                  type="text"
                  required
                  value={formData.IMEI}
                  onChange={(e) => setFormData({ ...formData, IMEI: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="15-digit IMEI number"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Storage *</label>
                <input
                  type="text"
                  required
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., 128GB, 256GB"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Condition *</label>
                <select
                  required
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'new' | 'refurbished' | 'used' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Grade *</label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value as 'A' | 'B' | 'C' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="A">Grade A - Excellent</option>
                  <option value="B">Grade B - Good</option>
                  <option value="C">Grade C - Fair</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Network Status *</label>
                <select
                  required
                  value={formData.networkStatus}
                  onChange={(e) => setFormData({ ...formData, networkStatus: e.target.value as 'unlocked' | 'locked' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="unlocked">Unlocked</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
              {formData.networkStatus === 'locked' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Network Lock</label>
                  <input
                    type="text"
                    value={formData.networkLock}
                    onChange={(e) => setFormData({ ...formData, networkLock: e.target.value })}
                    className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                    placeholder="e.g., EE, Vodafone"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., Blue, Black, White"
                />
              </div>
            </div>
          </div>
        )}

        {category === 'accessory' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Accessory Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Type *</label>
                <select
                  required
                  value={formData.accessoryType}
                  onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value as 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="case">Case</option>
                  <option value="charger">Charger</option>
                  <option value="screen_protector">Screen Protector</option>
                  <option value="cable">Cable</option>
                  <option value="power_bank">Power Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">OEM *</label>
                <select
                  required
                  value={formData.oem}
                  onChange={(e) => setFormData({ ...formData, oem: e.target.value as 'original' | 'aftermarket' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="original">Original</option>
                  <option value="aftermarket">Aftermarket</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Compatibility *</label>
                <input
                  type="text"
                  required
                  value={formData.compatibility}
                  onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., iPhone 15, iPhone 14, iPhone 13 (comma-separated)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Brand</label>
                <input
                  type="text"
                  value={formData.accessoryBrand}
                  onChange={(e) => setFormData({ ...formData, accessoryBrand: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., Apple, Belkin"
                />
              </div>
            </div>
          </div>
        )}

        {category === 'service_voucher' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Service Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Service Type *</label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as 'top_up' | 'unlocking' | 'repair_voucher' })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="top_up">Top Up</option>
                  <option value="unlocking">Unlocking</option>
                  <option value="repair_voucher">Repair Voucher</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Provider *</label>
                <input
                  type="text"
                  required
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., EE, Vodafone, Apple"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Validity</label>
                <input
                  type="text"
                  value={formData.validity}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., 30 days, 1 year"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Network</label>
                <input
                  type="text"
                  value={formData.serviceNetwork}
                  onChange={(e) => setFormData({ ...formData, serviceNetwork: e.target.value })}
                  className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="e.g., EE, Vodafone, O2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Product Images</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Upload Images</label>
              <div className="flex items-center space-x-4">
                <label className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-dashed border-accent-grey/30 px-6 py-4 transition-colors hover:border-primary hover:bg-accent-cyan-light/50">
                  <Upload className="h-5 w-5 text-foreground/60" />
                  <span className="text-sm text-foreground/60">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-foreground/50">
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB per image.
              </p>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative h-32 w-full">
                    <Image
                      src={url}
                      alt={`Product ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/personal-seller/dashboard/inventory"
            className="rounded-lg border border-accent-grey/20 px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Creating...' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

