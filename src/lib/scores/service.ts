/**
 * Digital Heroes — Score Service
 *
 * Server-side score management with PRD business rule enforcement.
 *
 * PRD rules (all EXPLICIT):
 * - Score range: 1–45 (Stableford)
 * - Each score must include a date
 * - Only one score per date
 * - Only the latest 5 scores are retained
 * - A new score replaces the oldest stored score automatically
 * - Scores display in reverse chronological order
 */

import { createClient } from '@/lib/supabase/server';
import { scoreSchema, type ScoreInput } from '@/lib/validations/scores';
import type { Score } from '@/types';

const MAX_SCORES = 5;

export interface ScoreServiceResult<T = unknown> {
  data: T | null;
  error: string | null;
}

/**
 * Get all scores for a user, sorted by played_date descending (newest first).
 * PRD [EXPLICIT]: "Scores display in reverse chronological order"
 */
export async function getUserScores(userId: string): Promise<ScoreServiceResult<Score[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .order('played_date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Score[], error: null };
}

/**
 * Add a new score for a user.
 *
 * Enforces server-side:
 * 1. Validates score range (1–45) and date
 * 2. Checks for duplicate date
 * 3. Enforces 5-score limit: if user has 5 scores, removes oldest by played_date
 */
export async function addScore(
  userId: string,
  input: ScoreInput
): Promise<ScoreServiceResult<Score>> {
  // Server-side validation
  const validation = scoreSchema.safeParse(input);
  if (!validation.success) {
    return { data: null, error: validation.error.issues[0]?.message || 'Invalid score data' };
  }

  const supabase = await createClient();

  // Check for duplicate date
  const { data: existing } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', userId)
    .eq('played_date', input.played_date)
    .maybeSingle();

  if (existing) {
    return {
      data: null,
      error: 'A score already exists for this date. Edit or delete the existing score.',
    };
  }

  // Get current score count
  const { data: currentScores, error: countError } = await supabase
    .from('scores')
    .select('id, played_date')
    .eq('user_id', userId)
    .order('played_date', { ascending: true });

  if (countError) {
    return { data: null, error: countError.message };
  }

  // PRD [EXPLICIT]: "Only the latest 5 scores are retained"
  // If already at 5, remove the oldest (by played_date)
  if (currentScores && currentScores.length >= MAX_SCORES) {
    const oldestScore = currentScores[0]; // Already sorted ascending by date
    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .eq('id', oldestScore.id)
      .eq('user_id', userId);

    if (deleteError) {
      return { data: null, error: `Failed to remove oldest score: ${deleteError.message}` };
    }
  }

  // Insert the new score
  const { data: newScore, error: insertError } = await supabase
    .from('scores')
    .insert({
      user_id: userId,
      score_value: input.score_value,
      played_date: input.played_date,
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return { data: null, error: 'A score already exists for this date.' };
    }
    return { data: null, error: insertError.message };
  }

  return { data: newScore as Score, error: null };
}

/**
 * Update an existing score.
 * User can only update their own scores (enforced by RLS + userId check).
 */
export async function updateScore(
  userId: string,
  scoreId: string,
  input: Partial<ScoreInput>
): Promise<ScoreServiceResult<Score>> {
  // Validate provided fields
  if (input.score_value !== undefined) {
    if (input.score_value < 1 || input.score_value > 45) {
      return { data: null, error: 'Score must be between 1 and 45.' };
    }
  }

  if (input.played_date !== undefined) {
    const played = new Date(input.played_date);
    if (isNaN(played.getTime())) {
      return { data: null, error: 'Invalid date format.' };
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (played > today) {
      return { data: null, error: 'Score date cannot be in the future.' };
    }
  }

  const supabase = await createClient();

  // If changing date, check for duplicate
  if (input.played_date) {
    const { data: existing } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .eq('played_date', input.played_date)
      .neq('id', scoreId)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'A score already exists for this date.' };
    }
  }

  const updateData: Record<string, unknown> = {};
  if (input.score_value !== undefined) updateData.score_value = input.score_value;
  if (input.played_date !== undefined) updateData.played_date = input.played_date;

  const { data, error } = await supabase
    .from('scores')
    .update(updateData)
    .eq('id', scoreId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { data: null, error: 'A score already exists for this date.' };
    }
    return { data: null, error: error.message };
  }

  return { data: data as Score, error: null };
}

/**
 * Delete a score.
 * User can only delete their own scores (enforced by RLS + userId check).
 */
export async function deleteScore(
  userId: string,
  scoreId: string
): Promise<ScoreServiceResult<{ success: boolean }>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { success: true }, error: null };
}
