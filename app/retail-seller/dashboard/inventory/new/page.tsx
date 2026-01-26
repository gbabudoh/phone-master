'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Save, X, Upload, Smartphone, Package, Gift, Plus, Trash2, Truck, Percent, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { IProduct } from '@/types/product';

interface DiscountTier {
  minQuantity: string;
  discountPercent: string;
}

interface ShippingOption {
  name: string;
  price: string;
  estimatedDays: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<'handset' | 'accessory' | 'service_voucher'>('handset');
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', stock: '1', images: [] as string[],
    brand: '', model: '', IMEI: '', condition: 'used' as 'new' | 'refurbished' | 'used',
    grade: 'A' as 'A' | 'B' | 'C', networkStatus: 'unlocked' as 'unlocked' | 'locked',
    storage: '', color: '', networkLock: '',
    accessoryType: 'case' as 'case' | 'charger' | 'screen_protector' | 'cable' | 'power_bank' | 'other',
    compatibility: '', oem: 'aftermarket' as 'original' | 'aftermarket', accessoryBrand: '',
    serviceType: 'top_up' as 'top_up' | 'unlocking' | 'repair_voucher',
    provider: '', validity: '', serviceNetwork: '',
  });

  // Seller options
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([
    { name: 'Standard Shipping', price: '0', estimatedDays: '3-5 business days' }
  ]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push('/login'); return; }
      if (user.role === 'buyer') { router.push('/retail-seller/dashboard'); return; }
    }
  }, [user, authLoading, router]);

  const addDiscountTier = () => setDiscountTiers([...discountTiers, { minQuantity: '', discountPercent: '' }]);
  const removeDiscountTier = (index: number) => setDiscountTiers(discountTiers.filter((_, i) => i !== index));
  const updateDiscountTier = (index: number, field: keyof DiscountTier, value: string) => {
    const updated = [...discountTiers]; updated[index][field] = value; setDiscountTiers(updated);
  };

  const addShippingOption = () => setShippingOptions([...shippingOptions, { name: '', price: '', estimatedDays: '' }]);
  const removeShippingOption = (index: number) => { if (shippingOptions.length > 1) setShippingOptions(shippingOptions.filter((_, i) => i !== index)); };
  const updateShippingOption = (index: number, field: keyof ShippingOption, value: string) => {
    const updated = [...shippingOptions]; updated[index][field] = value; setShippingOptions(updated);
  };

  if (authLoading) {
    return (<div className="flex h-screen items-center justify-center"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div><p className="mt-4 text-foreground/60">Loading...</p></div></div>);
  }
  if (!user || user.role === 'buyer') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const productData: Partial<IProduct> = {
        title: formData.title, description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        stock: parseInt(formData.stock), images: formData.images, category, status: 'draft',
        wholesaleDetails: {
          minOrderQuantity: 1,
          termsAndConditions: termsAndConditions || undefined,
          discountTiers: discountTiers.filter(t => t.minQuantity && t.discountPercent).map(t => ({
            minQuantity: parseInt(t.minQuantity), discountPercent: parseFloat(t.discountPercent),
          })),
          shippingOptions: shippingOptions.filter(s => s.name).map(s => ({
            name: s.name, price: Math.round(parseFloat(s.price || '0') * 100), estimatedDays: s.estimatedDays,
          })),
        },
      };
      if (category === 'handset') {
        productData.handsetDetails = { brand: formData.brand, model: formData.model, IMEI: formData.IMEI, condition: formData.condition, grade: formData.grade, networkStatus: formData.networkStatus, storage: formData.storage, color: formData.color, networkLock: formData.networkLock || undefined };
      } else if (category === 'accessory') {
        productData.accessoryDetails = { type: formData.accessoryType, compatibility: formData.compatibility.split(',').map(s => s.trim()).filter(Boolean), oem: formData.oem, brand: formData.accessoryBrand || undefined };
      } else if (category === 'service_voucher') {
        productData.serviceDetails = { type: formData.serviceType, provider: formData.provider, validity: formData.validity || undefined, network: formData.serviceNetwork || undefined };
      }
      const response = await fetch('/api/listings/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Failed to create product'); }
      router.push('/retail-seller/dashboard/inventory');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to create product'); } finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    setUploading(true); setError('');
    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData(); formDataUpload.append('file', file); formDataUpload.append('folder', 'products');
        const response = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
        if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Failed to upload image'); }
        const data = await response.json();
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to upload image'); } finally { setUploading(false); e.target.value = ''; }
  };
  const handleImageRemove = (index: number) => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-foreground">Add New Product</h1><p className="mt-2 text-foreground/60">Create a new product listing</p></div>
        <Link href="/retail-seller/dashboard/inventory" className="flex items-center space-x-2 rounded-lg border border-accent-grey/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"><X className="h-4 w-4" /><span>Cancel</span></Link>
      </div>
      {error && (<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"><p className="text-sm text-red-600">{error}</p></div>)}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Product Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button type="button" onClick={() => setCategory('handset')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'handset' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}><Smartphone className="h-6 w-6 text-primary" /><div><h3 className="font-semibold">Handset</h3><p className="text-xs text-foreground/60">Mobile phones</p></div></button>
            <button type="button" onClick={() => setCategory('accessory')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'accessory' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}><Package className="h-6 w-6 text-primary" /><div><h3 className="font-semibold">Accessory</h3><p className="text-xs text-foreground/60">Cases, chargers, etc.</p></div></button>
            <button type="button" onClick={() => setCategory('service_voucher')} className={`flex items-center space-x-3 rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${category === 'service_voucher' ? 'border-primary bg-accent-cyan-light' : 'border-accent-grey/20 hover:border-primary/50'}`}><Gift className="h-6 w-6 text-primary" /><div><h3 className="font-semibold">Service Voucher</h3><p className="text-xs text-foreground/60">Top-ups, unlocking</p></div></button>
          </div>
        </div>
        {/* Basic Info */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Product Title *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="e.g., iPhone 15 Pro 256GB - Blue" /></div>
            <div><label className="mb-1 block text-sm font-medium">Description *</label><textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="Describe your product..." /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Price (£) *</label><input type="number" required step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="0.00" /></div>
              <div><label className="mb-1 block text-sm font-medium">Stock Quantity *</label><input type="number" required min="1" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" /></div>
            </div>
          </div>
        </div>

        {/* Seller Options */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-6">
          <div className="flex items-center space-x-2 mb-4"><Settings className="h-5 w-5 text-blue-600" /><h2 className="text-lg font-semibold text-blue-900">Seller Options</h2></div>
          {/* Discounts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2"><Percent className="h-4 w-4 text-blue-600" /><label className="text-sm font-medium">Discounts</label></div>
              <button type="button" onClick={addDiscountTier} className="flex items-center space-x-1 text-sm text-primary hover:text-primary-dark cursor-pointer"><Plus className="h-4 w-4" /><span>Add Discount</span></button>
            </div>
            <p className="mb-3 text-xs text-foreground/50">Offer discounts for bulk purchases</p>
            {discountTiers.length === 0 ? (<p className="text-sm text-foreground/40 italic">No discounts added</p>) : (
              <div className="space-y-2">
                {discountTiers.map((tier, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-accent-grey/20">
                    <div className="flex-1"><label className="text-xs text-foreground/60">Min Quantity</label><input type="number" min="1" value={tier.minQuantity} onChange={(e) => updateDiscountTier(index, 'minQuantity', e.target.value)} className="w-full rounded border border-accent-grey/20 px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g., 5" /></div>
                    <div className="flex-1"><label className="text-xs text-foreground/60">Discount %</label><input type="number" min="0" max="100" step="0.5" value={tier.discountPercent} onChange={(e) => updateDiscountTier(index, 'discountPercent', e.target.value)} className="w-full rounded border border-accent-grey/20 px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g., 5" /></div>
                    <button type="button" onClick={() => removeDiscountTier(index)} className="mt-4 text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Shipping */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2"><Truck className="h-4 w-4 text-blue-600" /><label className="text-sm font-medium">Shipping Options</label></div>
              <button type="button" onClick={addShippingOption} className="flex items-center space-x-1 text-sm text-primary hover:text-primary-dark cursor-pointer"><Plus className="h-4 w-4" /><span>Add Option</span></button>
            </div>
            <p className="mb-3 text-xs text-foreground/50">Define shipping methods for buyers</p>
            <div className="space-y-2">
              {shippingOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-accent-grey/20">
                  <div className="flex-1"><label className="text-xs text-foreground/60">Name *</label><input type="text" value={option.name} onChange={(e) => updateShippingOption(index, 'name', e.target.value)} className="w-full rounded border border-accent-grey/20 px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g., Express" /></div>
                  <div className="w-24"><label className="text-xs text-foreground/60">Price (£)</label><input type="number" min="0" step="0.01" value={option.price} onChange={(e) => updateShippingOption(index, 'price', e.target.value)} className="w-full rounded border border-accent-grey/20 px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="0.00" /></div>
                  <div className="flex-1"><label className="text-xs text-foreground/60">Delivery Time</label><input type="text" value={option.estimatedDays} onChange={(e) => updateShippingOption(index, 'estimatedDays', e.target.value)} className="w-full rounded border border-accent-grey/20 px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g., 2-3 days" /></div>
                  {shippingOptions.length > 1 && (<button type="button" onClick={() => removeShippingOption(index)} className="mt-4 text-red-500 hover:text-red-700 cursor-pointer"><Trash2 className="h-4 w-4" /></button>)}
                </div>
              ))}
            </div>
          </div>
          {/* Terms */}
          <div>
            <div className="flex items-center space-x-2 mb-2"><FileText className="h-4 w-4 text-blue-600" /><label className="text-sm font-medium">Terms & Conditions</label></div>
            <textarea rows={3} value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} className="w-full rounded-lg border border-accent-grey/20 bg-white px-4 py-2 focus:border-primary focus:outline-none" placeholder="Enter your terms, return policy, etc." />
          </div>
        </div>

        {/* Handset Details */}
        {category === 'handset' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Handset Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Brand *</label><input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="e.g., Apple, Samsung" /></div>
              <div><label className="mb-1 block text-sm font-medium">Model *</label><input type="text" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="e.g., iPhone 15 Pro" /></div>
              <div><label className="mb-1 block text-sm font-medium">IMEI *</label><input type="text" required value={formData.IMEI} onChange={(e) => setFormData({ ...formData, IMEI: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="15-digit IMEI" /></div>
              <div><label className="mb-1 block text-sm font-medium">Storage *</label><input type="text" required value={formData.storage} onChange={(e) => setFormData({ ...formData, storage: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="e.g., 128GB" /></div>
              <div><label className="mb-1 block text-sm font-medium">Condition *</label><select required value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="new">New</option><option value="refurbished">Refurbished</option><option value="used">Used</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Grade *</label><select required value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Network Status *</label><select required value={formData.networkStatus} onChange={(e) => setFormData({ ...formData, networkStatus: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="unlocked">Unlocked</option><option value="locked">Locked</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">Color</label><input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none" placeholder="e.g., Blue" /></div>
            </div>
          </div>
        )}
        {/* Accessory Details */}
        {category === 'accessory' && (
          <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Accessory Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">Type *</label><select required value={formData.accessoryType} onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="case">Case</option><option value="charger">Charger</option><option value="screen_protector">Screen Protector</option><option value="cable">Cable</option><option value="power_bank">Power Bank</option><option value="other">Other</option></select></div>
              <div><label className="mb-1 block text-sm font-medium">OEM *</label><select required value={formData.oem} onChange={(e) => setFormData({ ...formData, oem: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="original">Original</option><option value="aftermarket">Aftermarket</option></select></div>
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
              <div><label className="mb-1 block text-sm font-medium">Type *</label><select required value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })} className="w-full rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none cursor-pointer"><option value="top_up">Top Up</option><option value="unlocking">Unlocking</option><option value="repair_voucher">Repair Voucher</option></select></div>
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
            <label className="flex cursor-pointer items-center space-x-2 rounded-lg border-2 border-dashed border-accent-grey/30 px-6 py-4 transition-colors hover:border-primary hover:bg-accent-cyan-light/50">
              <Upload className="h-5 w-5 text-foreground/60" />
              <span className="text-sm text-foreground/60">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleImageUpload} disabled={uploading} className="hidden" />
            </label>
            <p className="text-xs text-foreground/50">Supported: JPEG, PNG, GIF, WebP. Max 5MB.</p>
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
          <button type="submit" disabled={loading} className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 cursor-pointer"><Save className="h-4 w-4" /><span>{loading ? 'Creating...' : 'Create Product'}</span></button>
        </div>
      </form>
    </div>
  );
}