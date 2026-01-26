import { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Shield, HelpCircle, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support - Phone Master',
  description: 'Get help with mobile devices, troubleshooting, compatibility checks, and more.',
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground">Support Center</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Get instant help with Phone Genius AI or explore our resources
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Phone Genius Chatbot */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-8">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan-light">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Phone Genius</h2>
              <p className="text-sm text-foreground/60">AI-powered mobile device assistant</p>
            </div>
          </div>
          <p className="mb-6 text-foreground/80">
            Get instant answers to your questions about mobile devices, troubleshooting, compatibility, and more.
            Click the chat button in the bottom right corner to start a conversation!
          </p>
          <Link
            href="/support/chatbot"
            className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <span>Open Chatbot</span>
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>

        {/* IMEI Checker */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-8">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan-light">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">IMEI / Blacklist Checker</h2>
              <p className="text-sm text-foreground/60">Verify device status</p>
            </div>
          </div>
          <p className="mb-6 text-foreground/80">
            Check if a device is reported as lost or stolen before making a purchase. Verify IMEI status instantly.
          </p>
          <Link
            href="/support/imei-check"
            className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <span>Check IMEI</span>
            <Shield className="h-4 w-4" />
          </Link>
        </div>

        {/* Knowledge Base */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-8">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan-light">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Knowledge Base</h2>
              <p className="text-sm text-foreground/60">Guides and tutorials</p>
            </div>
          </div>
          <p className="mb-6 text-foreground/80">
            Browse our comprehensive guides on mobile device troubleshooting, compatibility, and best practices.
          </p>
          <Link
            href="/support/knowledge-base"
            className="inline-flex items-center space-x-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light"
          >
            <span>Browse Guides</span>
            <BookOpen className="h-4 w-4" />
          </Link>
        </div>

        {/* Contact Support */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-8">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan-light">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Contact Support</h2>
              <p className="text-sm text-foreground/60">Get human assistance</p>
            </div>
          </div>
          <p className="mb-6 text-foreground/80">
            Need additional help? Our support team is here to assist you with any questions or issues.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-cyan-light"
          >
            <span>Contact Us</span>
            <HelpCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

