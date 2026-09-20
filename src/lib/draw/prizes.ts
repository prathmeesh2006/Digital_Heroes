/**
 * Digital Heroes — Prize Pool Calculator
 *
 * PRD [EXPLICIT]:
 * - 5-Number match: 40% of prize pool
 * - 4-Number match: 35% of prize pool
 * - 3-Number match: 25% of prize pool
 * - 5-match jackpot rolls over if unclaimed
 * - 4-match and 3-match do NOT roll over
 * - Prizes split equally among multiple winners in same tier
 *
 * PRD [AMBIGUOUS] (see TD-003):
 * - Prize pool contribution percentage is configurable (not specified in PRD)
 *
 * All monetary values are in minor units (pence/cents) using integer arithmetic.
 */

import { calculatePercentage, divideEqually } from '@/lib/utils/money';

// PRD-specified tier distribution percentages
export const TIER_PERCENTAGES = {
  tier1: 40, // 5-number match
  tier2: 35, // 4-number match
  tier3: 25, // 3-number match
} as const;

export interface PrizePoolInput {
  /** Active subscriber counts per plan, with plan price in minor units */
  planSubscribers: { priceMinorUnits: number; subscriberCount: number; interval: 'month' | 'year' }[];
  /** Prize pool contribution percentage (configurable, see TD-003) */
  contributionPct: number;
}

export interface TierPrizes {
  tier1: number; // 40% — minor units
  tier2: number; // 35%
  tier3: number; // 25%
}

export interface PrizeDistribution {
  totalPool: number;
  tiers: TierPrizes;
  /** Per-winner share for each tier, 0 if no winners */
  shares: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  /** Rollover amount (unclaimed tier1) */
  rolloverOut: number;
}

/**
 * Calculate the total monthly prize pool from active subscriptions.
 * For yearly subscribers, divides the annual price by 12 for monthly contribution.
 * Uses integer arithmetic throughout.
 */
export function calculatePrizePool(input: PrizePoolInput): number {
  let total = 0;
  for (const plan of input.planSubscribers) {
    // Calculate monthly equivalent price
    const monthlyPrice =
      plan.interval === 'year'
        ? Math.floor(plan.priceMinorUnits / 12)
        : plan.priceMinorUnits;
    // Apply contribution percentage
    const contribution = calculatePercentage(monthlyPrice, input.contributionPct);
    total += contribution * plan.subscriberCount;
  }
  return total;
}

/**
 * Split the prize pool into the three tiers per PRD: 40/35/25.
 */
export function calculateTierPrizes(totalPool: number): TierPrizes {
  return {
    tier1: calculatePercentage(totalPool, TIER_PERCENTAGES.tier1),
    tier2: calculatePercentage(totalPool, TIER_PERCENTAGES.tier2),
    tier3: calculatePercentage(totalPool, TIER_PERCENTAGES.tier3),
  };
}

/**
 * Calculate per-winner share for a tier.
 * Multiple winners split equally. Remainder (< winnerCount pence) stays with platform.
 */
export function calculateWinnerShare(tierPool: number, winnerCount: number): number {
  return divideEqually(tierPool, winnerCount);
}

/**
 * Apply jackpot rollover logic.
 *
 * PRD [EXPLICIT]:
 * - 5-number match jackpot carries forward if unclaimed
 * - 4-number and 3-number do NOT roll over
 *
 * TD-004: Unclaimed tier 2/3 funds are retained by the platform.
 */
export function applyJackpotRollover(
  tier1Pool: number,
  previousRollover: number,
  tier1Winners: number
): { effectiveTier1: number; rolloverOut: number } {
  const effectiveTier1 = tier1Pool + previousRollover;

  if (tier1Winners === 0) {
    // No winners — entire tier1 (including previous rollover) carries forward
    return { effectiveTier1: 0, rolloverOut: effectiveTier1 };
  }

  // Winners exist — distribute the full amount (no rollover)
  return { effectiveTier1, rolloverOut: 0 };
}

/**
 * Calculate the prize pool portion from subscriptions.
 */
export function calculatePrizePoolFromSubscriptions(
  subscribersCount: number,
  feePerSubscriber: number,
  percentage: number = 50
): number {
  const gross = subscribersCount * feePerSubscriber;
  return Math.round(gross * (percentage / 100));
}

/**
 * Calculate charitable deduction and net amount for prize payouts.
 */
export function calculateCharityDeduction(
  grossPrize: number,
  pledgePercentage: number
): { charityAmount: number; netAmount: number } {
  const percentage = Math.max(10, Math.min(100, pledgePercentage));
  const charityAmount = Math.round(grossPrize * (percentage / 100));
  const netAmount = grossPrize - charityAmount;
  return { charityAmount, netAmount };
}

/**
 * Calculate complete prize distribution for a draw.
 * Supports both object options and positional arguments.
 */
export function calculatePrizeDistribution(
  arg1:
    | number
    | {
        totalPool: number;
        rolloverIn?: number;
        previousRollover?: number;
        tier1WinnersCount?: number;
        tier2WinnersCount?: number;
        tier3WinnersCount?: number;
        winnerCounts?: { tier1: number; tier2: number; tier3: number };
      },
  arg2?: number,
  arg3?: { tier1: number; tier2: number; tier3: number }
) {
  let pool = 0;
  let rollover = 0;
  let w1 = 0;
  let w2 = 0;
  let w3 = 0;

  if (typeof arg1 === 'object') {
    pool = arg1.totalPool;
    rollover = arg1.rolloverIn ?? arg1.previousRollover ?? 0;
    w1 = arg1.tier1WinnersCount ?? arg1.winnerCounts?.tier1 ?? 0;
    w2 = arg1.tier2WinnersCount ?? arg1.winnerCounts?.tier2 ?? 0;
    w3 = arg1.tier3WinnersCount ?? arg1.winnerCounts?.tier3 ?? 0;
  } else {
    pool = arg1;
    rollover = arg2 ?? 0;
    w1 = arg3?.tier1 ?? 0;
    w2 = arg3?.tier2 ?? 0;
    w3 = arg3?.tier3 ?? 0;
  }

  const baseTiers = calculateTierPrizes(pool);
  const totalTier1Pool = baseTiers.tier1 + rollover;
  const tier1PerWinner = w1 > 0 ? Math.floor(totalTier1Pool / w1) : 0;
  const rolloverOut = w1 === 0 ? totalTier1Pool : 0;

  const tier2Total = baseTiers.tier2;
  const tier2PerWinner = w2 > 0 ? Math.floor(tier2Total / w2) : 0;

  const tier3Total = baseTiers.tier3;
  const tier3PerWinner = w3 > 0 ? Math.floor(tier3Total / w3) : 0;

  return {
    totalPool: pool,
    rolloverIn: rollover,
    tier1Total: totalTier1Pool,
    tier1PerWinner,
    tier2Total,
    tier2PerWinner,
    tier3Total,
    tier3PerWinner,
    rolloverOut,
    tiers: {
      tier1: totalTier1Pool,
      tier2: tier2Total,
      tier3: tier3Total,
    },
    shares: {
      tier1: tier1PerWinner,
      tier2: tier2PerWinner,
      tier3: tier3PerWinner,
    },
  };
}
