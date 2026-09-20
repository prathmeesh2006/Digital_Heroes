import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeDraw, mapScoresToNumbers } from '@/lib/draw/engine';
import { calculatePrizeDistribution } from '@/lib/draw/prizes';
import type { DrawMode, DrawUserEntry } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const mode: DrawMode = body.mode === 'algorithmic' ? 'algorithmic' : 'random';
    const drawName = body.drawName || `Official Draw — ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    const totalPrizePool = body.totalPrizePool || 500000; // £5,000 in minor units
    const rolloverAmount = body.rolloverAmount || 250000; // £2,500 in minor units

    const adminSupabase = createAdminClient();

    // Fetch all active subscribers
    const { data: activeSubs } = await adminSupabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active');

    const subscriberIds = activeSubs?.map((s) => s.user_id) || [];
    let userEntries: DrawUserEntry[] = [];

    if (subscriberIds.length > 0) {
      const { data: scores } = await adminSupabase
        .from('scores')
        .select('user_id, score_value, played_date')
        .in('user_id', subscriberIds)
        .order('played_date', { ascending: false });

      if (scores) {
        const grouped = new Map<string, number[]>();
        for (const s of scores) {
          const current = grouped.get(s.user_id) || [];
          if (current.length < 5) {
            current.push(s.score_value);
            grouped.set(s.user_id, current);
          }
        }

        userEntries = Array.from(grouped.entries()).map(([uId, sValues]) => ({
          userId: uId,
          numbers: mapScoresToNumbers(sValues),
        }));
      }
    }

    // Execute the draw algorithm
    const drawEngineResult = executeDraw(mode, userEntries);

    // Calculate prize distribution
    const prizeCalc = calculatePrizeDistribution({
      totalPool: totalPrizePool,
      rolloverIn: rolloverAmount,
      tier1WinnersCount: drawEngineResult.tier1Matches.length,
      tier2WinnersCount: drawEngineResult.tier2Matches.length,
      tier3WinnersCount: drawEngineResult.tier3Matches.length,
    });

    // Record draw in database
    const { data: drawRecord, error: drawError } = await adminSupabase
      .from('draws')
      .insert({
        name: drawName,
        draw_date: new Date().toISOString().split('T')[0],
        mode,
        total_prize_pool: totalPrizePool,
        rollover_in: rolloverAmount,
        rollover_out: prizeCalc.rolloverOut,
        status: 'completed',
        executed_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (drawError) {
      console.warn('Draw record creation note:', drawError.message);
    }

    const drawId = drawRecord?.id;

    // Record draw results (numbers)
    if (drawId) {
      await adminSupabase.from('draw_results').insert({
        draw_id: drawId,
        numbers: drawEngineResult.winningNumbers,
        published_at: new Date().toISOString(),
      });
    }

    // Record winners in database
    const winnersToInsert: any[] = [];

    // Tier 1 winners
    for (const match of drawEngineResult.tier1Matches) {
      winnersToInsert.push({
        draw_id: drawId,
        user_id: match.userId,
        tier: 'tier1',
        gross_amount: prizeCalc.tier1PerWinner,
        verification_status: 'pending_verification',
      });
    }

    // Tier 2 winners
    for (const match of drawEngineResult.tier2Matches) {
      winnersToInsert.push({
        draw_id: drawId,
        user_id: match.userId,
        tier: 'tier2',
        gross_amount: prizeCalc.tier2PerWinner,
        verification_status: 'pending_verification',
      });
    }

    // Tier 3 winners
    for (const match of drawEngineResult.tier3Matches) {
      winnersToInsert.push({
        draw_id: drawId,
        user_id: match.userId,
        tier: 'tier3',
        gross_amount: prizeCalc.tier3PerWinner,
        verification_status: 'pending_verification',
      });
    }

    if (winnersToInsert.length > 0 && drawId) {
      await adminSupabase.from('winners').insert(winnersToInsert);
    }

    // Record audit log
    await adminSupabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'execute_draw',
      target_type: 'draw',
      target_id: drawId,
      details: {
        winningNumbers: drawEngineResult.winningNumbers,
        mode,
        tier1Winners: drawEngineResult.tier1Matches.length,
        tier2Winners: drawEngineResult.tier2Matches.length,
        tier3Winners: drawEngineResult.tier3Matches.length,
        rolloverOut: prizeCalc.rolloverOut,
      },
    });

    return NextResponse.json({
      success: true,
      draw: drawRecord,
      winningNumbers: drawEngineResult.winningNumbers,
      tier1MatchesCount: drawEngineResult.tier1Matches.length,
      tier2MatchesCount: drawEngineResult.tier2Matches.length,
      tier3MatchesCount: drawEngineResult.tier3Matches.length,
      prizes: prizeCalc,
    });
  } catch (err: any) {
    console.error('Draw execution error:', err);
    return NextResponse.json({ error: err.message || 'Draw execution failed' }, { status: 500 });
  }
}
