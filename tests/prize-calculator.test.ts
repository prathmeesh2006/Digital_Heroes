import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculatePrizeDistribution,
  calculatePrizePoolFromSubscriptions,
  calculateCharityDeduction,
} from '../src/lib/draw/prizes';

describe('Prize Pool Calculator — Financial Tiers & Rollover', () => {
  test('calculatePrizePoolFromSubscriptions calculates fixed percentage in minor units', () => {
    // 100 subscribers at £10.00 each = £1,000 (100,000 minor units).
    // With 50% contribution rate, prize pool should be £500 (50,000 minor units).
    const pool = calculatePrizePoolFromSubscriptions(100, 1000, 50);
    assert.strictEqual(pool, 50000);
  });

  test('calculatePrizeDistribution applies PRD 40/35/25 percentages', () => {
    // Total pool: £1,000.00 = 100,000 minor units. Rollover In: £0
    const distribution = calculatePrizeDistribution({
      totalPool: 100000,
      rolloverIn: 0,
      tier1WinnersCount: 1,
      tier2WinnersCount: 1,
      tier3WinnersCount: 1,
    });

    assert.strictEqual(distribution.tier1Total, 40000, 'Tier 1 must be 40%');
    assert.strictEqual(distribution.tier2Total, 35000, 'Tier 2 must be 35%');
    assert.strictEqual(distribution.tier3Total, 25000, 'Tier 3 must be 25%');
    assert.strictEqual(distribution.rolloverOut, 0, 'No rollover when Tier 1 is won');
  });

  test('Jackpot rolls over when Tier 1 has 0 winners', () => {
    // Pool: £1,000.00 (100,000 minor units), Rollover In: £500.00 (50,000 minor units)
    // Tier 1 pool = 40,000 + 50,000 = 90,000.
    const distribution = calculatePrizeDistribution({
      totalPool: 100000,
      rolloverIn: 50000,
      tier1WinnersCount: 0, // Unclaimed
      tier2WinnersCount: 2,
      tier3WinnersCount: 5,
    });

    assert.strictEqual(distribution.tier1Total, 90000);
    assert.strictEqual(distribution.tier1PerWinner, 0);
    assert.strictEqual(distribution.rolloverOut, 90000, 'Full Tier 1 pool must roll over to next month');

    // Tier 2 split: 35,000 / 2 = 17,500
    assert.strictEqual(distribution.tier2PerWinner, 17500);

    // Tier 3 split: 25,000 / 5 = 5,000
    assert.strictEqual(distribution.tier3PerWinner, 5000);
  });

  test('Multiple winners split tier prizes equally', () => {
    const distribution = calculatePrizeDistribution({
      totalPool: 100000,
      rolloverIn: 0,
      tier1WinnersCount: 2, // 40,000 / 2 = 20,000 each
      tier2WinnersCount: 5, // 35,000 / 5 = 7,000 each
      tier3WinnersCount: 10, // 25,000 / 10 = 2,500 each
    });

    assert.strictEqual(distribution.tier1PerWinner, 20000);
    assert.strictEqual(distribution.tier2PerWinner, 7000);
    assert.strictEqual(distribution.tier3PerWinner, 2500);
  });

  test('calculateCharityDeduction enforces 10% minimum and exact rounding', () => {
    // Gross: £100.00 (10,000 units), 10% pledge
    const res1 = calculateCharityDeduction(10000, 10);
    assert.strictEqual(res1.charityAmount, 1000);
    assert.strictEqual(res1.netAmount, 9000);

    // Gross: £100.00 (10,000 units), 50% pledge
    const res2 = calculateCharityDeduction(10000, 50);
    assert.strictEqual(res2.charityAmount, 5000);
    assert.strictEqual(res2.netAmount, 5000);

    // Attempt pledge below 10% defaults to 10%
    const res3 = calculateCharityDeduction(10000, 5);
    assert.strictEqual(res3.charityAmount, 1000, 'Should enforce minimum 10%');
  });
});
