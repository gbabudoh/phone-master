'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: 'all' | 'handset' | 'accessory' | 'service_voucher';
  condition: 'all' | 'new' | 'refurbished' | 'used';
  grade: 'all' | 'A' | 'B' | 'C';
  networkStatus: 'all' | 'unlocked' | 'locked';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

export default function SearchFilterBar({ onSearch, onFilterChange }: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    condition: 'all',
    grade: 'all',
    networkStatus: 'all',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: 'all',
      condition: 'all',
      grade: 'all',
      networkStatus: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for phones, accessories, or services..."
            className="w-full rounded-lg border border-accent-grey/20 bg-white py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 flex items-center space-x-2 rounded-lg border border-accent-grey/20 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan-light cursor-pointer"
      >
        <Filter className="h-4 w-4" />
        <span>Filter Products</span>
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 rounded-lg border border-accent-grey/20 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filter Products</h3>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-xs text-foreground/60 hover:text-primary"
            >
              <X className="h-3 w-3" />
              <span>Clear all</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground/80">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full rounded-lg border border-accent-grey/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="handset">Handsets</option>
                <option value="accessory">Accessories</option>
                <option value="service_voucher">Services</option>
              </select>
            </div>

            {/* Condition */}
            {filters.category === 'handset' || filters.category === 'all' ? (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground/80">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => updateFilter('condition', e.target.value)}
                    className="w-full rounded-lg border border-accent-grey/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Conditions</option>
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground/80">Grade</label>
                  <select
                    value={filters.grade}
                    onChange={(e) => updateFilter('grade', e.target.value)}
                    className="w-full rounded-lg border border-accent-grey/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground/80">Network</label>
                  <select
                    value={filters.networkStatus}
                    onChange={(e) => updateFilter('networkStatus', e.target.value)}
                    className="w-full rounded-lg border border-accent-grey/20 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="unlocked">Unlocked</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

