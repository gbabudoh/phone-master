import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
                <span className="text-xl font-bold">PM</span>
              </div>
              <span className="text-xl font-bold">Phone Master</span>
            </div>
            <p className="text-sm text-white/80">
              Your trusted marketplace for mobile phones, accessories, and expert support.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/wholesale" className="text-sm text-white/80 hover:text-white">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link href="/retail" className="text-sm text-white/80 hover:text-white">
                  Retail
                </Link>
              </li>
              <li>
                <Link href="/individual" className="text-sm text-white/80 hover:text-white">
                  Individual
                </Link>
              </li>
              <li>
                <Link href="/search-marketplace" className="text-sm text-white/80 hover:text-white">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-sm text-white/80 hover:text-white">
                  Phone Genius
                </Link>
              </li>
              <li>
                <Link href="/support/chatbot" className="text-sm text-white/80 hover:text-white">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link href="/support/imei-check" className="text-sm text-white/80 hover:text-white">
                  IMEI Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-white/80 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-white/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/80 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Phone Master. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

