'use client';

import { useState, useEffect } from 'react';
import { FileText, Shield } from 'lucide-react';

interface ContentPage {
  title: string;
  content: string;
  updatedAt: string;
}

export default function TermsPage() {
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/pages/terms');
      const data = await response.json();
      if (data.page) {
        setPage(data.page);
      }
    } catch (error) {
      console.error('Failed to fetch terms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-gray-900">Content Not Found</h1>
        <p className="text-gray-500 mt-2">The Terms of Service are currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{page.title}</h1>
        <p className="mt-4 text-lg text-gray-500">
          Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Content Card */}
      <div className="rounded-3xl border border-white/20 bg-white/60 backdrop-blur-xl shadow-xl p-8 md:p-12 space-y-8">
        <div 
            className="prose prose-lg text-gray-600 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-p:mb-4 prose-li:mb-2 prose-strong:text-gray-900" 
            dangerouslySetInnerHTML={{ __html: page.content }} 
        />

        <div className="border-t border-gray-100 pt-8 mt-8">
          <div className="rounded-2xl bg-gray-50 p-6 flex items-start space-x-4">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Questions about these terms?</h3>
              <p className="text-gray-600 mt-1">
                If you have any questions or concerns regarding our terms of service, please contact our legal team at{' '}
                <a href="mailto:legal@phonemaster.com" className="text-primary hover:underline font-medium">
                  legal@phonemaster.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
