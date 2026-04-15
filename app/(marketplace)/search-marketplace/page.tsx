'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/marketplace/ProductCard';
import SearchFilterBar, { FilterState } from '@/components/marketplace/SearchFilterBar';
import { IProduct } from '@/types/product';
import {
  Store, User, Building2, LayoutGrid, List,
  Package, ArrowRight, Search,
} from 'lucide-react';

const SELLER_TYPES = [
  {
    value: 'all',
    label: 'All Sellers',
    icon: Store,
    desc: 'Browse everything',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    selectedBg: 'bg-gray-800',
    selectedBorder: 'border-gray-800',
    selectedText: 'text-gray-800',
  },
  {
    value: 'personal_seller',
    label: 'Individual',
    icon: User,
    desc: 'Personal devices',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    selectedBg: 'bg-teal-600',
    selectedBorder: 'border-teal-500',
    selectedText: 'text-teal-700',
  },
  {
    value: 'retail_seller',
    label: 'Retail',
    icon: Store,
    desc: 'Verified stores',
    color: 'text-primary',
    bg: 'bg-primary/10',
    selectedBg: 'bg-primary',
    selectedBorder: 'border-primary',
    selectedText: 'text-primary',
  },
  {
    value: 'wholesale_seller',
    label: 'Wholesale',
    icon: Building2,
    desc: 'Bulk & business',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    selectedBg: 'bg-indigo-600',
    selectedBorder: 'border-indigo-500',
    selectedText: 'text-indigo-700',
  },
] as const;

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 h-48 rounded-xl bg-gray-100" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mb-4 h-3 w-1/2 rounded bg-gray-100" />
      <div className="h-6 w-1/3 rounded bg-gray-100" />
    </div>
  );
}

const INITIAL_FILTERS: FilterState = {
  category: 'all',
  condition: 'all',
  grade: 'all',
  networkStatus: 'all',
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sellerType, setSellerType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<FilterState>(INITIAL_FILTERS);

  const performSearch = async (query: string, filters: FilterState, seller: string) => {
    setLoading(true);
    setHasSearched(true);
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
    performSearch(initialQuery, INITIAL_FILTERS, 'all');
  }, []);

  useEffect(() => {
    if (hasSearched) {
      performSearch(searchQuery, currentFilters, sellerType);
    }
  }, [sellerType]);

  return (
    <div className="flex flex-col gap-8 pb-20">

      {/* Page header */}
      <section className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Marketplace</span>
            <h1 className="text-3xl font-black text-gray-900">
              {initialQuery
                ? <>Results for <span className="text-primary">&ldquo;{initialQuery}&rdquo;</span></>
                : 'Browse All Listings'}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Search, filter, and discover phones from verified sellers across all tiers.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Seller type tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {SELLER_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = sellerType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setSellerType(type.value)}
                className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                  isSelected
                    ? `${type.selectedBorder} bg-white ${type.selectedText} shadow-sm`
                    : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                  isSelected ? type.bg : 'bg-transparent'
                }`}>
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? type.color : 'text-gray-400'}`} />
                </div>
                {type.label}
                {isSelected && (
                  <span className="ml-0.5 text-xs font-black opacity-60">{type.desc}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + filters */}
        <SearchFilterBar
          initialQuery={initialQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            performSearch(query, currentFilters, sellerType);
          }}
          onFilterChange={(filters) => {
            setCurrentFilters(filters);
            performSearch(searchQuery, filters, sellerType);
          }}
        />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                <span className="font-black text-gray-900">{products.length}</span>{' '}
                listing{products.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
                : 'flex flex-col gap-4'
            }>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode={viewMode} />
              ))}
            </div>
          </>
        ) : hasSearched ? (
          /* Empty state after a search */
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-gray-800">No listings found</h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search or clear your filters.`
                : 'No listings match your current filters. Try broadening your search.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-100"
              >
                <Building2 className="h-4 w-4" /> Browse Wholesale
              </Link>
              <Link
                href="/retail"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/10"
              >
                <Store className="h-4 w-4" /> Browse Retail
              </Link>
              <Link
                href="/individual"
                className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-5 py-2.5 text-sm font-bold text-teal-700 transition-all hover:bg-teal-100"
              >
                <User className="h-4 w-4" /> Browse Individual
              </Link>
            </div>
          </div>
        ) : (
          /* Initial empty state (before any search result) */
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-black text-gray-800">Start exploring</h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
              Search for a phone or browse by seller type above.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
            >
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
