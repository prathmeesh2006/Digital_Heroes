'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/constants';
import { formatMoney } from '@/lib/utils/money';
import { useAuth } from '@/lib/auth/auth-context';
import type { Score } from '@/types';

export default function DashboardDrawsPage() {
  const { isSubscribed } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      try {
        const res = await fetch('/api/scores');
        if (res.ok) {
          const data = await res.json();
          setScores(data.scores || []);
        }
      } catch (err) {
        console.error('Failed to load draw scores:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScores();
  }, []);

  const userNumbers = scores.map((s) => s.score_value);
  const isFullEntry = userNumbers.length === 5;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Monthly <span className="gradient-text">Draw Participation</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your 5 active Stableford scores are automatically registered as your entry numbers for each monthly draw.
        </p>
      </div>

      {/* Current Draw Entry Card */}
      <Card className="glass-card border-primary/40 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500 text-white text-xs">Entries Open</Badge>
                <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-xs">
                  <Flame className="h-3 w-3 mr-1" /> £2,600 Rollover Jackpot
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">
                April 2026 Monthly Draw
              </CardTitle>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground">Draw Execution</div>
              <div className="text-base font-bold text-foreground">30 April 2026</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Numbers Entered */}
          <div className="p-6 rounded-2xl bg-card/60 border border-border/60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">
                Your Registered Draw Numbers (From Scores):
              </span>
              {isFullEntry ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Full 5-Number Entry
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> {userNumbers.length}/5 Numbers
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : userNumbers.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t recorded any scores yet.
                </p>
                <Button size="sm" className="mt-3 bg-primary text-primary-foreground" asChild>
                  <Link href={ROUTES.dashboardScores}>Add Scores Now</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {userNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground font-black text-2xl border border-primary/40 shadow-inner"
                  >
                    {num}
                  </div>
                ))}
                {Array.from({ length: 5 - userNumbers.length }).map((_, i) => (
                  <Link
                    key={`empty-${i}`}
                    href={ROUTES.dashboardScores}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border/80 text-muted-foreground hover:border-primary transition-colors text-sm font-medium"
                  >
                    + Add
                  </Link>
                ))}
              </div>
            )}

            {!isFullEntry && (
              <p className="text-xs text-amber-300/80 mt-4">
                Tip: Having all 5 numbers gives you maximum odds to qualify for the 5-match jackpot, 4-match tier, and 3-match tier!
              </p>
            )}
          </div>

          {/* Prize Pool Distribution Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-card/40 border border-border/40">
              <div className="text-xs text-muted-foreground uppercase font-semibold">5-Match Jackpot</div>
              <div className="text-2xl font-black text-amber-400 mt-1">40%</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Plus Rollover if unclaimed</div>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/40">
              <div className="text-xs text-muted-foreground uppercase font-semibold">4-Match Tier</div>
              <div className="text-2xl font-black text-primary mt-1">35%</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Split among 4-number matches</div>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/40">
              <div className="text-xs text-muted-foreground uppercase font-semibold">3-Match Tier</div>
              <div className="text-2xl font-black text-foreground mt-1">25%</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Split among 3-number matches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules & Transparency Notice */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Fair Play & Verification Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            • Winning numbers are generated by our cryptographic engine either via secure random selection or algorithmic frequency weighting.
          </p>
          <p>
            • To claim any monetary prize, winners must submit an unedited photo or PDF of their official golf scorecard confirming the scores and dates played.
          </p>
          <p>
            • Your chosen charity pledge (minimum 10%) is automatically separated and disbursed directly to the designated non-profit organization upon verification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
