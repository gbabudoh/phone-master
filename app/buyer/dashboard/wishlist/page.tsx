'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch wishlist - placeholder for now
    setLoading(false);
  }, []);

  const handleRemove = (id: string) => {
    setWishlist(wishlist.filter(item => item._id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        <p className="mt-2 text-foreground/60">Items you've saved for later</p>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="text-foreground/60">Loading...</p></div>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item._id} className="rounded-lg border border-accent-grey/20 bg-white overflow-hidden">
              {item.images && item.images[0] && (
                <img src={item.images[0]} alt={item.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-lg font-bold text-primary">{formatPrice(item.price || 0)}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button onClick={() => handleRemove(item._id)} className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-accent-grey/20 bg-white p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-accent-grey" />
          <p className="mt-4 text-lg text-foreground/60">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-foreground/40">Save items you like by clicking the heart icon</p>
          <Link href="/search-marketplace" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark cursor-pointer">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
