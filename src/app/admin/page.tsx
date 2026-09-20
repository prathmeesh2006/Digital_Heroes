'use client';

import Link from 'next/link';
import {
  Users,
  CreditCard,
  Trophy,
  Heart,
  ShieldCheck,
  Dices,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/constants';
import { formatMoney } from '@/lib/utils/money';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform <span className="gradient-text">Operations Center</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time subscriber metrics, prize allocations, draw controls, and verification queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" asChild>
            <Link href={ROUTES.adminDraws}>
              <Dices className="h-4 w-4 mr-2" />
              Open Draw Engine
            </Link>
          </Button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Subscribers</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2">1,248</div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +14.2% this month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Monthly Revenue (MRR)</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2">
              {formatMoney(1248000)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Fixed % reserved for prizes</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Prize Pool Reserve</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-amber-400">
              {formatMoney(780000)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Includes £2,600 Rollover</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Charity Disbursed</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-emerald-400">
              {formatMoney(9255000)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Across 5 accredited partners</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Pending Verifications</span>
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2">1</div>
            <div className="mt-2 text-xs text-muted-foreground">
              <Link href={ROUTES.adminWinners} className="text-primary hover:underline">
                Review proofs in queue →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Draw Engine Status</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-emerald-400">Ready</div>
            <div className="mt-2 text-xs text-muted-foreground">CSPRNG & Weighted modes</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Dices className="h-5 w-5 text-emerald-400" /> Upcoming April Draw
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scheduled for <strong>30 April 2026</strong>. 1,248 active entries currently logged. You can dry-run simulations in either Random or Frequency-Weighted mode before execution.
            </p>

            <div className="flex gap-3">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" asChild>
                <Link href={ROUTES.adminDraws}>Run Simulation</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={ROUTES.adminDraws}>Configure Execution</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" /> Winner Verification Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              1 winner has uploaded a golf scorecard proof awaiting admin verification for the March 2026 Draw (Tier 3 match - £116.07).
            </p>

            <Button size="sm" className="bg-primary text-primary-foreground" asChild>
              <Link href={ROUTES.adminWinners}>Open Verification Queue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
