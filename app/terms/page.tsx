'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Shield, ArrowLeft, MessageCircle } from 'lucide-react';

interface ContentPage {
  title: string;
  content: string;
  updatedAt: string;
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero skeleton */}
      <div className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 h-16 w-16 animate-pulse rounded-2xl bg-gray-100" />
          <div className="mx-auto mb-3 h-9 w-64 animate-pulse rounded-xl bg-gray-100" />
          <div className="mx-auto h-4 w-40 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 space-y-4">
          {[80, 60, 90, 50, 75, 65, 85, 55].map((w, i) => (
            <div key={i} className={`h-3 animate-pulse rounded-full bg-gray-100`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFound({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h1 className="text-xl font-black text-gray-800">{label} Unavailable</h1>
      <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
        This document is currently unavailable. Please check back later or contact our support team.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function TermsPage() {
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/terms')
      .then((r) => r.json())
      .then((data) => { if (data.page) setPage(data.page); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (!page) return <NotFound label="Terms of Service" />;

  return (
    <div className="flex flex-col gap-10 pb-20">

      {/* Hero */}
      <section className="border-b border-gray-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-400">
            Last updated:{' '}
            <span className="font-bold text-gray-600">
              {new Date(page.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Content */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-sm ring-1 ring-black/5 md:px-12">
          <div
            className="prose prose-gray max-w-none
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium
              prose-li:text-gray-600 prose-li:font-medium
              prose-strong:text-gray-800 prose-strong:font-black
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-gray-800"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Contact CTA */}
        <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-primary/5 px-6 py-6 ring-1 ring-primary/10 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-gray-900">Questions about these terms?</p>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Contact our legal team at{' '}
              <a href="mailto:legal@phonemaster.com" className="font-bold text-primary hover:underline">
                legal@phonemaster.com
              </a>
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-black text-primary transition-all hover:bg-primary/5"
          >
            <MessageCircle className="h-4 w-4" /> Get Support
          </Link>
        </div>

        {/* Related links */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-400">
          <span>Also read:</span>
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          <Link href="/support/knowledge-base" className="text-primary hover:underline">Knowledge Base</Link>
          <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
        </div>

      </div>
    </div>
  );
}
