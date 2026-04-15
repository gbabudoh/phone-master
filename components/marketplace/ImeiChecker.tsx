'use client';

import { useState } from 'react';
import {
  Shield, CheckCircle2, XCircle, Loader2,
  AlertTriangle, Info, Cpu, Smartphone, ArrowRight,
} from 'lucide-react';

type CheckResult = {
  isValid: boolean;
  isBlacklisted: boolean;
  status: string;
  details?: {
    tac?: string;
    manufacturer?: string;
    model?: string;
    recommendation?: string;
    warning?: string;
  };
};

export default function ImeiChecker() {
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = async () => {
    if (imei.length !== 15) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/imei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei }),
      });
      setResult(await response.json());
    } catch {
      setResult({ isValid: false, isBlacklisted: false, status: 'Unable to check IMEI. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const status = result
    ? result.isBlacklisted
      ? { bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, iconColor: 'text-red-600', iconBg: 'bg-red-100', title: 'Device is Blacklisted', titleColor: 'text-red-800' }
      : !result.isValid
      ? { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', iconBg: 'bg-amber-100', title: 'Invalid or Suspicious IMEI', titleColor: 'text-amber-800' }
      : { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', title: 'Device is Clean', titleColor: 'text-emerald-800' }
    : null;

  const digits = imei.length;
  const progressWidth = `${(digits / 15) * 100}%`;
  const progressColor = digits === 15 ? 'bg-emerald-500' : digits >= 10 ? 'bg-primary' : 'bg-gray-300';

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Shield className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900">Check IMEI Status</h2>
          <p className="text-xs font-medium text-gray-400">Enter the 15-digit IMEI number to verify</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="imei" className="text-sm font-bold text-gray-700">
              IMEI Number
            </label>
            <span className={`text-xs font-bold tabular-nums ${digits === 15 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {digits}/15
            </span>
          </div>
          <input
            id="imei"
            type="text"
            inputMode="numeric"
            value={imei}
            onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))}
            placeholder="Enter 15-digit IMEI number"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm font-medium tracking-widest text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
          {/* Progress bar */}
          <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: progressWidth }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Dial <span className="font-mono font-bold text-gray-600">*#06#</span> on any phone to display your IMEI
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleCheck}
          disabled={loading || digits !== 15}
          className="group w-full rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking IMEI...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" /> Check IMEI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </button>

        {/* Result */}
        {result && status && (() => {
          const Icon = status.icon;
          return (
            <div className={`rounded-2xl border ${status.border} ${status.bg} overflow-hidden`}>

              {/* Status header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.iconBg}`}>
                  <Icon className={`h-5 w-5 ${status.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-base font-black ${status.titleColor}`}>{status.title}</p>
                  <p className="text-xs font-medium text-gray-500 capitalize">{result.status}</p>
                </div>
              </div>

              {/* Device details */}
              {result.details && (result.details.manufacturer || result.details.model || result.details.tac) && (
                <div className="border-t border-black/5 bg-white/60 px-5 py-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">Device Info</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {result.details.manufacturer && (
                      <div className="flex items-start gap-2">
                        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Manufacturer</p>
                          <p className="text-sm font-bold text-gray-800">{result.details.manufacturer}</p>
                        </div>
                      </div>
                    )}
                    {result.details.model && (
                      <div className="flex items-start gap-2">
                        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Model</p>
                          <p className="text-sm font-bold text-gray-800">{result.details.model}</p>
                        </div>
                      </div>
                    )}
                    {result.details.tac && (
                      <div className="flex items-start gap-2">
                        <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">TAC Code</p>
                          <p className="text-sm font-mono font-bold text-gray-800">{result.details.tac}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Verdict banner */}
              <div className="border-t border-black/5 px-5 py-4">
                {result.isBlacklisted && (
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-black text-red-800">Do not purchase this device</p>
                      <p className="mt-0.5 text-xs font-medium text-red-600">
                        This device has been reported lost or stolen and may be blocked from all UK networks. Buying it could be illegal.
                      </p>
                    </div>
                  </div>
                )}
                {!result.isValid && !result.isBlacklisted && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-black text-amber-800">Caution — possible counterfeit</p>
                      <p className="mt-0.5 text-xs font-medium text-amber-600">
                        This IMEI failed validation. The device may be fake or have a tampered IMEI. We recommend not purchasing.
                      </p>
                    </div>
                  </div>
                )}
                {result.isValid && !result.isBlacklisted && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-black text-emerald-800">Device appears genuine</p>
                      <p className="mt-0.5 text-xs font-medium text-emerald-600">
                        {result.details?.recommendation || 'IMEI passed validation and is not blacklisted. Always inspect the device physically before completing purchase.'}
                      </p>
                    </div>
                  </div>
                )}
                {result.details?.warning && (
                  <p className="mt-3 text-xs font-bold text-red-600">{result.details.warning}</p>
                )}
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  );
}
