import { Metadata } from 'next';
import Link from 'next/link';
import ImeiChecker from '@/components/marketplace/ImeiChecker';
import { Shield, ArrowLeft, Smartphone, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IMEI / Blacklist Checker - Phone Master',
  description: 'Verify that a mobile device is not reported as lost or stolen before purchase. Free IMEI blacklist checker.',
};

const HOW_TO_STEPS = [
  { step: '1', text: <>Dial <code className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-primary ring-1 ring-black/10">*#06#</code> on any phone — the IMEI appears instantly</> },
  { step: '2', text: 'Go to Settings → About Phone → IMEI Information' },
  { step: '3', text: 'Check the original box or the SIM tray label' },
  { step: '4', text: 'iPhone users: Settings → General → About → IMEI' },
];

const WHY_CHECK = [
  'Confirm the device is not reported lost or stolen',
  'Ensure it is not carrier-blacklisted across UK networks',
  'Detect counterfeit or tampered IMEI numbers',
  'Protect yourself before completing any purchase',
];

export default function ImeiCheckPage() {
  return (
    <div className="flex flex-col gap-10 pb-20">

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-700 via-teal-700 to-emerald-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Link
            href="/support"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Support Center
          </Link>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            IMEI <span className="text-teal-300">Blacklist Checker</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-white/65">
            Free instant verification — check any device before you buy. Covers all major UK networks.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Main checker */}
        <ImeiChecker />

        {/* Info grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* How to find IMEI */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-base font-black text-gray-900">How to Find Your IMEI</h2>
            </div>
            <div className="flex flex-col gap-3.5">
              {HOW_TO_STEPS.map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                    {step}
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why check */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-base font-black text-gray-900">Why Check IMEI?</h2>
            </div>
            <div className="flex flex-col gap-3">
              {WHY_CHECK.map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm font-medium text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-black text-amber-900">Important Notice</p>
            <p className="mt-1 text-sm font-medium text-amber-700">
              This checker provides Luhn-algorithm validation and basic blacklist status. For a full
              carrier report — including warranty, activation lock, and detailed network status —
              use a professional IMEI service. Always inspect the device physically before completing a purchase.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
