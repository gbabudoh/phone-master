import Link from 'next/link';
import { ArrowRight, Shield, Smartphone, Zap, CheckCircle, Star } from 'lucide-react';
import ProductCard from '@/components/marketplace/ProductCard';
import BannerSlider from '@/components/marketplace/BannerSlider';
import { IProduct } from '@/types/product';

export default async function Home() {
  // Fetch featured products (in a real app, this would come from an API)
  const featuredProducts: IProduct[] = []; // Placeholder

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero / Banner Slider */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <BannerSlider />
      </section>

      {/* Modern Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
              The <span className="text-primary italic">Ultimate</span> Phone Destination
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 font-medium">
              Experience the future of mobile commerce with our high-level device marketplace and AI-powered support ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { 
                icon: Smartphone, 
                title: 'Elite Marketplace', 
                desc: 'Access exclusive wholesale, retail, and individual listings from verified sellers worldwide.',
                color: 'bg-blue-500/10 text-blue-600'
              },
              { 
                icon: Shield, 
                title: 'Fortified Security', 
                desc: 'Every transaction is shielded by ESCROW protection and rigorous IMEI verification protocols.',
                color: 'bg-emerald-500/10 text-emerald-600'
              },
              { 
                icon: Zap, 
                title: 'AI Intelligence', 
                desc: 'Harness the power of Phone Genius AI for instant technical diagnostics and smart troubleshooting.',
                color: 'bg-purple-500/10 text-purple-600'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card group p-8 rounded-[2.5rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-2xl font-black text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Sectors - Premium Glassy Blocks */}
      <section className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-primary/5 skew-y-3 transform origin-top-left" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-gray-900">Tailored Marketplace Sectors</h2>
              <p className="mt-4 text-lg text-gray-500 font-medium">
                Choose the vertical that aligns with your volume and business requirements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                href: '/wholesale',
                title: 'Wholesale',
                benefits: ['5% Commission', 'API Access', 'Dedicated Manager'],
                desc: 'Massive volume shipments for enterprises and bulk distributors.',
                gradient: 'from-blue-600 to-indigo-600'
              },
              {
                href: '/retail',
                title: 'Retail',
                benefits: ['3% Transaction Fee', 'Verified Storefront', 'Priority Listings'],
                desc: 'Optimized for high-volume consumer-facing mobile retailers.',
                gradient: 'from-primary to-primary-light'
              },
              {
                href: '/individual',
                title: 'Individual',
                benefits: ['Up to 5 Listings', 'Instant Cash-out', 'Escrow Support'],
                desc: 'Simple, direct sales for personal device upgrades.',
                gradient: 'from-emerald-600 to-teal-600'
              }
            ].map((sector, i) => (
              <Link
                key={i}
                href={sector.href}
                className="glass-card-heavy group relative overflow-hidden rounded-[3rem] p-10 transition-all hover:shadow-[0_20px_50px_rgba(1,79,134,0.15)] active:scale-[0.98]"
              >
                <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${sector.gradient} opacity-0 transition-opacity group-hover:opacity-10 blur-2xl`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-4xl font-black tracking-tighter text-gray-900 mb-4 group-hover:text-primary transition-colors">
                    {sector.title}
                  </div>
                  <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    {sector.desc}
                  </p>
                  <ul className="space-y-3 mb-10 flex-1">
                    {sector.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center space-x-2 text-sm font-black text-primary group-hover:translate-x-2 transition-transform">
                    <span>Inaugurate Vertical</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Trust Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card-heavy rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Ready to elevate your <br /> mobile business?
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              Join thousands of professionals trading on the most secure and technologically advanced phone platform.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-dark transition-all hover:shadow-xl active:scale-95 shadow-lg shadow-primary/20">
                Join the Network
              </Link>
              <Link href="/support" className="px-8 py-4 bg-white/50 text-gray-900 border border-white/40 rounded-2xl font-black hover:bg-white transition-all backdrop-blur-sm">
                Get Expert Advice
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="glass-card p-6 rounded-3xl animate-float">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent-cyan-light flex items-center justify-center">
                  <Star className="text-primary h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">Premium Quality</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Assets</div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (Stay Traditional but Polished) */}
      {featuredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between border-b border-gray-100 pb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 italic">Curated Selection</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Today&apos;s Highlighted Devices</p>
              </div>
              <Link
                href="/search-marketplace"
                className="flex items-center space-x-2 text-primary font-black text-sm hover:translate-x-1 transition-transform group"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
