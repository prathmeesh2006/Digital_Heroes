'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Trophy,
  Heart,
  Wallet,
  Calendar,
  ArrowRight,
  Plus,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { ROUTES } from '@/config/constants';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/format';
import type { Score, CharityContribution, Charity } from '@/types';

export default function DashboardOverviewPage() {
  const { user, profile, isSubscribed } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [contribution, setContribution] = useState<(CharityContribution & { charity?: Charity }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scoresRes, charityRes] = await Promise.all([
          fetch('/api/scores'),
          fetch('/api/charity'),
        ]);

        if (scoresRes.ok) {
          const sData = await scoresRes.json();
          setScores(sData.scores || []);
        }

        if (charityRes.ok) {
          const cData = await charityRes.json();
          setContribution(cData.contribution || null);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const scoresCount = scores.length;
  const isFullyQualified = scoresCount === 5;
  const userDisplayName = profile?.full_name || user?.email?.split('@')[0] || 'Hero';

  return (
    <div className="space-y-8">
      {/* Top Welcome & Notification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{userDisplayName}</span>!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your golf scores, monitor upcoming monthly draws, and amplify your chosen cause.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href={ROUTES.dashboardScores}>
              <Plus className="h-4 w-4 mr-2" />
              Add Golf Score
            </Link>
          </Button>
        </div>
      </div>

      {/* Subscription Banner if not subscribed */}
      {!isSubscribed && (
        <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-amber-300">
                Inactive Subscription — Draw Entry On Hold
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Your scores will not be entered into the monthly draw until you activate your Hero Pass.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-amber-500 text-black font-semibold hover:bg-amber-400 shrink-0" asChild>
            <Link href={ROUTES.dashboardSettings}>Activate Pass Now</Link>
          </Button>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Scores */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Scores Retained</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">
              {scoresCount} <span className="text-xs font-normal text-muted-foreground">/ 5 active</span>
            </div>
            <div className="mt-2 flex items-center text-xs">
              {isFullyQualified ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Full Set (5 Numbers)
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Add {5 - scoresCount} more for full entry
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Monthly Draw */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Next Draw Date</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">30 Apr 2026</div>
            <div className="mt-2 flex items-center text-xs text-amber-400 gap-1">
              <Flame className="h-3 w-3" /> Rollover Jackpot Active
            </div>
          </CardContent>
        </Card>

        {/* Charity Allocation */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Charity Pledge</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">
              {contribution?.charity_percentage || 10}%
            </div>
            <div className="mt-2 text-xs text-muted-foreground truncate">
              {contribution?.charity?.name || 'Golf for All Foundation'}
            </div>
          </CardContent>
        </Card>

        {/* Total Winnings */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">My Winnings</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{formatMoney(0)}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              <Link href={ROUTES.dashboardWinnings} className="text-primary hover:underline">
                View claim history →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Draw Numbers from Scores */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold">Your Active Draw Numbers</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assigned directly from your 5 most recently recorded Stableford scores (FIFO rule enforced).
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.dashboardScores}>
              Manage Scores <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pt-4">
          {scores.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border/60 rounded-2xl">
              <Target className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h4 className="text-sm font-semibold">No scores recorded yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                Record your latest Stableford round (1–45) to assign your draw numbers for the upcoming monthly draw.
              </p>
              <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                <Link href={ROUTES.dashboardScores}>Enter First Score</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className="p-4 rounded-2xl bg-card/60 border border-border/60 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors"
                >
                  <span className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                    Slot {index + 1}
                  </span>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground font-black text-2xl flex items-center justify-center border border-primary/30 shadow-inner group-hover:scale-105 transition-transform">
                    {score.score_value}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(score.played_date)}
                  </span>
                </div>
              ))}

              {/* Fill remaining slots up to 5 */}
              {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, i) => (
                <Link
                  key={`empty-${i}`}
                  href={ROUTES.dashboardScores}
                  className="p-4 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors bg-card/20"
                >
                  <span className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                    Slot {scores.length + i + 1}
                  </span>
                  <div className="h-14 w-14 rounded-2xl bg-muted/40 text-muted-foreground/50 font-bold text-xl flex items-center justify-center border border-dashed border-border">
                    +
                  </div>
                  <span className="text-xs text-primary mt-2 font-medium">Add Score</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Section: Charity Impact & Draw Mechanics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charity Allocation Box */}
        <Card className="glass-card border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-400" /> My Charity Pledge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {contribution?.charity?.name || 'Golf for All Foundation'}
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {contribution?.charity_percentage || 10}% Pledge
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {contribution?.charity?.short_description ||
                  'Accessible golf programs for underprivileged youth and adaptive players.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card/40 border border-border/40 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Requirement:</span>
                <span className="font-semibold text-foreground">10% (Enforced)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Allocation:</span>
                <span className="font-bold text-emerald-400">
                  {contribution?.charity_percentage || 10}% of Winnings
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={ROUTES.dashboardCharity}>
                Change Charity or Adjust Percentage
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Draw Countdown & Prize Summary */}
        <Card className="glass-card border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" /> Upcoming April Draw
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-card/40 border border-border/40">
                <div className="text-[10px] text-muted-foreground">5 Matches</div>
                <div className="text-sm font-black text-amber-400 mt-0.5">40% Pool</div>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-border/40">
                <div className="text-[10px] text-muted-foreground">4 Matches</div>
                <div className="text-sm font-black text-primary mt-0.5">35% Pool</div>
              </div>
              <div className="p-2.5 rounded-xl bg-card/40 border border-border/40">
                <div className="text-[10px] text-muted-foreground">3 Matches</div>
                <div className="text-sm font-black text-foreground mt-0.5">25% Pool</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Draw numbers are randomly or algorithmically generated on the final day of each calendar month. Winners must upload scorecard proof for admin verification prior to bank payout.
            </p>

            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={ROUTES.dashboardDraws}>View Draw Details & History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
