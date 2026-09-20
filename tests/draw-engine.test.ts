import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  generateRandomDraw,
  generateAlgorithmicDraw,
  executeDraw,
  mapScoresToNumbers,
  countMatches,
} from '../src/lib/draw/engine';
import type { DrawUserEntry } from '../src/types';

describe('Draw Engine — Number Generation & Matching', () => {
  test('generateRandomDraw produces 5 distinct numbers between 1 and 45', () => {
    for (let i = 0; i < 50; i++) {
      const numbers = generateRandomDraw();
      assert.strictEqual(numbers.length, 5, 'Should return exactly 5 numbers');

      // Range check
      for (const n of numbers) {
        assert.ok(n >= 1 && n <= 45, `Number ${n} must be between 1 and 45`);
      }

      // Distinctness check
      const unique = new Set(numbers);
      assert.strictEqual(unique.size, 5, 'All 5 numbers must be unique');

      // Sorting check (ascending)
      const sorted = [...numbers].sort((a, b) => a - b);
      assert.deepStrictEqual(numbers, sorted, 'Numbers should be sorted ascending');
    }
  });

  test('generateAlgorithmicDraw produces 5 distinct numbers weighted by score frequencies', () => {
    const entries: DrawUserEntry[] = [
      { userId: 'u1', numbers: [14, 21, 28, 35, 42] },
      { userId: 'u2', numbers: [14, 21, 28, 36, 43] },
      { userId: 'u3', numbers: [14, 21, 30, 37, 44] },
    ];

    const { numbers, frequencyMap } = generateAlgorithmicDraw(entries);

    assert.strictEqual(numbers.length, 5, 'Should return exactly 5 numbers');
    const unique = new Set(numbers);
    assert.strictEqual(unique.size, 5, 'All 5 numbers must be unique');

    // 14 and 21 appear in all 3 entries
    assert.strictEqual(frequencyMap[14], 3);
    assert.strictEqual(frequencyMap[21], 3);
  });

  test('mapScoresToNumbers preserves valid Stableford scores (1-45)', () => {
    const scores = [36, 40, 32, 28, 44];
    const drawNumbers = mapScoresToNumbers(scores);
    assert.deepStrictEqual(drawNumbers, [28, 32, 36, 40, 44], 'Should sort ascending');
  });

  test('countMatches accurately counts overlapping numbers', () => {
    const userNumbers = [7, 14, 21, 28, 35];
    const winningNumbers = [14, 21, 28, 40, 45];

    const matches = countMatches(userNumbers, winningNumbers);
    assert.strictEqual(matches, 3, 'Should have 3 matching numbers (14, 21, 28)');
  });

  test('executeDraw categorizes 5, 4, and 3 matches correctly', () => {
    const entries: DrawUserEntry[] = [
      { userId: 'u-jackpot', numbers: [10, 20, 30, 40, 45] },
      { userId: 'u-tier2', numbers: [10, 20, 30, 40, 1] },
      { userId: 'u-tier3', numbers: [10, 20, 30, 2, 3] },
      { userId: 'u-none', numbers: [1, 2, 3, 4, 5] },
    ];

    const result = executeDraw('random', entries, [10, 20, 30, 40, 45]);

    assert.strictEqual(result.tier1Matches.length, 1);
    assert.strictEqual(result.tier1Matches[0].userId, 'u-jackpot');

    assert.strictEqual(result.tier2Matches.length, 1);
    assert.strictEqual(result.tier2Matches[0].userId, 'u-tier2');

    assert.strictEqual(result.tier3Matches.length, 1);
    assert.strictEqual(result.tier3Matches[0].userId, 'u-tier3');
  });
});
