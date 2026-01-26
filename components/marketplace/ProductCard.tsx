import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Smartphone, Package, User, Store, Building2, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const getConditionBadge = () => {
    if (product.category === 'handset' && product.handsetDetails) {
      const { condition, grade } = product.handsetDetails;
      const colors = {
        A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        B: 'bg-amber-50 text-amber-700 border-amber-200',
        C: 'bg-orange-50 text-orange-700 border-orange-200',
      };
      return (
        <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', colors[grade])}>
          {condition} · Grade {grade}
        </span>
      );
    }
    return null;
  };

  const getCategoryIcon = () => {
    if (product.category === 'handset') {
      return <Smartphone className="h-12 w-12 text-gray-300" />;
    }
    return <Package className="h-12 w-12 text-gray-300" />;
  };

  const getSellerIcon = () => {
    switch (product.sellerType) {
      case 'wholesale_seller':
        return <Building2 className="h-3 w-3" />;
      case 'retail_seller':
        return <Store className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getSellerLabel = () => {
    switch (product.sellerType) {
      case 'wholesale_seller':
        return 'Wholesale';
      case 'retail_seller':
        return 'Retail';
      default:
        return 'Individual';
    }
  };

  // List View
  if (viewMode === 'list') {
    return (
      <Link
        href={`/listing/${product._id}`}
        className="group relative flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Image */}
        <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 sm:h-44 sm:w-44">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
              sizes="176px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {getCategoryIcon()}
            </div>
          )}
          {/* Watermark */}
          <div className="absolute bottom-2 right-2 opacity-40">
            <img src="/icon.png" alt="" className="h-5 w-5" />
          </div>
          {product.status === 'sold' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-primary sm:text-lg">
                  {product.title}
                </h3>
                {product.category === 'handset' && product.handsetDetails && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {product.handsetDetails.brand} · {product.handsetDetails.storage}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-primary sm:text-2xl">{formatPrice(product.price)}</p>
                {product.stock > 0 && (
                  <p className="mt-0.5 text-xs text-gray-400">{product.stock} available</p>
                )}
              </div>
            </div>
            
            {/* Seller Info */}
            <div className="mt-2 flex items-center gap-2">
              <p className="text-xs text-gray-500">
                Product sold by <span className="font-medium text-gray-700">{product.sellerName || 'Seller'}</span>
              </p>
              <span className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                product.sellerType === 'wholesale_seller' && 'bg-purple-50 text-purple-700 border border-purple-200',
                product.sellerType === 'retail_seller' && 'bg-blue-50 text-blue-700 border border-blue-200',
                (!product.sellerType || product.sellerType === 'personal_seller') && 'bg-gray-50 text-gray-600 border border-gray-200'
              )}>
                {getSellerIcon()}
                {getSellerLabel()}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {getConditionBadge()}
            {product.category === 'handset' && product.handsetDetails?.networkStatus === 'unlocked' && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
                <ShieldCheck className="h-3 w-3" />
                Unlocked
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (default)
  return (
    <Link
      href={`/listing/${product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {getCategoryIcon()}
          </div>
        )}
        
        {/* Watermark */}
        <div className="absolute bottom-2 right-2 opacity-40">
          <img src="/icon.png" alt="" className="h-5 w-5" />
        </div>
        
        {/* Sold Overlay */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
              Sold
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.category === 'handset' && product.handsetDetails?.networkStatus === 'unlocked' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/90 px-2 py-0.5 text-xs font-medium text-cyan-700 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3" />
              Unlocked
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title & Brand */}
        <div className="mb-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-primary">
            {product.title}
          </h3>
          {product.category === 'handset' && product.handsetDetails && (
            <p className="mt-1 text-xs text-gray-500">
              {product.handsetDetails.brand} · {product.handsetDetails.storage}
            </p>
          )}
        </div>

        {/* Condition Badge */}
        <div className="mb-3">
          {getConditionBadge()}
        </div>

        {/* Seller Info */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 truncate">
            Product sold by <span className="font-medium text-gray-700">{product.sellerName || 'Seller'}</span>
          </p>
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0',
            product.sellerType === 'wholesale_seller' && 'bg-purple-50 text-purple-700 border border-purple-200',
            product.sellerType === 'retail_seller' && 'bg-blue-50 text-blue-700 border border-blue-200',
            (!product.sellerType || product.sellerType === 'personal_seller') && 'bg-gray-50 text-gray-600 border border-gray-200'
          )}>
            {getSellerIcon()}
            {getSellerLabel()}
          </span>
        </div>

        {/* Price and Stock */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
            {product.stock > 0 && (
              <p className="text-xs text-gray-400">{product.stock} in stock</p>
            )}
          </div>
          <div className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View →
          </div>
        </div>
      </div>
    </Link>
  );
}
