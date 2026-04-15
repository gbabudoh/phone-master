import { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Shield, HelpCircle, BookOpen, ArrowRight, Zap, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support - Phone Master',
  description: 'Get help with mobile devices, troubleshooting, compatibility checks, and more.',
};

const quickQuestions = [
  'How do I check if a phone is stolen?',
  'What does IMEI blacklisted mean?',
  'Is this device compatible with my network?',
  'How does escrow work?',
];

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-[#013a63] to-[#01294a] py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            Support Center
          </span>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            How can we <span className="text-cyan-300">help you?</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-white/65">
            AI-powered answers, IMEI verification, guides, and a human team — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-white/60">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Instant AI answers</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Free IMEI checks</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> 24/7 available</span>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 flex flex-col gap-8">

        {/* Phone Genius — Featured hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-cyan-50/50 pointer-events-none" />
          <div className="relative grid grid-cols-1 gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-gray-900">Phone Genius</h2>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      AI Online
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500">AI-powered mobile device assistant</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium mb-6">
                Get instant, expert-level answers about any mobile device — troubleshooting, compatibility, network checks, repairs, and buying advice. Powered by Gemini AI.
              </p>
              <div className="mb-6 flex flex-wrap gap-3 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5"><Zap className="h-3.5 w-3.5 text-yellow-500" /> Instant answers</span>
                <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" /> Available 24/7</span>
              </div>
              <Link
                href="/support/chatbot"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-95"
              >
                <span>Chat with Phone Genius</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick question chips */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Try asking:</p>
              {quickQuestions.map((q) => (
                <Link
                  key={q}
                  href={`/support/chatbot?q=${encodeURIComponent(q)}`}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary group"
                >
                  <span>{q}</span>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary tools — 3-column grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* IMEI Checker */}
          <Link
            href="/support/imei-check"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 to-teal-500/0 opacity-0 transition-opacity group-hover:opacity-5 pointer-events-none" />
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Shield className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-900">IMEI Checker</h2>
            <p className="text-sm font-medium text-gray-500 mb-2">Verify device status</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Instantly check if a device is blacklisted, stolen, or carrier-locked before you buy.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 group-hover:gap-3 transition-all">
              Check IMEI <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Knowledge Base */}
          <Link
            href="/support/knowledge-base"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
              <BookOpen className="h-7 w-7 text-purple-600" />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-900">Knowledge Base</h2>
            <p className="text-sm font-medium text-gray-500 mb-2">Guides & tutorials</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Step-by-step guides on device troubleshooting, compatibility, buying tips, and escrow.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-black text-purple-600 group-hover:gap-3 transition-all">
              Browse Guides <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Contact Support */}
          <Link
            href="/contact"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
              <HelpCircle className="h-7 w-7 text-orange-600" />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-900">Human Support</h2>
            <p className="text-sm font-medium text-gray-500 mb-2">Talk to a real person</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Need more help? Our team is ready to assist you with disputes, account issues, and more.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-black text-orange-600 group-hover:gap-3 transition-all">
              Contact Us <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
