'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Boxes, Package, TrendingUp, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface BulkListing {
  id: string;
  title: string;
  description: string;
  totalUnits: number;
  pricePerUnit: number;
  totalPrice: number;
  minOrder: number;
  category: string;
  condition: string;
  status: 'active' | 'draft' | 'sold';
  views: number;
  inquiries: number;
  createdAt: string;
}

export default function BulkListingsPage() {
  const [listings, setListings] = useState<BulkListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBulkListings();
  }, []);

  const fetchBulkListings = async () => {
    // Mock data for bulk listings
    setListings([
      {
        id: '1',
        title: 'iPhone 14 Pro Mixed Lot - 50 Units',
        description: 'Mixed grades A/B, various colors and storage options',
        totalUnits: 50,
        pricePerUnit: 45000,
        totalPrice: 2250000,
        minOrder: 10,
        category: 'handset',
        condition: 'mixed',
        status: 'active',
        views: 234,
        inquiries: 12,
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Samsung Galaxy S23 Bulk - 100 Units',
        description: 'Grade A refurbished, 128GB, unlocked',
        totalUnits: 100,
        pricePerUnit: 35000,
        totalPrice: 3500000,
        minOrder: 25,
        category: 'handset',
        condition: 'refurbished',
        status: 'active',
        views: 189,
        inquiries: 8,
        createdAt: '2024-01-10',
      },
      {
        id: '3',
        title: 'Mixed Android Lot - 200 Units',
        description: 'Various brands and models, Grade B/C',
        totalUnits: 200,
        pricePerUnit: 15000,
        totalPrice: 3000000,
        minOrder: 50,
        category: 'handset',
        condition: 'used',
        status: 'draft',
        views: 0,
        inquiries: 0,
        createdAt: '2024-01-20',
      },
    ]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bulk listing?')) return;
    setListings(listings.filter(l => l.id !== id));
  };

  const handleToggleStatus = async (listing: BulkListing) => {
    const newStatus = listing.status === 'active' ? 'draft' : 'active';
    setListings(listings.map(l => l.id === listing.id ? { ...l, status: newStatus } : l));
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalValue = listings.reduce((sum, l) => sum + l.totalPrice, 0);
  const totalUnits = listings.reduce((sum, l) => sum + l.totalUnits, 0);
  const totalInquiries = listings.reduce((sum, l) => sum + l.inquiries, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Listings</h1>
          <p className="mt-2 text-foreground/60">Manage your wholesale bulk lots and pallets</p>
        </div>
        <Link
          href="/wholesale-seller/dashboard/bulk-listings/new"
          className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Bulk Lot</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <div className="flex items-center space-x-3">
            <Boxes className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-foreground/60">Total Listings</p>
              <p className="text-xl font-bold">{listings.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-xs text-foreground/60">Total Units</p>
              <p className="text-xl font-bold">{totalUnits.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs text-foreground/60">Total Value</p>
              <p className="text-xl font-bold">{formatPrice(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-accent-grey/20 bg-white p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-xs text-foreground/60">Total Inquiries</p>
              <p className="text-xl font-bold">{totalInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulk listings..."
            className="w-full rounded-lg border border-accent-grey/20 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-accent-grey/20 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="py-12 text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="rounded-lg border border-accent-grey/20 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-foreground">{listing.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' :
                      listing.status === 'sold' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">{listing.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-foreground/60">Units:</span>
                      <span className="ml-1 font-medium">{listing.totalUnits}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Price/Unit:</span>
                      <span className="ml-1 font-medium">{formatPrice(listing.pricePerUnit)}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Total:</span>
                      <span className="ml-1 font-bold text-primary">{formatPrice(listing.totalPrice)}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Min Order:</span>
                      <span className="ml-1 font-medium">{listing.minOrder} units</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-4 text-xs text-foreground/50">
                    <span className="flex items-center"><Eye className="mr-1 h-3 w-3" />{listing.views} views</span>
                    <span className="flex items-center"><Users className="mr-1 h-3 w-3" />{listing.inquiries} inquiries</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(listing)}
                    className="rounded-lg border border-accent-grey/20 p-2 text-foreground/60 hover:bg-accent-cyan-light hover:text-primary cursor-pointer"
                  >
                    {listing.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/wholesale-seller/dashboard/bulk-listings/${listing.id}`}
                    className="rounded-lg border border-accent-grey/20 p-2 text-foreground/60 hover:bg-accent-cyan-light hover:text-primary cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="rounded-lg border border-accent-grey/20 p-2 text-foreground/60 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <Boxes className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">No bulk listings found</p>
          <Link
            href="/wholesale-seller/dashboard/bulk-listings/new"
            className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Bulk Lot</span>
          </Link>
        </div>
      )}
    </div>
  );
}
