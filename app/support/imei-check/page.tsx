import { Metadata } from 'next';
import ImeiChecker from '@/components/marketplace/ImeiChecker';
import { Shield, Info, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IMEI / Blacklist Checker - Phone Master',
  description: 'Verify that a mobile device is not reported as lost or stolen before purchase. Free IMEI blacklist checker.',
};

export default function ImeiCheckPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-cyan-light">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">IMEI / Blacklist Checker</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Verify that a device is not reported as lost or stolen before purchase
        </p>
      </div>

      {/* Main IMEI Checker */}
      <div className="mb-8">
        <ImeiChecker />
      </div>

      {/* Information Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* How to Find IMEI */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="mb-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">How to Find Your IMEI</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start">
              <span className="mr-2 font-semibold">1.</span>
              <span>Dial <code className="rounded bg-accent-cyan-light px-1">*#06#</code> on your phone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">2.</span>
              <span>Check Settings → About Phone → IMEI</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">3.</span>
              <span>Check the device box or SIM tray</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold">4.</span>
              <span>For iPhone: Settings → General → About</span>
            </li>
          </ul>
        </div>

        {/* Why Check IMEI */}
        <div className="rounded-lg border border-accent-grey/20 bg-white p-6">
          <div className="mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Why Check IMEI?</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Verify device is not reported stolen or lost</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Ensure device is not blacklisted by networks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Protect yourself from purchasing blocked devices</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Check device warranty and activation status</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="mb-2 font-semibold text-yellow-900">Important Notice</h3>
            <p className="text-sm text-yellow-800">
              This IMEI checker provides basic validation and blacklist status. For comprehensive device information,
              including detailed network status, warranty information, and carrier details, consider using a professional
              IMEI checking service. Always verify device status before completing a purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

