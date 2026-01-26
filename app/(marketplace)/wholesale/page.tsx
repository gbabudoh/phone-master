'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/marketplace/ProductCard';
import SearchFilterBar, { FilterState } from '@/components/marketplace/SearchFilterBar';
import { IProduct } from '@/types/product';
import { LayoutGrid, List } from 'lucide-react';

export default function WholesalePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const performSearch = async (query: string, filters: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sellerType', 'wholesale_seller'); // Only wholesale sellers
      if (query) params.set('q', query);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.condition !== 'all') params.set('condition', filters.condition);
      if (filters.grade !== 'all') params.set('grade', filters.grade);
      if (filters.networkStatus !== 'all') params.set('networkStatus', filters.networkStatus);

      const response = await fetch(`/api/listings/search?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFilters: FilterState = {
      category: 'all',
      condition: 'all',
      grade: 'all',
      networkStatus: 'all',
    };
    performSearch('', initialFilters);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Wholesale Marketplace</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Bulk mobile phone orders for businesses. 5% commission, dedicated support, and API integration.
        </p>
      </div>

      <SearchFilterBar
        onSearch={(query) => {
          setSearchQuery(query);
          const currentFilters: FilterState = {
            category: 'all',
            condition: 'all',
            grade: 'all',
            networkStatus: 'all',
          };
          performSearch(query, currentFilters);
        }}
        onFilterChange={(filters) => {
          performSearch(searchQuery, filters);
        }}
      />

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-foreground/60">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="flex items-center gap-1 rounded-lg border border-accent-grey/20 bg-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col gap-4'}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} viewMode={viewMode} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <p className="text-lg text-foreground/60">No wholesale listings available at the moment.</p>
        </div>
      )}
    </div>
  );
}

