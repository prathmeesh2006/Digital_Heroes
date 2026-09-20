/**
 * Digital Heroes — Draw Engine
 *
 * IMPORTANT: The score-as-numbers model (where a user's 5 scores serve as
 * their draw numbers) is an ASSUMPTION, not an explicit PRD requirement.
 * See docs/technical-decisions.md TD-001.
 *
 * The engine is modular: getUserDrawNumbers() can be replaced to change
 * the mapping without affecting the rest of the draw system.
 */

import { Score } from '@/types';

// ============================================
// Number Generation
// ============================================

/**
 * Maps a user's scores to their draw numbers.
 * ASSUMPTION (TD-001): User's 5 most recent score values = their 5 draw numbers.
 * This function is isolated so the mapping rule can be changed later.
 */
export function getUserDrawNumbers(scores: Score[]): number[] {
  // Sort by played_date descending and take latest 5
  const sorted = [...scores]
    .sort((a, b) => new Date(b.played_date).getTime() - new Date(a.played_date).getTime())
    .slice(0, 5);
  return sorted.map((s) => s.score_value);
}

/**
 * Generate 5 unique winning numbers using cryptographically secure randomness.
 * Range: 1–45 (matching Stableford score range).
 */
export function generateRandomDraw(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    // Use crypto for secure random generation
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const num = (array[0] % 45) + 1; // 1–45
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Generate 5 unique winning numbers weighted by score frequency.
 * PRD [EXPLICIT]: "Algorithmic — weighted by score frequency"
 *
 * Algorithm:
 * 1. Count frequency of each value 1–45 across all eligible user scores
 * 2. Normalize to probability weights
 * 3. Select 5 unique numbers using weighted random selection (without replacement)
 *
 * Higher-frequency scores have proportionally higher chance of being drawn,
 * which naturally creates more winners.
 */
export function generateWeightedDraw(allScoreValues: number[]): number[] {
  // Build frequency map
  const frequencies = new Map<number, number>();
  for (let i = 1; i <= 45; i++) {
    frequencies.set(i, 0);
  }
  for (const value of allScoreValues) {
    frequencies.set(value, (frequencies.get(value) || 0) + 1);
  }

  // If no scores exist, fall back to random
  const totalFrequency = allScoreValues.length;
  if (totalFrequency === 0) {
    return generateRandomDraw();
  }

  const numbers: number[] = [];
  const remaining = new Map(frequencies);

  for (let i = 0; i < 5; i++) {
    const totalWeight = Array.from(remaining.values()).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) {
      // Fallback: if all remaining weights are 0, pick randomly from remaining keys
      const keys = Array.from(remaining.keys());
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const idx = array[0] % keys.length;
      numbers.push(keys[idx]);
      remaining.delete(keys[idx]);
      continue;
    }

    // Weighted random selection
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    let random = (array[0] / 0xffffffff) * totalWeight;

    for (const [num, weight] of remaining) {
      random -= weight;
      if (random <= 0) {
        numbers.push(num);
        remaining.delete(num); // Without replacement
        break;
      }
    }
  }

  return numbers.sort((a, b) => a - b);
}

// ============================================
// Match Calculation
// ============================================

/**
 * Calculate how many of the user's numbers match the winning numbers.
 * Comparison is set-based (order-independent, duplicates counted once).
 */
export function calculateMatches(
  userNumbers: number[],
  winningNumbers: number[]
): { matchCount: number; matchedNumbers: number[] } {
  const winningSet = new Set(winningNumbers);
  // Use a Set for user numbers to handle duplicate scores
  const uniqueUserNumbers = [...new Set(userNumbers)];
  const matchedNumbers = uniqueUserNumbers.filter((n) => winningSet.has(n));
  return {
    matchCount: matchedNumbers.length,
    matchedNumbers,
  };
}

/**
 * Classify a match count into a prize tier.
 * Returns the tier (5, 4, or 3) or null if no prize.
 */
export function getMatchTier(matchCount: number): 5 | 4 | 3 | null {
  if (matchCount >= 5) return 5;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 3;
  return null;
}

// ============================================
// Score Frequency Analysis (for weighted draw)
// ============================================

/**
 * Build a frequency map of all score values across eligible users.
 * Used for the algorithmic/weighted draw mode.
 */
export function buildScoreFrequencyMap(allScores: Score[]): Map<number, number> {
  const frequencies = new Map<number, number>();
  for (let i = 1; i <= 45; i++) {
    frequencies.set(i, 0);
  }
  for (const score of allScores) {
    frequencies.set(score.score_value, (frequencies.get(score.score_value) || 0) + 1);
  }
  return frequencies;
}

/**
 * Helper to count matching numbers between user numbers and winning numbers.
 */
export function countMatches(userNumbers: number[], winningNumbers: number[]): number {
  return calculateMatches(userNumbers, winningNumbers).matchCount;
}

/**
 * Maps raw scores to draw numbers (alias for backward compatibility).
 */
export function mapScoresToNumbers(scores: number[]): number[] {
  return [...scores].sort((a, b) => a - b).slice(0, 5);
}

/**
 * Generate algorithmic draw numbers weighted by entries (alias for generateWeightedDraw).
 */
export function generateAlgorithmicDraw(entries: { userId: string; numbers: number[] }[]): {
  numbers: number[];
  frequencyMap: Record<number, number>;
} {
  const allNumbers = entries.flatMap((e) => e.numbers);
  const frequencies: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) {
    frequencies[i] = 0;
  }
  for (const n of allNumbers) {
    frequencies[n] = (frequencies[n] || 0) + 1;
  }

  const winningNumbers = generateWeightedDraw(allNumbers);
  return { numbers: winningNumbers, frequencyMap: frequencies };
}

/**
 * Executes a full draw evaluation across all entries.
 */
export function executeDraw(
  mode: 'random' | 'algorithmic',
  entries: { userId: string; numbers: number[] }[],
  overrideWinningNumbers?: number[]
) {
  let winningNumbers: number[];
  let frequencyMap: Record<number, number> | undefined;

  if (overrideWinningNumbers && overrideWinningNumbers.length === 5) {
    winningNumbers = overrideWinningNumbers;
  } else if (mode === 'algorithmic') {
    const res = generateAlgorithmicDraw(entries);
    winningNumbers = res.numbers;
    frequencyMap = res.frequencyMap;
  } else {
    winningNumbers = generateRandomDraw();
  }

  const tier1Matches: { userId: string; numbers: number[]; matched: number[] }[] = [];
  const tier2Matches: { userId: string; numbers: number[]; matched: number[] }[] = [];
  const tier3Matches: { userId: string; numbers: number[]; matched: number[] }[] = [];

  for (const entry of entries) {
    const { matchCount, matchedNumbers } = calculateMatches(entry.numbers, winningNumbers);
    if (matchCount >= 5) {
      tier1Matches.push({ userId: entry.userId, numbers: entry.numbers, matched: matchedNumbers });
    } else if (matchCount === 4) {
      tier2Matches.push({ userId: entry.userId, numbers: entry.numbers, matched: matchedNumbers });
    } else if (matchCount === 3) {
      tier3Matches.push({ userId: entry.userId, numbers: entry.numbers, matched: matchedNumbers });
    }
  }

  return {
    winningNumbers,
    tier1Matches,
    tier2Matches,
    tier3Matches,
    frequencyMap,
  };
}
