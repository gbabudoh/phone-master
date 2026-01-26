'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import SearchFilterBar, { FilterState } from '@/components/marketplace/SearchFilterBar';
import { IProduct } from '@/types/product';
import { Store, User, Building2, LayoutGrid, List } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sellerType, setSellerType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    category: 'all',
    condition: 'all',
    grade: 'all',
    networkStatus: 'all',
  });

  useEffect(() => {
    document.title = 'Search Marketplace | Phone Master';
  }, []);

  const performSearch = async (query: string, filters: FilterState, seller: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.condition !== 'all') params.set('condition', filters.condition);
      if (filters.grade !== 'all') params.set('grade', filters.grade);
      if (filters.networkStatus !== 'all') params.set('networkStatus', filters.networkStatus);
      if (seller !== 'all') params.set('sellerType', seller);

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
    performSearch(searchQuery, currentFilters, sellerType);
  }, [searchQuery, sellerType]);

  const handleSellerTypeChange = (type: string) => {
    setSellerType(type);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Search Marketplace</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Find the perfect mobile device or accessory
        </p>
      </div>

      {/* Seller Type Filter */}
      <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-sm font-semibold text-foreground">Browse by Seller Type</label>
            <p className="text-xs text-foreground/60 mt-0.5">Choose where you want to shop from</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleSellerTypeChange('all')}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
              sellerType === 'all'
                ? 'bg-primary/5 border-primary'
                : 'bg-white border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Store className={`h-5 w-5 ${sellerType === 'all' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-semibold ${sellerType === 'all' ? 'text-primary' : 'text-foreground'}`}>All Sellers</span>
            </div>
            <span className="text-xs text-foreground/60">Browse everything from all seller types</span>
          </button>
          <button
            onClick={() => handleSellerTypeChange('personal_seller')}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
              sellerType === 'personal_seller'
                ? 'bg-primary/5 border-primary'
                : 'bg-white border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <User className={`h-5 w-5 ${sellerType === 'personal_seller' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-semibold ${sellerType === 'personal_seller' ? 'text-primary' : 'text-foreground'}`}>Individual</span>
            </div>
            <span className="text-xs text-foreground/60">Private sellers with personal devices</span>
          </button>
          <button
            onClick={() => handleSellerTypeChange('retail_seller')}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
              sellerType === 'retail_seller'
                ? 'bg-primary/5 border-primary'
                : 'bg-white border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Store className={`h-5 w-5 ${sellerType === 'retail_seller' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-semibold ${sellerType === 'retail_seller' ? 'text-primary' : 'text-foreground'}`}>Retail</span>
            </div>
            <span className="text-xs text-foreground/60">Verified shops & business sellers</span>
          </button>
          <button
            onClick={() => handleSellerTypeChange('wholesale_seller')}
            className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
              sellerType === 'wholesale_seller'
                ? 'bg-primary/5 border-primary'
                : 'bg-white border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Building2 className={`h-5 w-5 ${sellerType === 'wholesale_seller' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-semibold ${sellerType === 'wholesale_seller' ? 'text-primary' : 'text-foreground'}`}>Wholesale</span>
            </div>
            <span className="text-xs text-foreground/60">Bulk deals for businesses & resellers</span>
          </button>
        </div>
      </div>

      <SearchFilterBar
        onSearch={(query) => {
          setSearchQuery(query);
        }}
        onFilterChange={(filters) => {
          setCurrentFilters(filters);
          performSearch(searchQuery, filters, sellerType);
        }}
      />

      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
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
          <p className="text-lg text-foreground/60">No products found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
