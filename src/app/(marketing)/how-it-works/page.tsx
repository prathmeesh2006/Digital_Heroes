import Link from 'next/link';
import {
  CreditCard,
  Target,
  Trophy,
  Heart,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/constants';

const STEPS = [
  {
    step: '01',
    icon: CreditCard,
    title: 'Subscribe to the Platform',
    desc: 'Choose a monthly or annual subscription. A fixed portion of every membership fee fuels the community prize pool and powers charity grants.',
  },
  {
    step: '02',
    icon: Target,
    title: 'Enter 5 Stableford Scores',
    desc: 'Log your legitimate golf rounds (scores 1–45). Each score records its played date. When you add a 6th score, our system automatically retires the oldest by date.',
  },
  {
    step: '03',
    icon: Trophy,
    title: 'Automatic Monthly Draw',
    desc: 'Each month, 5 winning numbers (1–45) are drawn. If your 5 active scores match 3, 4, or 5 numbers, you win a share of the corresponding prize tier.',
  },
  {
    step: '04',
    icon: Heart,
    title: 'Pledge Minimum 10% to Charity',
    desc: 'All players select an accredited charity partner and allocate at least 10% (up to 100%) of any winnings to create real-world charitable impact.',
  },
  {
    step: '05',
    icon: ShieldCheck,
    title: 'Verify & Receive Payout',
    desc: 'Upload a simple photo of your official scorecard for quick verification. Once approved, payouts are processed directly to your bank account.',
  },
];

const FAQS = [
  {
    q: 'How are Stableford scores converted to draw numbers?',
    a: 'Each user enters up to 5 verified Stableford scores (between 1 and 45). In our standard monthly draw, these 5 scores serve as your personal lucky numbers. When the monthly draw selects 5 winning numbers, your score numbers are compared against the winning set.',
  },
  {
    q: 'What happens when I enter more than 5 scores?',
    a: 'Digital Heroes strictly maintains your latest 5 active scores. Whenever a 6th score is entered, our system automatically retires the oldest score based on the date the round was played (FIFO).',
  },
  {
    q: 'Can I enter multiple scores for the same day?',
    a: 'No. To ensure fair play and prevent artificial manipulation, our system enforces a strict rule: only one score per played date is allowed.',
  },
  {
    q: 'How is the prize pool distributed among winners?',
    a: 'The prize pool is divided across 3 tiers: 40% for 5-number matches (Jackpot), 35% for 4-number matches, and 25% for 3-number matches. If multiple players win in the same tier, the tier funds are split evenly. If nobody wins the 5-match jackpot, it automatically rolls over to the next month!',
  },
  {
    q: 'Is the 10% charity contribution mandatory?',
    a: 'Yes. Digital Heroes is built on the foundation of giving back. Every subscriber agrees to contribute a minimum of 10% of any prize won to their chosen charity. You can choose to increase this up to 100%.',
  },
  {
    q: 'What verification is required to claim prizes?',
    a: 'To maintain total integrity and prevent fraudulent claims, winners submit a scorecard proof (photo or document) for admin verification before payouts are released.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1">
            Simple, Transparent, Rewarding
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            How <span className="gradient-text">Digital Heroes</span> Works
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A seamless synergy of personal golfing achievement, monthly prize excitement, and charitable philanthropy.
            Here is everything you need to know.
          </p>
        </div>

        {/* 5-Step Process */}
        <div className="space-y-8 mb-24 max-w-4xl mx-auto">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 sm:p-8 rounded-2xl border-border/50 hover:border-primary/40 transition-all flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-mono text-xl font-bold ring-1 ring-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prize Tier Architecture */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Prize Distribution Engine</h2>
            <p className="text-muted-foreground mt-2">
              Every monthly draw distributes 100% of its prize fund according to fixed, mathematical tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="glass-card border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                  <Flame className="h-3.5 w-3.5" /> Rollover Eligible
                </div>
                <h3 className="text-2xl font-black">5-Number Match</h3>
                <div className="text-4xl font-extrabold text-amber-400">40%</div>
                <p className="text-xs text-muted-foreground">
                  The ultimate jackpot. If no player matches all 5 numbers, this pool automatically rolls over to increase next month&apos;s jackpot!
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Tier 2 Reward
                </div>
                <h3 className="text-2xl font-black">4-Number Match</h3>
                <div className="text-4xl font-extrabold text-primary">35%</div>
                <p className="text-xs text-muted-foreground">
                  Substantial rewards for hitting 4 out of 5 numbers. Split equally if multiple subscribers qualify.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                  Tier 3 Reward
                </div>
                <h3 className="text-2xl font-black">3-Number Match</h3>
                <div className="text-4xl font-extrabold text-foreground">25%</div>
                <p className="text-xs text-muted-foreground">
                  Frequent wins and great odds. Split evenly amongst all players matching 3 numbers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
              <HelpCircle className="h-7 w-7 text-primary" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="glass-card p-6 rounded-xl border-border/50">
                <h3 className="font-bold text-lg text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center max-w-xl mx-auto glass-card p-10 rounded-3xl border-primary/30">
          <h2 className="text-3xl font-bold">Ready to Become a Digital Hero?</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Join hundreds of passionate golfers competing for monthly cash and supporting life-changing causes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href={ROUTES.signup}>
                Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.charities}>Browse Charities</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
