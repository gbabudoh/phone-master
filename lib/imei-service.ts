/**
 * IMEI Device Identification Service
 * Uses algorithmic validation and AI-based lookup (no hardcoded databases)
 */

import { imei as validateLuhnImei } from 'luhn-validation';

export interface DeviceInfo {
  manufacturer: string;
  model: string;
  tac: string;
}

/**
 * Look up device information by IMEI
 * Returns null to force AI usage.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function lookupDeviceByIMEI(imei: string): DeviceInfo | null {
  return null;
}

/**
 * Validate IMEI using luhn-validation library
 */
export function validateIMEI(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false;
  const result = validateLuhnImei(imei);
  return result === true;
}
