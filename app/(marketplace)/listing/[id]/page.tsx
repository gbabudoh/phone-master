'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  Smartphone, Shield, CheckCircle2, ArrowLeft, Star, 
  MessageCircle, Send, Calendar, Store, Verified,
  Heart, Share2, ChevronLeft, ChevronRight, Circle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { IProduct } from '@/types/product';

interface Seller {
  id: string;
  businessName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  createdAt: string;
  isOnline?: boolean;
  rating?: number | null;
  reviewCount?: number;
  role?: string;
}

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);

  useEffect(() => {
    document.title = 'Product Listing | Phone Master';
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/listings/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data.product);
        
        // Use real seller data from API
        if (data.product.seller) {
          setSeller({
            id: data.product.seller.id,
            businessName: data.product.seller.businessName,
            firstName: data.product.seller.firstName,
            lastName: data.product.seller.lastName,
            avatar: data.product.seller.avatar,
            createdAt: data.product.seller.createdAt,
            isOnline: false, // Would need real-time presence system
            rating: data.product.seller.rating ? parseFloat(data.product.seller.rating.toFixed(1)) : null,
            reviewCount: data.product.seller.reviewCount || 0,
            role: data.product.seller.role,
          });
        }
        
        document.title = `${data.product.title} | Phone Master`;
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setShowMessageSent(true);
    setMessage('');
    setTimeout(() => setShowMessageSent(false), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <p className="mt-4 text-foreground/60">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
          <Smartphone className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
          <p className="mt-2 text-foreground/60">This product doesn&apos;t exist or has been removed.</p>
          <Link href="/search-marketplace" className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 text-white font-medium hover:bg-primary-dark transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-foreground/60 hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to listings</span>
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/60 shadow-lg shadow-gray-200/50">
              {product.images && product.images.length > 0 ? (
                <div className="relative">
                  <div className="relative aspect-square max-h-[500px] overflow-hidden rounded-2xl bg-gray-50">
                    <Image src={product.images[selectedImage]} alt={product.title} fill className="object-contain p-8" sizes="(max-width: 768px) 100vw, 60vw" />
                    {/* Watermark */}
                    <div className="absolute bottom-4 right-4 opacity-40">
                      <img src="/icon.png" alt="" className="h-8 w-8" />
                    </div>
                    {product.images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-foreground shadow-lg hover:bg-white transition-all cursor-pointer"><ChevronLeft className="h-6 w-6" /></button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-foreground shadow-lg hover:bg-white transition-all cursor-pointer"><ChevronRight className="h-6 w-6" /></button>
                      </>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button onClick={() => setIsFavorite(!isFavorite)} className={`p-3 rounded-full shadow-lg transition-all cursor-pointer ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-foreground hover:bg-white'}`}><Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} /></button>
                      <button className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-foreground shadow-lg hover:bg-white transition-all cursor-pointer"><Share2 className="h-5 w-5" /></button>
                    </div>
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                      {product.images.map((_, index) => (<button key={index} onClick={() => setSelectedImage(index)} className={`h-2 rounded-full transition-all cursor-pointer ${selectedImage === index ? 'bg-primary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'}`} />))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-square max-h-[500px] items-center justify-center rounded-2xl bg-gray-50"><Smartphone className="h-32 w-32 text-gray-200" /></div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg shadow-gray-200/50">
              <h1 className="text-3xl font-bold text-foreground mb-6">{product.title}</h1>
              {product.category === 'handset' && product.handsetDetails && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Brand', value: product.handsetDetails.brand },
                    { label: 'Model', value: product.handsetDetails.model },
                    { label: 'Condition', value: product.handsetDetails.condition },
                    { label: 'Grade', value: `Grade ${product.handsetDetails.grade}` },
                    { label: 'Network', value: product.handsetDetails.networkStatus },
                    { label: 'Storage', value: product.handsetDetails.storage },
                    { label: 'Color', value: product.handsetDetails.color },
                  ].filter(item => item.value).map((item, index) => (
                    <div key={index} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{item.label}</span>
                      <p className="text-foreground font-semibold mt-1 capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg shadow-gray-200/50 sticky top-4">
              <div className="mb-6">
                <p className="text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {product.stock > 0 ? (<><Circle className="h-3 w-3 fill-green-500 text-green-500" /><span className="text-green-600 text-sm font-medium">{product.stock} in stock</span></>) : (<><Circle className="h-3 w-3 fill-red-500 text-red-500" /><span className="text-red-600 text-sm font-medium">Out of stock</span></>)}
                </div>
              </div>
              {product.status === 'active' && product.stock > 0 ? (
                <button className="w-full rounded-2xl bg-primary px-6 py-4 font-bold text-white text-lg transition-all hover:bg-primary-dark hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 cursor-pointer">Buy Now</button>
              ) : (
                <button disabled className="w-full rounded-2xl bg-gray-200 px-6 py-4 font-bold text-gray-400 text-lg cursor-not-allowed">{product.status === 'sold' ? 'Sold' : 'Out of Stock'}</button>
              )}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-foreground/60"><div className="p-2 rounded-xl bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div><span>ESCROW Payment Protection</span></div>
                <div className="flex items-center space-x-3 text-foreground/60"><div className="p-2 rounded-xl bg-green-500/10"><CheckCircle2 className="h-5 w-5 text-green-500" /></div><span>Verified & Authenticated</span></div>
              </div>
            </div>

            {seller && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/60 shadow-lg shadow-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Seller</h3>
                  {seller.isOnline && (<span className="flex items-center space-x-1 text-green-600 text-sm font-medium"><Circle className="h-2 w-2 fill-current" /><span>Online</span></span>)}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg"><Store className="h-7 w-7 text-white" /></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-foreground">
                        {seller.businessName || (seller.firstName && seller.lastName ? `${seller.firstName} ${seller.lastName}` : seller.firstName || 'Seller')}
                      </h4>
                      <Verified className="h-4 w-4 text-blue-500" />
                    </div>
                    {seller.rating && seller.reviewCount && seller.reviewCount > 0 ? (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-foreground font-medium">{seller.rating}</span>
                        <span className="text-foreground/50">({seller.reviewCount} {seller.reviewCount === 1 ? 'review' : 'reviews'})</span>
                      </div>
                    ) : (
                      <p className="text-foreground/50 text-sm mt-1">New seller</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-foreground/50 text-sm mb-6"><Calendar className="h-4 w-4" /><span>Selling since {formatDate(seller.createdAt)}</span></div>
                <div className="space-y-3">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send a message to the seller..." rows={3} className="w-full rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                  <div className="flex space-x-3">
                    <button onClick={handleSendMessage} disabled={!message.trim()} className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gray-100 px-4 py-3 text-foreground font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"><Send className="h-4 w-4" /><span>Send Message</span></button>
                    {seller.isOnline && (<button className="flex items-center justify-center space-x-2 rounded-xl bg-green-500 px-4 py-3 text-white font-medium hover:bg-green-600 transition-all cursor-pointer"><MessageCircle className="h-4 w-4" /><span>Live Chat</span></button>)}
                  </div>
                  {showMessageSent && (<div className="flex items-center space-x-2 text-green-600 text-sm"><CheckCircle2 className="h-4 w-4" /><span>Message sent successfully!</span></div>)}
                </div>
              </div>
            )}

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/60">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-2"><Shield className="h-6 w-6 text-blue-500" /></div><p className="text-xs text-foreground/60 font-medium">Secure Payment</p></div>
                <div><div className="w-12 h-12 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-2"><CheckCircle2 className="h-6 w-6 text-green-500" /></div><p className="text-xs text-foreground/60 font-medium">Quality Checked</p></div>
                <div><div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center mb-2"><Verified className="h-6 w-6 text-purple-500" /></div><p className="text-xs text-foreground/60 font-medium">Verified Seller</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
