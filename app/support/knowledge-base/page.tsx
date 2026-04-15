'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Tag, Shield, CreditCard, UserCircle,
  Building2, ChevronDown, ChevronUp, ArrowLeft,
  MessageCircle, Search,
} from 'lucide-react';

type Article = { q: string; a: string };
type Category = {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  articles: Article[];
};

const CATEGORIES: Category[] = [
  {
    id: 'buying',
    icon: ShoppingBag,
    label: 'Buying a Phone',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    articles: [
      {
        q: 'How do I buy a phone on Phone Master?',
        a: 'Browse listings in the marketplace, filter by your preferred seller type (individual, retail, or wholesale), and click a listing to view details. When ready, initiate a purchase — our escrow system holds your payment securely until you confirm receipt of the device.',
      },
      {
        q: 'What is the difference between individual, retail, and wholesale listings?',
        a: 'Individual listings are from personal sellers offloading their own devices (up to 5 listings). Retail listings are from verified business sellers with storefronts. Wholesale listings are bulk lots from distributors — best for resellers and businesses buying in volume.',
      },
      {
        q: 'Are devices tested before listing?',
        a: 'All listings require sellers to declare condition (New, Refurbished, Used) and grade (A, B, C). Wholesale and retail sellers are verified before they can list. We also run IMEI checks — look for the IMEI Verified badge on listings.',
      },
      {
        q: 'What if the device I receive is not as described?',
        a: 'Your payment is held in escrow and only released to the seller after you confirm the device matches the listing. If there is a discrepancy, open a dispute within 48 hours of delivery and our support team will investigate.',
      },
    ],
  },
  {
    id: 'selling',
    icon: Tag,
    label: 'Selling a Device',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    articles: [
      {
        q: 'How do I list a device for sale?',
        a: 'Register or log in, go to your seller dashboard, and click "New Listing". Fill in the device details — brand, model, condition, grade, network status, and price. Add clear photos and submit. Active listings appear in the marketplace immediately.',
      },
      {
        q: 'What are the commission rates?',
        a: 'Personal sellers pay no commission but are limited to 5 active listings. Retail sellers pay a 3% transaction fee per sale. Wholesale sellers pay 5% per transaction but get API access, bulk tools, and a dedicated account manager.',
      },
      {
        q: 'How and when do I get paid?',
        a: 'Payment is released from escrow once the buyer confirms receipt (or after the dispute window closes — typically 48 hours). Funds are sent to your registered payout method within 1–2 business days.',
      },
      {
        q: 'Can I edit or remove a listing after it goes live?',
        a: 'Yes. From your seller dashboard, find the listing and click Edit or Deactivate. Listings with active buyer interest or pending escrow transactions cannot be removed until the transaction is resolved.',
      },
    ],
  },
  {
    id: 'imei',
    icon: Shield,
    label: 'IMEI & Verification',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    articles: [
      {
        q: 'What is an IMEI number?',
        a: 'IMEI (International Mobile Equipment Identity) is a unique 15-digit number that identifies every mobile device worldwide. It is used to verify a phone\'s identity, check if it has been reported stolen, and confirm its network lock status.',
      },
      {
        q: 'How do I find my phone\'s IMEI?',
        a: 'Dial *#06# on any phone to display the IMEI instantly. You can also find it in Settings → About Phone → IMEI, on the original box, or on the SIM tray sticker. iPhones: Settings → General → About.',
      },
      {
        q: 'What does "blacklisted" mean?',
        a: 'A blacklisted device has been reported lost or stolen, or flagged by a network for non-payment. Blacklisted phones are blocked from connecting to most carrier networks. Never buy a blacklisted device — use our free IMEI checker before every purchase.',
      },
      {
        q: 'What is the difference between unlocked and carrier-locked?',
        a: 'An unlocked phone works on any compatible network worldwide. A carrier-locked phone is restricted to a single network provider (e.g. EE, Vodafone, O2, Three, Lebara, Virgin, and more). Locked phones are typically cheaper but less flexible. Check the network status on every listing before buying.',
      },
    ],
  },
  {
    id: 'escrow',
    icon: CreditCard,
    label: 'Escrow & Payments',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    articles: [
      {
        q: 'How does escrow work on Phone Master?',
        a: 'When you initiate a purchase, your payment is held by Phone Master in escrow — neither the seller nor us can spend it. Once you receive the device and confirm it matches the listing, we release the funds to the seller. If you raise a dispute, we hold the funds until it is resolved.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept bank transfers, card payments, and selected mobile money providers. All payments are processed securely. We do not store your card details — all card transactions are handled by our certified payment processor.',
      },
      {
        q: 'How do I open a dispute?',
        a: 'Within 48 hours of confirming delivery, go to your order in the buyer dashboard and click "Open Dispute". Describe the issue and upload supporting evidence (photos, video). Our team reviews all disputes within 24 hours and will contact both parties.',
      },
      {
        q: 'Are there any fees for buyers?',
        a: 'Buyers pay no commission or platform fee. You pay the listed price plus any applicable delivery charges agreed with the seller. Escrow is included at no extra cost.',
      },
    ],
  },
  {
    id: 'account',
    icon: UserCircle,
    label: 'Account & Settings',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    articles: [
      {
        q: 'How do I change my account type?',
        a: 'Account type changes (e.g. from personal seller to retail seller) require re-registration or contacting support. This is because each seller tier has different verification requirements. Reach out via the Contact page and we will guide you through the upgrade process.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login page, click "Forgot password?" and enter your email address. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive. The reset link expires after 1 hour.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'Each email address may only be registered once. Having duplicate accounts to circumvent listing limits or verification requirements is against our Terms of Service and may result in all accounts being suspended.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Contact our support team via the Contact page to request account deletion. We will process deletion within 7 days, provided there are no open transactions, active listings, or pending dispute resolutions.',
      },
    ],
  },
  {
    id: 'wholesale',
    icon: Building2,
    label: 'Wholesale & Bulk',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    articles: [
      {
        q: 'Who is the wholesale tier for?',
        a: 'The wholesale tier is designed for distributors, importers, large retailers, and businesses that buy or sell mobile devices in bulk (10+ units per order). It offers the lowest commission rate (5%), API access for inventory integration, and a dedicated account manager.',
      },
      {
        q: 'How do I become a verified wholesale seller?',
        a: 'Register with the Wholesale Seller account type. Our team will contact you to complete business verification — you may be asked to provide business registration documents, proof of inventory, and bank details. Verification typically takes 2–3 business days.',
      },
      {
        q: 'What is API access and how do I use it?',
        a: 'Wholesale sellers get API credentials to integrate their inventory management systems directly with Phone Master. This allows automated listing creation, stock updates, and order management without logging into the dashboard. Documentation is provided after account verification.',
      },
      {
        q: 'Is there a minimum order quantity for wholesale purchases?',
        a: 'Minimum order quantities are set by individual wholesale sellers — there is no platform-wide minimum. Check each listing for the seller\'s specified MOQ (Minimum Order Quantity). Most wholesale listings start from 5–10 units.',
      },
    ],
  },
];

function AccordionItem({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-gray-100 last:border-0 ${open ? 'bg-gray-50/50' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/80"
      >
        <span className={`text-sm font-bold ${open ? 'text-primary' : 'text-gray-800'}`}>
          {article.q}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm font-medium leading-relaxed text-gray-600">{article.a}</p>
        </div>
      )}
    </div>
  );
}

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const query = search.toLowerCase().trim();
  const filteredCategories = CATEGORIES
    .filter((cat) => !activeCategory || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      articles: query
        ? cat.articles.filter(
            (a) => a.q.toLowerCase().includes(query) || a.a.toLowerCase().includes(query)
          )
        : cat.articles,
    }))
    .filter((cat) => cat.articles.length > 0);

  const totalResults = filteredCategories.reduce((n, c) => n + c.articles.length, 0);

  return (
    <div className="flex flex-col gap-10 pb-20">

      {/* Hero */}
      <section className="border-b border-gray-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/support"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Support Center
          </Link>
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">Knowledge Base</h1>
          <p className="mt-3 text-base font-medium text-gray-500">
            Guides and answers for buyers, sellers, and everything in between.
          </p>

          {/* Search */}
          <div className="mt-6 flex items-center overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-black/5">
            <div className="flex flex-1 items-center gap-3 px-5 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mr-3 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              !activeCategory
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            All Topics
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? null : cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
            <Search className="mb-4 h-10 w-10 text-gray-300" />
            <h3 className="text-base font-black text-gray-700">No articles found</h3>
            <p className="mt-2 text-sm font-medium text-gray-400">
              Try different keywords or{' '}
              <button onClick={() => setSearch('')} className="text-primary underline">
                clear the search
              </button>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {query && (
              <p className="text-sm font-semibold text-gray-500">
                <span className="font-black text-gray-900">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
              </p>
            )}

            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  {/* Category header */}
                  <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cat.bg}`}>
                      <Icon className={`h-4.5 w-4.5 ${cat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{cat.label}</p>
                      <p className="text-xs font-medium text-gray-400">{cat.articles.length} article{cat.articles.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div>
                    {cat.articles.map((article, i) => (
                      <AccordionItem key={i} article={article} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Still need help */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-primary/5 px-8 py-10 text-center sm:flex-row sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircle className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-gray-900">Still have questions?</p>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Ask Phone Genius AI for instant answers, or contact our support team directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/support/chatbot"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-black text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
            >
              Ask Phone Genius
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-gray-700 transition-all hover:bg-gray-50"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
