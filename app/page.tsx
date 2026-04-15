import Link from 'next/link';
import { ArrowRight, Shield, Smartphone, Zap, CheckCircle, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/marketplace/ProductCard';
import BannerSlider from '@/components/marketplace/BannerSlider';
import HomeSearchBar from '@/components/marketplace/HomeSearchBar';
import { prisma } from '@/lib/db';
import { IProduct } from '@/types/product';

async function getHomepageData() {
  try {
    const [activeListings, totalSellers, soldCount, featuredProducts] = await Promise.all([
      prisma.product.count({ where: { status: 'active' } }),
      prisma.user.count({
        where: { role: { in: ['retail_seller', 'wholesale_seller', 'personal_seller'] } },
      }),
      prisma.product.count({ where: { status: 'sold' } }),
      prisma.product.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
    ]);
    return { activeListings, totalSellers, soldCount, featuredProducts };
  } catch {
    return { activeListings: 0, totalSellers: 0, soldCount: 0, featuredProducts: [] };
  }
}

export default async function Home() {
  const { activeListings, totalSellers, soldCount, featuredProducts } = await getHomepageData();

  const stats = [
    { label: 'Active Listings', value: activeListings.toLocaleString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Sellers', value: totalSellers.toLocaleString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Devices Sold', value: soldCount.toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">

      {/* Banner Slider */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <BannerSlider />
      </section>

      {/* Search Hero */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card-heavy rounded-3xl px-8 py-10 flex flex-col items-center gap-6 text-center shadow-xl">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                The <span className="text-primary italic">Ultimate</span> Phone Marketplace
              </h1>
              <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
                Buy, sell and trade phones securely — wholesale, retail, or individual.
              </p>
            </div>
            <HomeSearchBar />
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium">
              <span>Popular:</span>
              {['iPhone 15', 'Samsung S24', 'Pixel 8', 'iPhone 14 Pro'].map((term) => (
                <Link
                  key={term}
                  href={`/search-marketplace?q=${encodeURIComponent(term)}`}
                  className="hover:text-primary transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-5">
                <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
              Why Phone Master?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500 font-medium">
              Built for serious buyers and sellers in the mobile phone industry.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: 'Verified Marketplace',
                desc: 'Access wholesale, retail, and individual listings from verified sellers. Every device checked.',
                color: 'bg-blue-500/10 text-blue-600',
              },
              {
                icon: Shield,
                title: 'Escrow Protection',
                desc: 'Every transaction is protected by escrow and rigorous IMEI verification — buyer and seller covered.',
                color: 'bg-emerald-500/10 text-emerald-600',
              },
              {
                icon: Zap,
                title: 'AI-Powered Support',
                desc: 'Phone Genius AI gives you instant device diagnostics, compatibility checks, and smart troubleshooting.',
                color: 'bg-purple-500/10 text-purple-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card group p-8 rounded-[2.5rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-black text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Sectors */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-primary/5 skew-y-3 transform origin-top-left" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-gray-900">Choose Your Market</h2>
              <p className="mt-3 text-lg text-gray-500 font-medium">
                Select the tier that matches your volume and business needs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                href: '/wholesale',
                title: 'Wholesale',
                tag: 'High Volume',
                benefits: ['5% Commission', 'API Access', 'Dedicated Account Manager'],
                desc: 'Bulk shipments for enterprises, distributors, and large-scale operators.',
                gradient: 'from-blue-600 to-indigo-600',
                cta: 'Browse Wholesale',
              },
              {
                href: '/retail',
                title: 'Retail',
                tag: 'Most Popular',
                benefits: ['3% Transaction Fee', 'Verified Storefront', 'Priority Listings'],
                desc: 'For consumer-facing retailers looking to grow their mobile phone business.',
                gradient: 'from-primary to-primary-light',
                cta: 'Browse Retail',
              },
              {
                href: '/individual',
                title: 'Individual',
                tag: 'Personal',
                benefits: ['Up to 5 Listings', 'Instant Payout', 'Escrow Support'],
                desc: 'Sell your personal devices quickly and safely with full escrow protection.',
                gradient: 'from-emerald-600 to-teal-600',
                cta: 'Sell a Device',
              },
            ].map((sector, i) => (
              <Link
                key={i}
                href={sector.href}
                className="glass-card-heavy group relative overflow-hidden rounded-[3rem] p-10 transition-all hover:shadow-[0_20px_50px_rgba(1,79,134,0.15)] active:scale-[0.98]"
              >
                <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${sector.gradient} opacity-0 transition-opacity group-hover:opacity-10 blur-2xl`} />
                <div className="relative z-10 flex flex-col h-full">
                  <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-widest w-fit">
                    {sector.tag}
                  </span>
                  <div className="text-4xl font-black tracking-tighter text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {sector.title}
                  </div>
                  <p className="text-gray-500 font-medium mb-8 leading-relaxed">{sector.desc}</p>
                  <ul className="space-y-3 mb-10 flex-1">
                    {sector.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center space-x-2 text-sm font-black text-primary group-hover:translate-x-2 transition-transform">
                    <span>{sector.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between border-b border-gray-100 pb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Latest Listings</h2>
              <p className="text-gray-500 font-medium mt-1">Freshly added devices from verified sellers</p>
            </div>
            <Link
              href="/search-marketplace"
              className="flex items-center space-x-2 text-primary font-black text-sm hover:translate-x-1 transition-transform group"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={(product as IProduct & { id: string }).id} product={{ ...(product as IProduct & { id: string; _id?: string }), _id: (product as IProduct & { id: string }).id }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
              <Smartphone className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-500">No listings yet</h3>
              <p className="text-gray-400 text-sm mt-1 mb-6">Be the first to list a device on Phone Master</p>
              <Link
                href="/dashboard"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all"
              >
                List a Device
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card-heavy rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Ready to grow your <br /> mobile business?
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              Join {totalSellers > 0 ? `${totalSellers}+ verified sellers` : 'verified sellers'} trading on the most secure phone marketplace — with escrow protection, AI support, and IMEI verification built in.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-dark transition-all hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20"
              >
                Start Selling
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 bg-white/50 text-gray-900 border border-white/40 rounded-2xl font-black hover:bg-white transition-all backdrop-blur-sm"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="glass-card p-5 rounded-2xl min-w-[220px]">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Platform Stats</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm font-semibold text-gray-600">Active Listings</span>
                  <span className="text-sm font-black text-primary">{activeListings}</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm font-semibold text-gray-600">Verified Sellers</span>
                  <span className="text-sm font-black text-primary">{totalSellers}</span>
                </div>
                <div className="flex items-center justify-between gap-8">
                  <span className="text-sm font-semibold text-gray-600">Devices Sold</span>
                  <span className="text-sm font-black text-primary">{soldCount}</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-sm font-black text-gray-900">Escrow Protected</p>
                  <p className="text-xs text-gray-400">Every transaction secured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
