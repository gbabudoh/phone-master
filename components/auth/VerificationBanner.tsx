'use client';

import { useAuth } from './AuthProvider';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function VerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Only show verification banner for wholesale_seller accounts that are pending
  // Personal sellers, retail sellers, and buyers don't need verification banner
  if (!user || user.status !== 'pending_verification' || dismissed) {
    return null;
  }

  // Hide banner for all except wholesale_seller
  if (user.role !== 'wholesale_seller') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Account Verification Pending</strong>
            <br />
            Your account is pending verification. You can access your dashboard, but some features may be limited until your account is verified.
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="inline-flex text-yellow-400 hover:text-yellow-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

