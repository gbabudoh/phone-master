'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade, Keyboard } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { IBanner } from '@/types/banner';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function BannerSlider() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners?active=true', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Banners fetched:', data);
      
      if (data.banners && Array.isArray(data.banners)) {
        setBanners(data.banners);
      } else {
        console.warn('No banners array in response:', data);
        setBanners([]);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async (bannerId?: string) => {
    if (bannerId) {
      try {
        await fetch(`/api/banners/${bannerId}/click`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    }
  };

  const toggleAutoplay = () => {
    if (swiperRef.current) {
      if (isAutoplay) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
      setIsAutoplay(!isAutoplay);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] w-full animate-pulse bg-accent-cyan-light md:h-[400px] lg:h-[500px]" />
    );
  }

  if (banners.length === 0) {
    return (
      <div className="h-[300px] w-full bg-gradient-to-br from-primary/10 to-accent-cyan-light/30 flex items-center justify-center md:h-[400px] lg:h-[500px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground/60">No banners available</p>
          <p className="text-sm text-foreground/40 mt-2">Add banners from the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <Swiper
        ref={swiperRef}
        key={banners.length}
        modules={[Autoplay, Pagination, Navigation, EffectFade, Keyboard]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: '.banner-swiper-button-next',
          prevEl: '.banner-swiper-button-prev',
          disabledClass: 'opacity-50 cursor-not-allowed',
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        loop={banners.length > 1}
        className="banner-swiper !h-[300px] md:!h-[400px] lg:!h-[500px]"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id || `banner-${index}`}>
            <div className="relative h-full w-full overflow-hidden bg-gray-200">
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  quality={85}
                  onError={(e) => {
                    console.error('Image load error:', banner.imageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary to-primary-dark" />
              )}
              
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content Overlay */}
              {(banner.title || banner.description || banner.linkUrl) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-6 lg:p-8 transform transition-transform duration-500 group-hover:translate-y-0">
                  {banner.title && (
                    <h2 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl line-clamp-2">
                      {banner.title}
                    </h2>
                  )}
                  {banner.description && (
                    <p className="mb-4 max-w-2xl text-sm text-white/90 md:text-base lg:text-lg line-clamp-2">
                      {banner.description}
                    </p>
                  )}
                  {banner.linkUrl && (
                    <Link
                      href={banner.linkUrl}
                      onClick={() => handleBannerClick(banner._id)}
                      className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all hover:bg-primary-dark hover:scale-105 md:px-6 md:py-3 md:text-base shadow-lg"
                    >
                      <span>{banner.linkText || 'Learn More'}</span>
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            className="banner-swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white hover:shadow-xl opacity-0 group-hover:opacity-100 md:left-6 md:p-4"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6 text-primary md:h-7 md:w-7" />
          </button>
          <button
            className="banner-swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all hover:bg-white hover:shadow-xl opacity-0 group-hover:opacity-100 md:right-6 md:p-4"
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6 text-primary md:h-7 md:w-7" />
          </button>

          {/* Autoplay Toggle Button */}
          <button
            onClick={toggleAutoplay}
            className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white md:bottom-6 md:right-6 md:p-3"
            aria-label={isAutoplay ? 'Pause autoplay' : 'Play autoplay'}
            title={isAutoplay ? 'Pause' : 'Play'}
          >
            {isAutoplay ? (
              <Pause className="h-5 w-5 text-primary md:h-6 md:w-6" />
            ) : (
              <Play className="h-5 w-5 text-primary md:h-6 md:w-6" />
            )}
          </button>
        </>
      )}
    </div>
  );
}

