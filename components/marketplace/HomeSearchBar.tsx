'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(`/search-marketplace${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <div className="flex flex-1 items-center gap-3 px-5 py-4">
        <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phones, brands, models..."
          className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base font-medium"
        />
      </div>
      <button
        type="submit"
        className="m-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
