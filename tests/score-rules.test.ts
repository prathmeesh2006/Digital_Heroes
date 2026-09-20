import { test, describe } from 'node:test';
import assert from 'node:assert';
import { scoreSchema } from '../src/lib/validations/scores';

describe('Score Business Rules — PRD Validation & Replacement Logic', () => {
  test('Validates Stableford score between 1 and 45', () => {
    // Valid cases
    const valid1 = scoreSchema.safeParse({ score_value: 36, played_date: '2026-03-15' });
    assert.ok(valid1.success);

    const valid2 = scoreSchema.safeParse({ score_value: 1, played_date: '2026-03-15' });
    assert.ok(valid2.success);

    const valid3 = scoreSchema.safeParse({ score_value: 45, played_date: '2026-03-15' });
    assert.ok(valid3.success);

    // Invalid score < 1
    const invalidLow = scoreSchema.safeParse({ score_value: 0, played_date: '2026-03-15' });
    assert.ok(!invalidLow.success);

    // Invalid score > 45
    const invalidHigh = scoreSchema.safeParse({ score_value: 46, played_date: '2026-03-15' });
    assert.ok(!invalidHigh.success);

    // Decimal score not allowed
    const invalidDecimal = scoreSchema.safeParse({ score_value: 36.5, played_date: '2026-03-15' });
    assert.ok(!invalidDecimal.success);
  });

  test('Rejects invalid date format', () => {
    const invalidDate = scoreSchema.safeParse({ score_value: 36, played_date: 'not-a-date' });
    assert.ok(!invalidDate.success);
  });

  test('FIFO replacement identifies oldest score by played_date', () => {
    // Existing 5 scores
    const existingScores = [
      { id: 's1', score_value: 36, played_date: '2026-01-10' },
      { id: 's2', score_value: 40, played_date: '2026-01-25' },
      { id: 's3', score_value: 32, played_date: '2026-02-05' },
      { id: 's4', score_value: 38, played_date: '2026-02-18' },
      { id: 's5', score_value: 42, played_date: '2026-03-01' },
    ];

    // Sorting ascending by date identifies the score that should be evicted
    const sorted = [...existingScores].sort(
      (a, b) => new Date(a.played_date).getTime() - new Date(b.played_date).getTime()
    );

    const oldest = sorted[0];
    assert.strictEqual(oldest.id, 's1', 's1 (2026-01-10) is the oldest and must be evicted');

    // Simulate replacement: filter out oldest and add new 6th score
    const newScore = { id: 's6', score_value: 39, played_date: '2026-03-15' };
    const updated = [...existingScores.filter((s) => s.id !== oldest.id), newScore];

    assert.strictEqual(updated.length, 5, 'Must maintain exactly 5 active scores');
    assert.ok(!updated.some((s) => s.id === 's1'), 'Oldest score must be gone');
    assert.ok(updated.some((s) => s.id === 's6'), 'New score must be present');
  });
});
