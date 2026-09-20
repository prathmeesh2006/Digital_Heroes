import Link from 'next/link';
import { Trophy, Calendar, Sparkles, Flame, CheckCircle, ArrowRight, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { ROUTES } from '@/config/constants';

interface DrawHistoryItem {
  id: string;
  draw_name: string;
  draw_date: string;
  numbers: number[];
  mode: 'random' | 'algorithmic';
  total_pool: number;
  charity_raised: number;
  jackpot_claimed: boolean;
  tier1_winners: number;
  tier2_winners: number;
  tier3_winners: number;
}

const SAMPLE_PAST_DRAWS: DrawHistoryItem[] = [
  {
    id: 'd-2026-03',
    draw_name: 'March 2026 Monthly Draw',
    draw_date: '2026-03-31',
    numbers: [14, 21, 28, 35, 41],
    mode: 'random',
    total_pool: 650000, // £6,500
    charity_raised: 125000,
    jackpot_claimed: false,
    tier1_winners: 0,
    tier2_winners: 2,
    tier3_winners: 14,
  },
  {
    id: 'd-2026-02',
    draw_name: 'February 2026 Monthly Draw',
    draw_date: '2026-02-28',
    numbers: [7, 18, 26, 33, 44],
    mode: 'algorithmic',
    total_pool: 520000, // £5,200
    charity_raised: 98000,
    jackpot_claimed: true,
    tier1_winners: 1,
    tier2_winners: 3,
    tier3_winners: 19,
  },
  {
    id: 'd-2026-01',
    draw_name: 'January 2026 Inaugural Draw',
    draw_date: '2026-01-31',
    numbers: [12, 19, 29, 36, 42],
    mode: 'random',
    total_pool: 400000, // £4,000
    charity_raised: 72000,
    jackpot_claimed: true,
    tier1_winners: 1,
    tier2_winners: 1,
    tier3_winners: 11,
  },
];

export default function DrawsMarketingPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4 px-3 py-1">
            <Trophy className="h-3.5 w-3.5 mr-1" /> Monthly Draw Hub
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Draw Results & <span className="gradient-text">Prize Pool</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore past winning numbers, current jackpot rollover status, and community prize distributions.
          </p>
        </div>

        {/* Current Active Draw Showcase */}
        <div className="glass-card rounded-3xl border-primary/40 p-8 sm:p-12 mb-20 relative overflow-hidden bg-gradient-to-b from-primary/10 via-card/50 to-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-500 text-white font-semibold">Active Draw</Badge>
                <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                  <Flame className="h-3.5 w-3.5 mr-1" /> £2,600 Rollover Added!
                </Badge>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                April 2026 Championship Draw
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Entries are currently open. Enter your 5 legitimate Stableford golf scores before draw night to be entered automatically.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-3 rounded-xl bg-background/50 border border-border/40">
                  <div className="text-xs text-muted-foreground">Estimated Prize Pool</div>
                  <div className="text-2xl font-black text-foreground mt-0.5">£7,800+</div>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-border/40">
                  <div className="text-xs text-muted-foreground">5-Match Jackpot</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">£3,120+</div>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-border/40 col-span-2 sm:col-span-1">
                  <div className="text-xs text-muted-foreground">Draw Execution</div>
                  <div className="text-sm font-bold text-primary mt-1">30 April 2026</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-card/60 border border-border/60 text-center space-y-4">
              <Dices className="h-12 w-12 text-primary animate-pulse" />
              <div className="text-lg font-bold">Have You Entered Your Scores?</div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Active subscribers with at least 1 recorded Stableford score are automatically eligible. 5 scores gives you the full set!
              </p>
              <Button size="lg" className="w-full bg-primary text-primary-foreground" asChild>
                <Link href={ROUTES.dashboardScores}>Record Your Scores</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Past Draw Archive */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Recent Draw Archive</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Verified results and winning number distributions from preceding months.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {SAMPLE_PAST_DRAWS.map((draw) => (
              <Card key={draw.id} className="glass-card border-border/50 hover:border-border transition-all">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{draw.draw_name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {draw.mode === 'algorithmic' ? 'Weighted Algorithmic' : 'Random Mode'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> Drawn on {draw.draw_date}
                      </div>
                    </div>

                    {/* Middle: Number Balls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {draw.numbers.map((num, i) => (
                        <div
                          key={i}
                          className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-foreground font-black text-lg sm:text-xl border border-primary/30 shadow-inner"
                        >
                          {num}
                        </div>
                      ))}
                    </div>

                    {/* Right: Metrics */}
                    <div className="flex items-center gap-6 text-sm border-t lg:border-t-0 pt-4 lg:pt-0 border-border/50">
                      <div>
                        <div className="text-xs text-muted-foreground">Total Prize Pool</div>
                        <div className="font-bold text-foreground">{formatMoney(draw.total_pool)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Charity Raised</div>
                        <div className="font-bold text-emerald-400">{formatMoney(draw.charity_raised)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Jackpot Status</div>
                        <div className="font-semibold text-xs">
                          {draw.jackpot_claimed ? (
                            <span className="text-emerald-400">1 Winner Claimed</span>
                          ) : (
                            <span className="text-amber-400">Rolled Over</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dual Mode Explanation */}
        <div className="glass-card p-8 rounded-3xl border-border/50 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Supported Draw Modes
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As defined in our system architecture, Digital Heroes supports both <strong>Cryptographically Secure Random Draws</strong> (using system CSPRNG) and <strong>Score-Frequency Weighted Algorithmic Draws</strong> (where numbers are dynamically weighted according to how frequently scores are played by the community). Every draw is executed server-side with strict cryptographic logging.
          </p>
        </div>
      </div>
    </div>
  );
}
