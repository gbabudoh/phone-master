import Link from 'next/link';
import { Store, User, Building2, ArrowRight } from 'lucide-react';

export default function SellerOnboardingCard() {
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent-cyan-light/20 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Become a Seller</h3>
          <p className="text-foreground/70">
            Start selling your devices today. Choose the plan that fits your needs.
          </p>
        </div>
        <Link
          href="/buyer/upgrade"
          className="group flex items-center justify-center space-x-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg cursor-pointer"
        >
          <span>Start Selling</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm border border-accent-grey/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Personal</p>
            <p className="text-xs text-foreground/60">Sell up to 5 devices</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm border border-accent-grey/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Retail</p>
            <p className="text-xs text-foreground/60">Unlimited listings</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm border border-accent-grey/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Wholesale</p>
            <p className="text-xs text-foreground/60">Bulk sales & VAT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
