import { getStripeClient, isStripeConfigured } from './client';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Subscription } from '@/types';
import { SUBSCRIPTION_PLANS, type PlanConfig } from '@/config/plans';

export { SUBSCRIPTION_PLANS, type PlanConfig };

/**
 * Creates a Stripe Checkout Session for subscription purchase.
 * If Stripe is in dev/test mode without API keys, returns a mock session URL
 * that activates the subscription in Supabase directly!
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  planId,
  origin,
}: {
  userId: string;
  userEmail: string;
  planId: string;
  origin: string;
}) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];

  if (!isStripeConfigured()) {
    // Development / Mock mode
    return {
      url: `${origin}/api/stripe/mock-subscribe?userId=${userId}&planId=${plan.id}`,
      sessionId: `mock_session_${Date.now()}`,
    };
  }

  const stripe = getStripeClient()!;

  // Look up customer or create one
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { userId },
    });
    customerId = customer.id;

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Digital Heroes — ${plan.name}`,
            description: plan.description,
          },
          unit_amount: plan.price,
          recurring: {
            interval: plan.interval,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      planId: plan.id,
    },
    success_url: `${origin}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/settings?subscription=cancelled`,
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * Creates a Stripe Customer Portal session for updating payment methods,
 * upgrading plans, or canceling subscriptions.
 */
export async function createPortalSession({
  userId,
  origin,
}: {
  userId: string;
  origin: string;
}) {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (!profile?.stripe_customer_id || !isStripeConfigured()) {
    return { url: `${origin}/dashboard/settings` };
  }

  const stripe = getStripeClient()!;
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/dashboard/settings`,
  });

  return { url: portalSession.url };
}

/**
 * Activates or updates a subscription in Supabase using the admin service client.
 */
export async function upsertSubscriptionRecord({
  userId,
  stripeSubscriptionId,
  stripeCustomerId,
  planId,
  status,
  currentPeriodStart,
  currentPeriodEnd,
}: {
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  planId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}) {
  const adminSupabase = createAdminClient();

  const record: Partial<Subscription> = {
    user_id: userId,
    stripe_subscription_id: stripeSubscriptionId,
    stripe_customer_id: stripeCustomerId,
    status,
    current_period_start: currentPeriodStart.toISOString(),
    current_period_end: currentPeriodEnd.toISOString(),
  };

  const { data, error } = await adminSupabase
    .from('subscriptions')
    .upsert(record, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Failed to upsert subscription record:', error);
    throw error;
  }

  return data;
}
