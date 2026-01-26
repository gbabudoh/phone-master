'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, AlertCircle, Package, ArrowLeft } from 'lucide-react';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/listings/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading products...</p>
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Product Management</h1>
            <p className="mt-2 text-lg text-gray-500">Manage and monitor all marketplace products</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm text-sm text-gray-500">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-medium">{products.length} Total Products</span>
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
            placeholder="Search products by title..."
            className="w-full rounded-2xl border border-gray-100 bg-white/50 py-4 pl-12 pr-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      {filteredProducts.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Seller ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      {product.images && product.images.length > 0 && (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-2xl object-cover border border-white/20 shadow-sm"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">{product.title}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100/50 px-2 py-1 rounded-lg">
                      {product.sellerId?.substring(0, 12)}...
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-gray-900">{formatPrice(product.price)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-bold ${
                      product.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                      product.status === 'under_review' ? 'bg-orange-500/10 text-orange-600' :
                      'bg-gray-500/10 text-gray-600'
                    }`}>
                      {product.status?.charAt(0).toUpperCase() + (product.status?.slice(1).replace('_', ' ') || '')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {product.status === 'under_review' && (
                        <button
                          onClick={() => product._id && handleStatusChange(product._id, 'active')}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Approve"
                        >
                          <AlertCircle className="h-4 w-4 cursor-pointer" />
                        </button>
                      )}
                      <button
                        onClick={() => product._id && handleStatusChange(product._id, product.status === 'active' ? 'draft' : 'active')}
                        className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        title={product.status === 'active' ? 'Hide' : 'Show'}
                      >
                        {product.status === 'active' ? (
                          <EyeOff className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <Eye className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                      <Link
                        href={`/listing/${product._id}`}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer text-xs font-bold"
                      >
                        View
                      </Link>
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
            <Package className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900">No products found</p>
          <p className="text-gray-500 mt-2">Adjust your search or add some products.</p>
        </div>
      )}
    </div>
  );
}

