import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/config/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const planId = searchParams.get('planId') || 'plan_monthly';

  if (!userId) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  try {
    const adminSupabase = createAdminClient();
    const periodStart = new Date();
    const periodEnd = new Date();
    if (planId === 'plan_annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Upsert subscription
    await adminSupabase.from('subscriptions').upsert(
      {
        user_id: userId,
        status: 'active',
        stripe_subscription_id: `sub_mock_${Date.now()}`,
        stripe_customer_id: `cus_mock_${userId.slice(0, 8)}`,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
      },
      { onConflict: 'user_id' }
    );

    // Make sure user profile has subscriber role
    await adminSupabase
      .from('profiles')
      .update({ role: 'subscriber' })
      .eq('id', userId);

    return NextResponse.redirect(
      new URL(`${ROUTES.dashboard}?subscribed=true`, request.url)
    );
  } catch (error) {
    console.error('Mock subscribe error:', error);
    return NextResponse.redirect(
      new URL(`${ROUTES.dashboard}?error=mock_subscribe_failed`, request.url)
    );
  }
}
