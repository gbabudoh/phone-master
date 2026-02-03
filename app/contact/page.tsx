'use client';

import { Mail, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ContentPage {
  title: string;
  content: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [page, setPage] = useState<ContentPage | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/pages/contact');
        const data = await response.json();
        if (data.page) {
          setPage(data.page);
        }
      } catch (error) {
        console.error('Failed to fetch contact page:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {page?.title || 'Get in Touch'}
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Have questions about the marketplace? Need support with an order? We&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl space-y-8 bg-white/60">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            
            {page ? (
               <div 
                  className="prose prose-sm text-gray-600 max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:mb-2" 
                  dangerouslySetInnerHTML={{ __html: page.content }} 
               />
            ) : (
                // Fallback content in case API fails or loading
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 cursor-pointer">
                      <Mail className="h-6 w-6 cursor-pointer" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Email</h3>
                      <p className="mt-1 text-gray-600">support@phonemaster.com</p>
                    </div>
                  </div>
                </div>
            )}
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary cursor-pointer" />
              Live Chat Support
            </h3>
            <p className="text-gray-600 mb-6">
              Need instant answers? Our Phone Genius AI is available 24/7, and human agents are online during business hours.
            </p>
            <Link 
              href="/support/chatbot"
              className="block w-full text-center py-3 bg-white text-primary font-bold rounded-xl shadow-sm border border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              Start Chat
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card-heavy p-8 md:p-10 rounded-[2.5rem] bg-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer ${
                status === 'success' 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25'
              }`}
            >
              {status === 'submitting' ? (
                <span>Sending...</span>
              ) : status === 'success' ? (
                <span>Message Sent!</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="h-4 w-4 cursor-pointer" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
