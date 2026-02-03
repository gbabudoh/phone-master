'use client';

import { useState, useEffect } from 'react';
import { FileText, Edit, Plus, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/pages/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(p => p.slug !== slug));
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Pages</h1>
          <p className="mt-1 text-foreground/60">Manage static content pages (Terms, Privacy, etc.)</p>
        </div>
        <Link
          href="/admin/pages/create"
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Create Page</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-accent-grey/20 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-accent-grey/10">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/40">Page Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/40">Slug</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/40">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground/40">Last Updated</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-foreground/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-foreground/40">
                  No pages found. Create one to get started.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs">/{page.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    {page.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-foreground/40 hover:bg-white hover:text-primary hover:shadow-md transition-all"
                        title="View Live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.slug}`}
                        className="rounded-lg p-2 text-foreground/40 hover:bg-white hover:text-primary hover:shadow-md transition-all"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        className="rounded-lg p-2 text-foreground/40 hover:bg-white hover:text-red-500 hover:shadow-md transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
