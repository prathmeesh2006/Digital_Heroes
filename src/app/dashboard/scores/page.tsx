'use client';

import { useEffect, useState } from 'react';
import {
  Target,
  Calendar,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/format';
import type { Score } from '@/types';

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [scoreValue, setScoreValue] = useState<string>('36');
  const [playedDate, setPlayedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  async function loadScores() {
    try {
      setLoading(true);
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores || []);
      }
    } catch (err) {
      toast.error('Failed to load scores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScores();
  }, []);

  async function handleAddScore(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(scoreValue, 10);

    if (isNaN(val) || val < 1 || val > 45) {
      toast.error('Score must be between 1 and 45 (Stableford format).');
      return;
    }

    if (!playedDate) {
      toast.error('Please select a valid date for this round.');
      return;
    }

    // Check future date
    const selectedDate = new Date(playedDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      toast.error('Score date cannot be in the future.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_value: val,
          played_date: playedDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to record score');
        return;
      }

      toast.success(
        scores.length >= 5
          ? 'Score added! Oldest score was replaced automatically per PRD rules.'
          : 'Score recorded successfully!'
      );

      // Reload
      await loadScores();
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteScore(id: string) {
    if (!confirm('Are you sure you want to remove this score?')) return;

    try {
      const res = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Failed to delete score');
        return;
      }

      toast.success('Score deleted');
      await loadScores();
    } catch {
      toast.error('Failed to delete score');
    }
  }

  // Calculate statistics
  const scoreValues = scores.map((s) => s.score_value);
  const avgScore = scoreValues.length
    ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
    : '0';
  const highScore = scoreValues.length ? Math.max(...scoreValues) : 0;
  const lowScore = scoreValues.length ? Math.min(...scoreValues) : 0;

  // Identify the oldest score that will be replaced on next addition
  const oldestScore =
    scores.length >= 5
      ? [...scores].sort((a, b) => new Date(a.played_date).getTime() - new Date(b.played_date).getTime())[0]
      : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Stableford <span className="gradient-text">Score Management</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Record your legitimate golf rounds (1–45 pts). Your 5 active scores serve as your numbers in the monthly prize draw.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Active Scores</span>
            <div className="text-2xl font-bold mt-1 text-foreground">
              {scores.length} <span className="text-xs text-muted-foreground font-normal">/ 5 max</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Average Score</span>
            <div className="text-2xl font-bold mt-1 text-primary">{avgScore} <span className="text-xs font-normal">pts</span></div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Highest Round</span>
            <div className="text-2xl font-bold mt-1 text-emerald-400">{highScore} <span className="text-xs font-normal">pts</span></div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Lowest Round</span>
            <div className="text-2xl font-bold mt-1 text-foreground">{lowScore} <span className="text-xs font-normal">pts</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Add Score Form Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Record New Round
          </CardTitle>
          <CardDescription>
            Enter your official 18-hole Stableford points and the date played.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAddScore} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scoreValue">
                  Stableford Score (1 – 45)
                </Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="scoreValue"
                    type="number"
                    min={1}
                    max={45}
                    placeholder="e.g. 36"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Standard Stableford golf format (1 minimum, 45 maximum).
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="playedDate">Date Played</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="playedDate"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={playedDate}
                    onChange={(e) => setPlayedDate(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Only one score allowed per calendar date. Future dates blocked.
                </span>
              </div>
            </div>

            {/* FIFO Replacement Notice */}
            {oldestScore && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-amber-200/90">
                  <strong>5-Score Limit Active (PRD FIFO Rule):</strong> Adding this new round will automatically replace your oldest score from <strong>{formatDate(oldestScore.played_date)} ({oldestScore.score_value} pts)</strong>.
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Recording Round...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" /> Record Score
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Scores List */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Active Stored Scores</CardTitle>
            <CardDescription>
              Sorted in reverse chronological order (newest first). These 5 numbers represent your draw entry.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {scores.length} / 5 Slots Filled
          </Badge>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl">
              <Target className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h4 className="text-sm font-semibold">No scores recorded yet</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your latest Stableford round using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground font-black text-xl border border-primary/30 shadow-inner">
                      {score.score_value}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {score.score_value} Stableford Points
                        </span>
                        {index === 0 && (
                          <Badge className="bg-primary/20 text-primary border-none text-[10px] px-1.5 py-0.5">
                            Latest
                          </Badge>
                        )}
                        {oldestScore && score.id === oldestScore.id && (
                          <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0.5">
                            Oldest (Next to replace)
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Played on {formatDate(score.played_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteScore(score.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete score</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
