import Stripe from 'stripe';

/**
 * Server-side Stripe client.
 * Only import this in server components, server actions, or API routes.
 */
export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey.startsWith('sk_test_...') || secretKey === 'sk_test_...') {
    // Development mode — Stripe not configured
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: '2026-08-26.dahlia',
    typescript: true,
  });
}

/**
 * Check if Stripe is configured (has real keys).
 */
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && !key.startsWith('sk_test_...') && key !== 'sk_test_...';
}
