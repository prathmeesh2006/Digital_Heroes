import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string for display.
 * Example: '2026-03-15' → '15 Mar 2026'
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'd MMM yyyy');
}

/**
 * Format a datetime string for display.
 * Example: '2026-03-15T10:30:00Z' → '15 Mar 2026, 10:30'
 */
export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'd MMM yyyy, HH:mm');
}

/**
 * Format relative time.
 * Example: '2026-03-15T10:30:00Z' → '2 days ago'
 */
export function formatRelative(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Get month name from month number.
 * Example: 3 → 'March'
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month - 1] || 'Unknown';
}

/**
 * Format draw date label.
 * Example: month=3, year=2026 → 'March 2026'
 */
export function formatDrawPeriod(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`;
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate URL-safe slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
