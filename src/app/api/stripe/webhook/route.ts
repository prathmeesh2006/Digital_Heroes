import { NextResponse, type NextRequest } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { upsertSubscriptionRecord } from '@/lib/stripe/subscriptions';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook is not configured on this server' },
      { status: 400 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId || 'plan_monthly';

          if (userId) {
            const periodStart = (subscription as any).current_period_start
              ? new Date((subscription as any).current_period_start * 1000)
              : new Date();
            const periodEnd = (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            await upsertSubscriptionRecord({
              userId,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: session.customer as string,
              planId,
              status: subscription.status as any,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const adminSupabase = createAdminClient();
        const { data: existingSub } = await adminSupabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();

        if (existingSub?.user_id) {
          const periodStart = (subscription as any).current_period_start
            ? new Date((subscription as any).current_period_start * 1000)
            : new Date();
          const periodEnd = (subscription as any).current_period_end
            ? new Date((subscription as any).current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await upsertSubscriptionRecord({
            userId: existingSub.user_id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            planId: 'plan_monthly',
            status: subscription.status as any,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const adminSupabase = createAdminClient();
        await adminSupabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: true,
          })
          .eq('stripe_customer_id', customerId);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const adminSupabase = createAdminClient();
        await adminSupabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook event:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
