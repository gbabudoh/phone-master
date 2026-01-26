'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Package } from 'lucide-react';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/seller/products');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleToggleStatus = async (product: IProduct) => {
    try {
      const newStatus = product.status === 'active' ? 'draft' : 'active';
      const response = await fetch(`/api/listings/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="mt-2 text-foreground/60">Manage your wholesale product listings</p>
        </div>
        <Link
          href="/wholesale-seller/dashboard/inventory/new"
          className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-accent-grey/20 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-accent-grey/20 bg-white shadow">
          <table className="min-w-full divide-y divide-accent-grey/20">
            <thead className="bg-accent-cyan-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-grey/20 bg-white">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-accent-cyan-light/30">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-12 w-12 rounded object-contain bg-gray-50"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">{product.title}</div>
                        <div className="text-xs text-foreground/60">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {formatPrice(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {product.stock}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'sold'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className="text-foreground/60 hover:text-primary cursor-pointer"
                      >
                        {product.status === 'active' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/wholesale-seller/dashboard/inventory/${product._id}`}
                        className="text-primary hover:text-primary-dark cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => product._id && handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No products found</p>
          <Link
            href="/wholesale-seller/dashboard/inventory/new"
            className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
}
