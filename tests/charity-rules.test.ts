import { test, describe } from 'node:test';
import assert from 'node:assert';
import { charityContributionSchema } from '../src/lib/validations/charity';

describe('Charity Business Rules — PRD Contribution Validation', () => {
  const validUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  test('Accepts valid charity percentages from 10% to 100%', () => {
    const p10 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 10,
    });
    assert.ok(p10.success, '10% minimum should be accepted');

    const p50 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 50,
    });
    assert.ok(p50.success, '50% should be accepted');

    const p100 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 100,
    });
    assert.ok(p100.success, '100% maximum should be accepted');
  });

  test('Rejects charity percentage below PRD 10% minimum', () => {
    const p9 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 9,
    });
    assert.ok(!p9.success, '9% should be rejected (below 10% minimum)');

    const p0 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 0,
    });
    assert.ok(!p0.success, '0% should be rejected');

    const pNegative = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: -10,
    });
    assert.ok(!pNegative.success, 'Negative percentages must be rejected');
  });

  test('Rejects charity percentage above 100%', () => {
    const p101 = charityContributionSchema.safeParse({
      charity_id: validUuid,
      charity_percentage: 101,
    });
    assert.ok(!p101.success, '101% should be rejected');
  });

  test('Requires valid UUID for charity_id', () => {
    const invalidId = charityContributionSchema.safeParse({
      charity_id: 'invalid-id',
      charity_percentage: 10,
    });
    assert.ok(!invalidId.success, 'Non-UUID charity ID should be rejected');
  });
});
