import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { charityContributionSchema } from '@/lib/validations/charity';
import { FALLBACK_CHARITIES } from '@/config/charities';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: contribution, error } = await supabase
      .from('charity_contributions')
      .select('*, charity:charities(*)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!contribution) {
      // Return default recommendation
      return NextResponse.json({
        contribution: {
          user_id: user.id,
          charity_id: FALLBACK_CHARITIES[0].id,
          charity_percentage: 10,
          charity: FALLBACK_CHARITIES[0],
        },
      });
    }

    return NextResponse.json({ contribution });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = charityContributionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid contribution settings' },
        { status: 400 }
      );
    }

    const { charity_id, charity_percentage } = validation.data;

    // Minimum 10% PRD check [EXPLICIT]
    if (charity_percentage < 10) {
      return NextResponse.json(
        { error: 'Minimum charity contribution is 10%' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('charity_contributions')
      .upsert(
        {
          user_id: user.id,
          charity_id,
          charity_percentage,
        },
        { onConflict: 'user_id' }
      )
      .select('*, charity:charities(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ contribution: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
