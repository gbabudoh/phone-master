'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Save, X, Upload, Smartphone, Package, Gift, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<'handset' | 'accessory' | 'service_voucher'>('handset');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '1',
    images: [] as string[],
    status: 'draft' as string,
    brand: '',
    model: '',
    IMEI: '',
    condition: 'used' as 'new' | 'refurbished' | 'used',
    grade: 'A' as 'A' | 'B' | 'C',
    networkStatus: 'unlocked' as 'unlocked' | 'locked',
    storage: '',
    color: '',
    networkLock: '',
    accessoryType: 'case' as 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other',
    compatibility: '',
    oem: 'aftermarket' as 'original' | 'aftermarket',
    accessoryBrand: '',
    serviceType: 'top_up' as 'top_up' | 'unlocking' | 'repair_voucher',
    provider: '',
    validity: '',
    serviceNetwork: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/listings/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        const product = data.product;
        
        setCategory(product.category);
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: (product.price / 100).toString(),
          stock: product.stock?.toString() || '1',
          images: product.images || [],
          status: product.status || 'draft',
          brand: product.handsetDetails?.brand || '',
          model: product.handsetDetails?.model || '',
          IMEI: product.handsetDetails?.IMEI || '',
          condition: product.handsetDetails?.condition || 'used',
          grade: product.handsetDetails?.grade || 'A',
          networkStatus: product.handsetDetails?.networkStatus || 'unlocked',
          storage: product.handsetDetails?.storage || '',
          color: product.handsetDetails?.color || '',
          networkLock: product.handsetDetails?.networkLock || '',
          accessoryType: product.accessoryDetails?.type || 'case',
          compatibility: product.accessoryDetails?.compatibility?.join(', ') || '',
          oem: product.accessoryDetails?.oem || 'aftermarket',
          accessoryBrand: product.accessoryDetails?.brand || '',
          serviceType: product.serviceDetails?.type || 'top_up',
          provider: product.serviceDetails?.provider || '',
          validity: product.serviceDetails?.validity || '',
          serviceNetwork: product.serviceDetails?.network || '',
        });
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setFetching(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const productData: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        stock: parseInt(formData.stock),
        images: formData.images,
        category,
        status: formData.status,
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

      const response = await fetch(`/api/listings/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/retail-seller/dashboard/inventory');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/listings/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      router.push('/retail-seller/dashboard/inventory');
    } catch (err) {
      setError('Failed to delete product');
    }
  };

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
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  if (authLoading || fetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="mt-2 text-foreground/60">Update your product listing</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
          <Link
            href="/retail-seller/dashboard/inventory"
            className="flex items-center space-x-2 rounded-lg border border-accent-grey/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
        </div>
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
            <button type="button" onClick={() => setCategory('handset')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'handset' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}>
              <Smartphone className="h-6 w-6 text-primary" />
              <div><h3 className="font-semibold">Handset</h3><p className="text-xs text-foreground/60">Mobile phones</p></div>
            </button>
            <button type="button" onClick={() => setCategory('accessory')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'accessory' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}>
              <Package className="h-6 w-6 text-primary" />
              <div><h3 className="font-semibold">Accessory</h3><p className="text-xs text-foreground/60">Cases, chargers, etc.</p></div>
            </button>
            <button type="button" onClick={() => setCategory('service_voucher')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'service_voucher' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}>
              <Gift className="h-6 w-6 text-primary" />
              <div><h3 className="font-semibold">Service Voucher</h3><p className="text-xs text-foreground/60">Top-ups, unlocking</p></div>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Product Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Description *</label>
              <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Price (£) *</label>
                <input type="number" required step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Stock *</label>
                <input type="number" required min="1" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Handset Details */}
        {category === 'handset' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Handset Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Brand *</label><input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">Model *</label><input type="text" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">IMEI *</label><input type="text" required value={formData.IMEI} onChange={(e) => setFormData({ ...formData, IMEI: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">Storage *</label><input type="text" required value={formData.storage} onChange={(e) => setFormData({ ...formData, storage: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">Condition *</label><select required value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'new' | 'refurbished' | 'used' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="new">New</option><option value="refurbished">Refurbished</option><option value="used">Used</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Grade *</label><select required value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value as 'A' | 'B' | 'C' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Network Status *</label><select required value={formData.networkStatus} onChange={(e) => setFormData({ ...formData, networkStatus: e.target.value as 'unlocked' | 'locked' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="unlocked">Unlocked</option><option value="locked">Locked</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Color</label><input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
            </div>
          </div>
        )}

        {/* Accessory Details */}
        {category === 'accessory' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Accessory Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Type *</label><select required value={formData.accessoryType} onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value as 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="case">Case</option><option value="charger">Charger</option><option value="screen_protector">Screen Protector</option><option value="cable">Cable</option><option value="power_bank">Power Bank</option><option value="other">Other</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">OEM *</label><select required value={formData.oem} onChange={(e) => setFormData({ ...formData, oem: e.target.value as 'original' | 'aftermarket' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="original">Original</option><option value="aftermarket">Aftermarket</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Compatibility *</label><input type="text" required value={formData.compatibility} onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="Comma-separated" /></div>
              <div><label className="mb-1 block text-sm font-medium">Brand</label><input type="text" value={formData.accessoryBrand} onChange={(e) => setFormData({ ...formData, accessoryBrand: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
            </div>
          </div>
        )}

        {/* Service Details */}
        {category === 'service_voucher' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Service Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Service Type *</label><select required value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as 'top_up' | 'unlocking' | 'repair_voucher' })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="top_up">Top Up</option><option value="unlocking">Unlocking</option><option value="repair_voucher">Repair Voucher</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Provider *</label><input type="text" required value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">Validity</label><input type="text" value={formData.validity} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
              <div><label className="mb-1 block text-sm font-medium">Network</label><input type="text" value={formData.serviceNetwork} onChange={(e) => setFormData({ ...formData, serviceNetwork: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Product Images</h2>
          <div className="space-y-4">
            <div>
              <label className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-dashed border-accent-grey/30 px-6 py-4 transition-colors hover:border-primary hover:bg-accent-cyan-light/50">
                <Upload className="h-5 w-5 text-foreground/60" />
                <span className="text-sm text-foreground/60">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
              <p className="mt-2 text-xs text-foreground/50">Supported: JPEG, PNG, GIF, WebP. Max 5MB.</p>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative h-32 w-full bg-gray-50 rounded-lg">
                    <Image src={url} alt={`Product ${index + 1}`} fill className="rounded-lg object-contain p-2" unoptimized />
                    <button type="button" onClick={() => handleImageRemove(index)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/retail-seller/dashboard/inventory" className="rounded-lg border border-accent-grey/20 px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer">
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
