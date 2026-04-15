'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/marketplace/ProductCard';
import SearchFilterBar, { FilterState } from '@/components/marketplace/SearchFilterBar';
import { IProduct } from '@/types/product';
import {
  LayoutGrid, List, Package, ArrowRight,
  CheckCircle, Zap, Shield, UserCheck,
} from 'lucide-react';

const PERKS = [
  { icon: CheckCircle, label: 'Up to 5 Listings' },
  { icon: Zap, label: 'Instant Payout' },
  { icon: Shield, label: 'Escrow Support' },
  { icon: UserCheck, label: 'No Business Required' },
];

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

export default function IndividualPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const performSearch = async (query: string, filters: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sellerType', 'personal_seller');
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
    performSearch('', INITIAL_FILTERS);
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-20">

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-700 via-teal-700 to-emerald-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80">
                Personal Market
              </span>
              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Sell Your Device <span className="text-teal-300">Safely & Fast</span>
              </h1>
              <p className="mt-4 text-lg font-medium text-white/65">
                List your personal phones in minutes — no business registration needed. Full escrow protection, instant payouts, and a verified buyer community.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {PERKS.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                    <Icon className="h-3.5 w-3.5 text-teal-300" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <Link
                href="/register?type=personal"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl active:scale-95"
              >
                Sell a Device
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchFilterBar
          onSearch={(query) => {
            setSearchQuery(query);
            performSearch(query, INITIAL_FILTERS);
          }}
          onFilterChange={(filters) => performSearch(searchQuery, filters)}
        />

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-4 mt-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                <span className="font-black text-gray-900">{products.length}</span> listing{products.length !== 1 ? 's' : ''} available
              </p>
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-900'
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
          <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-gray-800">No personal listings yet</h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
              Got a phone you&apos;re not using? List it in minutes and get paid safely with escrow.
            </p>
            <Link
              href="/register?type=personal"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-95"
            >
              List Your Device
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
