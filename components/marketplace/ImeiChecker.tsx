'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, XCircle, Loader2, AlertTriangle, Info } from 'lucide-react';
import { checkIMEI } from '@/lib/ai/gemini-api';
import { cn } from '@/lib/utils';

export default function ImeiChecker() {
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isValid: boolean;
    isBlacklisted: boolean;
    status: string;
    details?: any;
  } | null>(null);

  const handleCheck = async () => {
    if (!imei.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const checkResult = await checkIMEI(imei);
      setResult(checkResult);
    } catch (error) {
      setResult({
        isValid: false,
        isBlacklisted: false,
        status: 'error - Unable to check IMEI',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    if (result.isBlacklisted) return 'border-red-200 bg-red-50';
    if (!result.isValid) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.isBlacklisted) return <XCircle className="h-6 w-6 text-red-600" />;
    if (!result.isValid) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <CheckCircle2 className="h-6 w-6 text-green-600" />;
  };

  return (
    <div className="rounded-lg border border-accent-grey/20 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Check IMEI Status</h2>
      </div>
      <p className="mb-6 text-sm text-foreground/60">
        Enter the 15-digit IMEI number to verify device authenticity and blacklist status.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="imei" className="mb-2 block text-sm font-medium text-foreground">
            IMEI Number
          </label>
          <input
            id="imei"
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 15-digit IMEI (e.g., 123456789012345)"
            maxLength={15}
            className="w-full rounded-lg border-2 border-accent-grey/20 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-2 flex items-center space-x-2 text-xs text-foreground/60">
            <Info className="h-4 w-4" />
            <span>Find IMEI: Dial *#06# or check Settings → About Phone</span>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || imei.length !== 15}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking IMEI...</span>
            </span>
          ) : (
            'Check IMEI'
          )}
        </button>

        {result && (
          <div className={cn('rounded-lg border-2 p-6', getStatusColor())}>
            <div className="flex items-start space-x-4">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className="text-lg font-bold">
                  {result.isBlacklisted
                    ? '⚠️ Device is Blacklisted'
                    : !result.isValid
                    ? '⚠️ Invalid or Fake IMEI'
                    : '✓ Device is Clean'}
                </h3>
                <p className="mt-2 text-sm font-medium">
                  Status: <span className="font-semibold">{result.status}</span>
                </p>

                {result.details && (
                  <div className="mt-4 space-y-2">
                    {result.details.tac && (
                      <p className="text-sm">
                        <span className="font-medium">TAC Code:</span> {result.details.tac}
                      </p>
                    )}
                    {result.details.manufacturer && (
                      <p className="text-sm">
                        <span className="font-medium">Manufacturer:</span> {result.details.manufacturer}
                      </p>
                    )}
                    {result.details.recommendation && (
                      <p className="mt-3 text-sm font-medium">
                        💡 {result.details.recommendation}
                      </p>
                    )}
                    {result.details.warning && (
                      <p className="mt-3 text-sm font-bold text-red-600">
                        ⚠️ {result.details.warning}
                      </p>
                    )}
                  </div>
                )}

                {result.isBlacklisted && (
                  <div className="mt-4 rounded-lg bg-red-100 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      🚫 DO NOT PURCHASE THIS DEVICE
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      This device has been reported as lost or stolen. Purchasing it may be illegal
                      and the device may be blocked from network use.
                    </p>
                  </div>
                )}

                {!result.isValid && (
                  <div className="mt-4 rounded-lg bg-yellow-100 p-4">
                    <p className="text-sm font-semibold text-yellow-800">
                      ⚠️ CAUTION: Possible Counterfeit
                    </p>
                    <p className="mt-1 text-xs text-yellow-700">
                      This IMEI failed validation checks. The device may be fake or have a tampered IMEI.
                      We recommend not purchasing this device.
                    </p>
                  </div>
                )}

                {result.isValid && !result.isBlacklisted && (
                  <div className="mt-4 rounded-lg bg-green-100 p-4">
                    <p className="text-sm font-semibold text-green-800">
                      ✓ Device Appears Genuine
                    </p>
                    <p className="mt-1 text-xs text-green-700">
                      This IMEI passed validation checks and is not blacklisted. However, always verify
                      the device physically before purchase.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

