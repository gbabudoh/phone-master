'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

interface PageEditorProps {
  slug?: string; // If provided, we are in edit mode
}

export default function PageEditor({ slug }: PageEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '', // HTML/Markdown
    isActive: true,
  });

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  const fetchPage = async (slug: string) => {
    try {
      const response = await fetch(`/api/pages/${slug}`);
      const data = await response.json();
      if (data.page) {
        setFormData({
          title: data.page.title,
          slug: data.page.slug,
          content: data.page.content,
          isActive: data.page.isActive,
        });
      }
    } catch (error) {
      console.error('Failed to fetch page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const url = slug ? `/api/pages/${slug}` : '/api/pages';
      const method = slug ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/pages');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save page');
      }
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/pages"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-grey/20 bg-white text-foreground/60 transition-colors hover:bg-accent-cyan-light hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {slug ? 'Edit Page' : 'Create New Page'}
            </h1>
            <p className="mt-1 text-foreground/60">
              {slug ? `Editing: ${formData.title}` : 'Add a new static content page'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            {slug && (
                 <Link
                    href={`/${slug}`}
                    target="_blank"
                    className="flex items-center space-x-2 rounded-xl border border-accent-grey/20 bg-white px-4 py-2 font-medium text-foreground transition-colors hover:bg-accent-cyan-light"
                >
                    <Eye className="h-4 w-4" />
                    <span>View Live</span>
                </Link>
            )}
            
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center space-x-2 rounded-xl bg-primary px-6 py-2 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Page'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-accent-grey/20 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-foreground/80">Page Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-accent-grey/20 px-4 py-3 text-lg font-semibold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                placeholder="e.g. Terms of Service"
                required
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-bold text-foreground/80">Content (HTML Support)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-[600px] rounded-xl border border-accent-grey/20 px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                placeholder="<p>Enter your page content here...</p>"
                required
              />
              <p className="mt-2 text-xs text-foreground/40">
                You can use standard HTML tags for formatting.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-accent-grey/20 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-foreground">Page Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground/80">URL Slug</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-accent-grey/20 pl-6 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="terms-of-service"
                    disabled={!!slug} // Cannot change slug after creation for now to avoid breaking links
                    required
                  />
                </div>
                {slug && <p className="mt-1 text-xs text-orange-500">Slug cannot be changed after creation.</p>}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-bold text-foreground/80">Active Status</label>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        formData.isActive ? 'bg-primary' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
