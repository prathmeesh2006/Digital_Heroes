/**
 * Monetary value utilities.
 * All monetary values are stored as integers in minor units (pence/cents).
 * These helpers convert between display format and storage format.
 */

/**
 * Convert major units (pounds/dollars) to minor units (pence/cents).
 * Example: 9.99 → 999
 */
export function toMinorUnits(majorUnits: number): number {
  return Math.round(majorUnits * 100);
}

/**
 * Convert minor units (pence/cents) to major units (pounds/dollars).
 * Example: 999 → 9.99
 */
export function toMajorUnits(minorUnits: number): number {
  return minorUnits / 100;
}

/**
 * Format minor units as a currency string.
 * Example: 999, 'gbp' → '£9.99'
 */
export function formatCurrency(minorUnits: number, currency: string = 'gbp'): string {
  const majorUnits = toMajorUnits(minorUnits);
  const locale = currency === 'gbp' ? 'en-GB' : 'en-US';
  const currencyCode = currency.toUpperCase();

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
}

export const formatMoney = formatCurrency;

/**
 * Calculate percentage of an amount in minor units.
 * Uses integer arithmetic to avoid floating-point issues.
 * Example: calculatePercentage(1000, 40) → 400
 */
export function calculatePercentage(amountMinorUnits: number, percentage: number): number {
  return Math.floor((amountMinorUnits * percentage) / 100);
}

/**
 * Divide an amount equally among recipients.
 * Returns the per-recipient share (remainder stays with platform).
 * Example: divideEqually(1000, 3) → 333
 */
export function divideEqually(amountMinorUnits: number, recipientCount: number): number {
  if (recipientCount <= 0) return 0;
  return Math.floor(amountMinorUnits / recipientCount);
}
