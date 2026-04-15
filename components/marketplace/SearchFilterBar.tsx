'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  initialQuery?: string;
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

const EMPTY_FILTERS: FilterState = {
  category: 'all',
  condition: 'all',
  grade: 'all',
  networkStatus: 'all',
};

type PillGroup<T extends string> = { label: string; value: T }[];

const CATEGORIES: PillGroup<FilterState['category']> = [
  { label: 'All', value: 'all' },
  { label: 'Handsets', value: 'handset' },
  { label: 'Accessories', value: 'accessory' },
  { label: 'Services', value: 'service_voucher' },
];

const CONDITIONS: PillGroup<FilterState['condition']> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Refurbished', value: 'refurbished' },
  { label: 'Used', value: 'used' },
];

const GRADES: PillGroup<FilterState['grade']> = [
  { label: 'All', value: 'all' },
  { label: 'Grade A', value: 'A' },
  { label: 'Grade B', value: 'B' },
  { label: 'Grade C', value: 'C' },
];

const NETWORKS: PillGroup<FilterState['networkStatus']> = [
  { label: 'All', value: 'all' },
  { label: 'Unlocked', value: 'unlocked' },
  { label: 'Locked', value: 'locked' },
];

function PillSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: PillGroup<T>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            value === opt.value
              ? 'bg-primary text-white shadow-sm shadow-primary/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function activeFilterCount(f: FilterState): number {
  return (
    (f.category !== 'all' ? 1 : 0) +
    (f.condition !== 'all' ? 1 : 0) +
    (f.grade !== 'all' ? 1 : 0) +
    (f.networkStatus !== 'all' ? 1 : 0)
  );
}

function activeChips(f: FilterState): { key: keyof FilterState; label: string }[] {
  const chips: { key: keyof FilterState; label: string }[] = [];
  const catMap: Record<string, string> = { handset: 'Handsets', accessory: 'Accessories', service_voucher: 'Services' };
  const condMap: Record<string, string> = { new: 'New', refurbished: 'Refurbished', used: 'Used' };
  const gradeMap: Record<string, string> = { A: 'Grade A', B: 'Grade B', C: 'Grade C' };
  const netMap: Record<string, string> = { unlocked: 'Unlocked', locked: 'Locked' };
  if (f.category !== 'all') chips.push({ key: 'category', label: catMap[f.category] });
  if (f.condition !== 'all') chips.push({ key: 'condition', label: condMap[f.condition] });
  if (f.grade !== 'all') chips.push({ key: 'grade', label: gradeMap[f.grade] });
  if (f.networkStatus !== 'all') chips.push({ key: 'networkStatus', label: netMap[f.networkStatus] });
  return chips;
}

const showConditionFilters = (cat: FilterState['category']) =>
  cat === 'all' || cat === 'handset';

export default function SearchFilterBar({
  onSearch,
  onFilterChange,
  initialQuery = '',
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const removeChip = (key: keyof FilterState) => {
    updateFilter(key, EMPTY_FILTERS[key as keyof typeof EMPTY_FILTERS] as FilterState[typeof key]);
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    onFilterChange(EMPTY_FILTERS);
  };

  const count = activeFilterCount(filters);
  const chips = activeChips(filters);
  const showConditions = showConditionFilters(filters.category);

  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* Search input */}
      <form onSubmit={handleSearch}>
        <div className="flex items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="flex flex-1 items-center gap-3 px-5 py-3.5">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, brands, models..."
              className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); onSearch(''); }}
                className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="m-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
            showFilters || count > 0
              ? 'border-primary/30 bg-primary/5 text-primary'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {count > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
              {count}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => removeChip(chip.key)}
            className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/10"
          >
            {chip.label}
            <X className="h-3 w-3" />
          </button>
        ))}

        {count > 1 && (
          <button
            onClick={clearAll}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <p className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">Category</p>
              <PillSelector
                options={CATEGORIES}
                value={filters.category}
                onChange={(v) => updateFilter('category', v)}
              />
            </div>

            {showConditions && (
              <div>
                <p className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">Condition</p>
                <PillSelector
                  options={CONDITIONS}
                  value={filters.condition}
                  onChange={(v) => updateFilter('condition', v)}
                />
              </div>
            )}

            {showConditions && (
              <div>
                <p className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">Grade</p>
                <PillSelector
                  options={GRADES}
                  value={filters.grade}
                  onChange={(v) => updateFilter('grade', v)}
                />
              </div>
            )}

            {showConditions && (
              <div>
                <p className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">Network</p>
                <PillSelector
                  options={NETWORKS}
                  value={filters.networkStatus}
                  onChange={(v) => updateFilter('networkStatus', v)}
                />
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
