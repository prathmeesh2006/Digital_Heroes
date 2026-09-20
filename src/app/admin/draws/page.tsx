'use client';

import { useState } from 'react';
import {
  Dices,
  Play,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Trophy,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils/money';
import type { DrawMode } from '@/types';

interface SimulationResult {
  mode: DrawMode;
  winningNumbers: number[];
  tier1MatchesCount: number;
  tier2MatchesCount: number;
  tier3MatchesCount: number;
  totalEntries: number;
  prizes: {
    totalPool: number;
    rolloverIn: number;
    tier1Total: number;
    tier1PerWinner: number;
    tier2Total: number;
    tier2PerWinner: number;
    tier3Total: number;
    tier3PerWinner: number;
    rolloverOut: number;
  };
}

export default function AdminDrawsPage() {
  const [selectedMode, setSelectedMode] = useState<DrawMode>('random');
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [executing, setExecuting] = useState(false);

  async function handleRunSimulation() {
    setSimulating(true);
    try {
      const res = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          totalPrizePool: 500000,
          rolloverAmount: 260000,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Simulation failed');
        return;
      }

      setSimulation(data);
      toast.success('Simulation generated successfully!');
    } catch {
      toast.error('Failed to run simulation.');
    } finally {
      setSimulating(false);
    }
  }

  async function handleExecuteOfficialDraw() {
    if (
      !confirm(
        'Are you sure you want to execute and publish the official draw? This will calculate official winners, record results in the database, and trigger prize claims.'
      )
    ) {
      return;
    }

    setExecuting(true);
    try {
      const res = await fetch('/api/admin/draws/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          totalPrizePool: 500000,
          rolloverAmount: 260000,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to execute draw');
        return;
      }

      toast.success('Official draw successfully executed and published!');
      // Update simulation view with executed numbers
      setSimulation(data);
    } catch {
      toast.error('Execution error.');
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Draw Engine & <span className="gradient-text">Execution Controls</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure cryptographic draw modes, run test simulations, and publish official monthly draws.
        </p>
      </div>

      {/* Control Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Dices className="h-5 w-5 text-emerald-400" /> Draw Algorithm Configuration
          </CardTitle>
          <CardDescription>
            Choose between CSPRNG Random mode or Community Frequency-Weighted Algorithmic mode.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedMode('random')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedMode === 'random'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                  : 'border-border/50 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base">CSPRNG Random Draw</span>
                {selectedMode === 'random' && (
                  <Badge className="bg-emerald-500 text-white text-xs">Active Mode</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cryptographically secure pseudo-random number generator (System CSPRNG). Every number between 1 and 45 has equal probability.
              </p>
            </div>

            <div
              onClick={() => setSelectedMode('algorithmic')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedMode === 'algorithmic'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                  : 'border-border/50 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base">Frequency-Weighted Algorithmic</span>
                {selectedMode === 'algorithmic' && (
                  <Badge className="bg-emerald-500 text-white text-xs">Active Mode</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Weights number selection dynamically by the occurrence frequency of Stableford scores submitted by all subscribers in the draw period.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              Parameters: <strong>£5,000 Total Pool</strong> | <strong>£2,600 Rollover In</strong>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                disabled={simulating || executing}
                onClick={handleRunSimulation}
              >
                {simulating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Simulating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 text-primary" /> Run Dry-Run Simulation
                  </>
                )}
              </Button>

              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                disabled={simulating || executing}
                onClick={handleExecuteOfficialDraw}
              >
                {executing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Executing Official Draw...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Execute & Publish Draw
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation / Execution Results Box */}
      {simulation && (
        <Card className="glass-card border-primary/40 bg-gradient-to-b from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" /> Draw Results Output
                </CardTitle>
                <CardDescription>
                  Mode: <strong className="capitalize">{simulation.mode}</strong> | Entries Evaluated:{' '}
                  <strong>{simulation.totalEntries}</strong>
                </CardDescription>
              </div>

              {simulation.prizes.rolloverOut > 0 && (
                <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                  <Flame className="h-3 w-3 mr-1" /> £{simulation.prizes.rolloverOut / 100} Rolled Over
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 5 Winning Number Balls */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card/60 border border-border/50">
              <span className="text-xs text-muted-foreground uppercase font-mono mb-3">
                Winning Numbers Drawn
              </span>
              <div className="flex items-center gap-3">
                {simulation.winningNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-foreground font-black text-2xl sm:text-3xl border border-primary/50 shadow-lg animate-in zoom-in-50"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Prize Tier Match Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card/40 border border-border/40 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  5-Number Match (40%)
                </div>
                <div className="text-2xl font-bold mt-1 text-amber-400">
                  {simulation.tier1MatchesCount} Winners
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {simulation.tier1MatchesCount > 0
                    ? `${formatMoney(simulation.prizes.tier1PerWinner)} each`
                    : 'Unclaimed → Rolled Over'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/40 border border-border/40 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  4-Number Match (35%)
                </div>
                <div className="text-2xl font-bold mt-1 text-primary">
                  {simulation.tier2MatchesCount} Winners
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {simulation.tier2MatchesCount > 0
                    ? `${formatMoney(simulation.prizes.tier2PerWinner)} each`
                    : 'No matches'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/40 border border-border/40 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  3-Number Match (25%)
                </div>
                <div className="text-2xl font-bold mt-1 text-foreground">
                  {simulation.tier3MatchesCount} Winners
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {simulation.tier3MatchesCount > 0
                    ? `${formatMoney(simulation.prizes.tier3PerWinner)} each`
                    : 'No matches'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
