import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
    const totalPrizePool = body.totalPrizePool || 500000; // £5,000 in minor units
    const rolloverAmount = body.rolloverAmount || 250000; // £2,500 in minor units

    // Fetch all active subscribers with scores
    const { data: activeSubs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active');

    const subscriberIds = activeSubs?.map((s) => s.user_id) || [];

    // Fetch scores for these subscribers
    let userEntries: DrawUserEntry[] = [];

    if (subscriberIds.length > 0) {
      const { data: scores } = await supabase
        .from('scores')
        .select('user_id, score_value, played_date')
        .in('user_id', subscriberIds)
        .order('played_date', { ascending: false });

      if (scores) {
        // Group by user_id, up to 5 per user
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

    // If no active real entries, generate a mock testing cohort so simulation results can be evaluated
    if (userEntries.length === 0) {
      userEntries = [
        { userId: 'sim-user-1', numbers: [7, 14, 21, 28, 35] },
        { userId: 'sim-user-2', numbers: [12, 19, 28, 36, 42] },
        { userId: 'sim-user-3', numbers: [3, 14, 22, 33, 41] },
        { userId: 'sim-user-4', numbers: [5, 12, 21, 30, 44] },
        { userId: 'sim-user-5', numbers: [7, 18, 26, 35, 41] },
        { userId: 'sim-user-6', numbers: [14, 21, 28, 35, 41] },
      ];
    }

    // Run draw engine
    const drawEngineResult = executeDraw(mode, userEntries);

    // Calculate prizes
    const prizeCalc = calculatePrizeDistribution({
      totalPool: totalPrizePool,
      rolloverIn: rolloverAmount,
      tier1WinnersCount: drawEngineResult.tier1Matches.length,
      tier2WinnersCount: drawEngineResult.tier2Matches.length,
      tier3WinnersCount: drawEngineResult.tier3Matches.length,
    });

    return NextResponse.json({
      simulation: true,
      mode,
      winningNumbers: drawEngineResult.winningNumbers,
      tier1MatchesCount: drawEngineResult.tier1Matches.length,
      tier2MatchesCount: drawEngineResult.tier2Matches.length,
      tier3MatchesCount: drawEngineResult.tier3Matches.length,
      totalEntries: userEntries.length,
      prizes: prizeCalc,
      frequencyMap: drawEngineResult.frequencyMap,
    });
  } catch (err: any) {
    console.error('Simulation error:', err);
    return NextResponse.json({ error: err.message || 'Simulation failed' }, { status: 500 });
  }
}
