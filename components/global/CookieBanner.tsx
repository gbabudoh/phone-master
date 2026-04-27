'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, X, ChevronRight } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] sm:left-auto sm:w-[440px] animate-in slide-in-from-bottom-10 duration-700 ease-out">
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
        {/* Decorative background blur */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Privacy Center</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="ml-auto text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>
          </div>

          <div className="mt-4">
            {!showDetails ? (
              <p className="text-xs font-semibold leading-relaxed text-foreground/70">
                We use cookies to enhance your marketplace experience, analyze traffic, and ensure secure transactions.
              </p>
            ) : (
              <div className="space-y-4 py-2">
                <div className="rounded-2xl bg-accent-grey/5 p-3">
                  <p className="text-[10px] font-black text-foreground uppercase flex items-center justify-between">
                    Essential
                    <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Always On</span>
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-foreground/50">
                    Required for secure login, escrow protection, and payment processing via Stripe.
                  </p>
                </div>
                <div className="rounded-2xl bg-accent-grey/5 p-3">
                  <p className="text-[10px] font-black text-foreground uppercase">Functional</p>
                  <p className="mt-1 text-[10px] font-medium text-foreground/50">
                    Remembers your AI model status, currency preferences, and marketplace filters.
                  </p>
                </div>
                <div className="rounded-2xl bg-accent-grey/5 p-3">
                  <p className="text-[10px] font-black text-foreground uppercase">Analytics</p>
                  <p className="mt-1 text-[10px] font-medium text-foreground/50">
                    Helps us understand which phone models are trending to improve your experience.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={acceptAll}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 cursor-pointer"
            >
              <span>{showDetails ? 'Confirm Selection' : 'Accept Everything'}</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={acceptNecessary}
                className="flex-1 rounded-2xl bg-accent-grey/10 py-3 text-[10px] font-bold text-foreground/60 transition-all hover:bg-accent-grey/20 hover:text-foreground cursor-pointer"
              >
                Only Necessary
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex-1 rounded-2xl border py-3 text-[10px] font-bold transition-all cursor-pointer ${
                  showDetails 
                    ? 'bg-foreground text-white border-foreground' 
                    : 'border-accent-grey/20 text-foreground/60 hover:bg-accent-grey/5 hover:text-foreground'
                }`}
              >
                {showDetails ? 'Hide Details' : 'Preferences'}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] font-medium text-foreground/40">
            By clicking accept, you agree to our <a href="/privacy" className="underline hover:text-primary cursor-pointer">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
