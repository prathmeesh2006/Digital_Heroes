'use client';

import { useEffect, useState } from 'react';
import { Heart, CheckCircle2, ShieldCheck, Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FALLBACK_CHARITIES } from '@/config/charities';
import { formatMoney } from '@/lib/utils/money';
import type { Charity, CharityContribution } from '@/types';

export default function DashboardCharityPage() {
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    FALLBACK_CHARITIES[0].id
  );
  const [percentage, setPercentage] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCurrentContribution() {
      try {
        const res = await fetch('/api/charity');
        if (res.ok) {
          const data = await res.json();
          if (data.contribution) {
            setSelectedCharityId(data.contribution.charity_id);
            setPercentage(data.contribution.charity_percentage || 10);
          }
        }
      } catch (err) {
        console.error('Failed to load charity contribution:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentContribution();
  }, []);

  async function handleSaveAllocation() {
    if (percentage < 10) {
      toast.error('Minimum charity contribution is 10% per PRD rules.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charity_id: selectedCharityId,
          charity_percentage: percentage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to save charity choice');
        return;
      }

      toast.success('Charity allocation saved successfully!');
    } catch {
      toast.error('Failed to save charity allocation.');
    } finally {
      setSaving(false);
    }
  }

  const selectedCharity =
    FALLBACK_CHARITIES.find((c) => c.id === selectedCharityId) ||
    FALLBACK_CHARITIES[0];

  // Example hypothetical £5,000 jackpot calculation
  const samplePrize = 500000; // £5,000 in minor units
  const charityCut = Math.round(samplePrize * (percentage / 100));
  const playerCut = samplePrize - charityCut;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Charity <span className="gradient-text">Pledge & Impact</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every Digital Heroes member pledges a minimum of 10% (up to 100%) of any draw winnings directly to an accredited non-profit.
        </p>
      </div>

      {/* Interactive Percentage Slider & Simulation */}
      <Card className="glass-card border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-400" /> Set Your Donation Percentage
          </CardTitle>
          <CardDescription>
            Enforced PRD rule: minimum 10% must be donated to your chosen charity.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Charity Give-Back Percentage
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {percentage}%
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>10% (Min Required)</span>
              <span>25%</span>
              <span>50% (Hero Split)</span>
              <span>75%</span>
              <span>100% (Pure Philanthropy)</span>
            </div>
          </div>

          {/* Real-time Prize Simulation Card */}
          <div className="p-5 rounded-2xl bg-card/60 border border-border/50 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Hypothetical £5,000 Jackpot Win Breakdown
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-muted-foreground">Donated to {selectedCharity.name}</div>
                <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                  {formatMoney(charityCut)}
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-1">
                  ({percentage}% direct tax-credited charitable grant)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="text-xs text-muted-foreground">Net Paid Directly to You</div>
                <div className="text-2xl font-bold text-primary mt-0.5">
                  {formatMoney(playerCut)}
                </div>
                <div className="text-[11px] text-primary/80 mt-1">
                  ({100 - percentage}% transferred via verified bank payout)
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveAllocation}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving Allocation...
                </>
              ) : (
                'Save Pledge Allocation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Select Charity Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Choose Your Accredited Partner</h2>
        <p className="text-xs text-muted-foreground">
          Select which verified non-profit will receive your contributions whenever you win.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FALLBACK_CHARITIES.map((charity) => {
            const isSelected = selectedCharityId === charity.id;
            return (
              <div
                key={charity.id}
                onClick={() => setSelectedCharityId(charity.id)}
                className={`p-5 rounded-2xl glass-card border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {charity.category}
                    </Badge>
                    {isSelected && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Selected
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{charity.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {charity.short_description || charity.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Received to date:</span>
                  <span className="font-semibold text-emerald-400">
                    {formatMoney(charity.total_received || 0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
