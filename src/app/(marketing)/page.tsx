'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Trophy,
  Target,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Gift,
  Star,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/constants';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ====== HERO ====== */}
      <section className="relative min-h-[90vh] flex items-center animated-gradient">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/30 text-primary bg-primary/5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Platform for Good
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
              variants={fadeInUp}
            >
              Play Golf.{' '}
              <span className="gradient-text">Win Prizes.</span>
              <br />
              Change Lives.
            </motion.h1>

            <motion.p
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Subscribe, track your Stableford scores, and enter monthly prize draws —
              while directing a portion of your subscription to the charity you choose.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base animate-pulse-glow"
                asChild
              >
                <Link href={ROUTES.signup}>
                  Start Your Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-12 text-base border-border/50"
                asChild
              >
                <Link href={ROUTES.howItWorks}>See How It Works</Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span>Charity First</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Monthly Prizes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-24 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Three simple steps to play, win, and make a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Subscribe',
                description:
                  'Choose a monthly or yearly plan. Select the charity you want to support and set your contribution percentage.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                step: '02',
                icon: Target,
                title: 'Enter Scores',
                description:
                  'Log your latest 5 Stableford golf scores. Your scores become your entry numbers for the monthly prize draw.',
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
              },
              {
                step: '03',
                icon: Trophy,
                title: 'Win & Give',
                description:
                  'Match 3, 4, or all 5 numbers in the monthly draw to win prizes — while your charity benefits every month.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="relative glass-card border-border/50 hover:border-primary/30 transition-all duration-300 group h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} ring-1 ring-white/10`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <span className="text-sm font-mono text-muted-foreground/50">
                        STEP {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CHARITY IMPACT ====== */}
      <section className="py-24 lg:py-32 relative bg-muted/20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 border-rose-400/30 text-rose-400 bg-rose-500/5">
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Charity First
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Every Subscription
                <br />
                <span className="gradient-text">Makes a Difference</span>
              </h2>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
                At least 10% of every subscription goes directly to a charity of
                your choice. You pick the cause, you set the percentage — and you
                can increase your impact at any time.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Choose from a curated directory of verified charities',
                  'Minimum 10% of your subscription goes to your charity',
                  'Increase your contribution voluntarily at any time',
                  'Make independent donations beyond your subscription',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href={ROUTES.charities}>
                  Explore Charities
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { label: 'Charities Supported', value: '5+', icon: Heart, color: 'text-rose-400' },
                { label: 'Min. Contribution', value: '10%', icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Causes Available', value: 'Multiple', icon: Star, color: 'text-amber-400' },
                { label: 'Direct Impact', value: '100%', icon: Zap, color: 'text-violet-400' },
              ].map((stat, index) => (
                <Card
                  key={stat.label}
                  className="glass-card border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== HOW THE DRAW WORKS ====== */}
      <section className="py-24 lg:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-amber-400/30 text-amber-400 bg-amber-500/5">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              Monthly Draw
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How the Draw Works
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Your golf scores are your lottery numbers. The more you play, the
              better your chances.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  title: 'Your 5 scores = Your 5 numbers',
                  description:
                    'Your latest 5 Stableford scores (1–45) become your entry numbers for the monthly draw.',
                },
                {
                  title: 'Monthly winning numbers drawn',
                  description:
                    'Each month, 5 winning numbers are generated using either random or algorithmic methods.',
                },
                {
                  title: 'Match to win',
                  description:
                    'Match 3, 4, or all 5 numbers to win from the corresponding prize tier.',
                },
                {
                  title: 'Jackpot rolls over',
                  description:
                    'If nobody matches all 5 numbers, the jackpot rolls over to the next month — growing bigger every time.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm ring-1 ring-primary/20">
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className="w-px h-full bg-border/50 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== PRIZE POOL ====== */}
      <section className="py-24 lg:py-32 relative bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-amber-400/30 text-amber-400 bg-amber-500/5">
              <Gift className="h-3.5 w-3.5 mr-1.5" />
              Prize Distribution
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three Tiers of Prizes
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              The prize pool is split across three match tiers. Multiple winners
              share their tier equally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                tier: '5-Number Match',
                percentage: '40%',
                rollover: true,
                description: 'Match all 5 numbers for the jackpot. Rolls over if unclaimed.',
                gradient: 'from-amber-500/20 to-amber-500/5',
                borderColor: 'border-amber-400/30',
                textColor: 'gradient-text-gold',
              },
              {
                tier: '4-Number Match',
                percentage: '35%',
                rollover: false,
                description: 'Match 4 of 5 numbers. Split equally among all 4-match winners.',
                gradient: 'from-violet-500/20 to-violet-500/5',
                borderColor: 'border-violet-400/30',
                textColor: 'text-violet-400',
              },
              {
                tier: '3-Number Match',
                percentage: '25%',
                rollover: false,
                description: 'Match 3 of 5 numbers. Split equally among all 3-match winners.',
                gradient: 'from-emerald-500/20 to-emerald-500/5',
                borderColor: 'border-emerald-400/30',
                textColor: 'text-emerald-400',
              },
            ].map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className={`glass-card ${tier.borderColor} hover:shadow-lg transition-all duration-300 h-full`}>
                  <CardContent className="p-8 text-center">
                    <div className={`text-4xl font-bold mb-2 ${tier.textColor}`}>
                      {tier.percentage}
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{tier.tier}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                    {tier.rollover && (
                      <Badge className="mt-4 bg-amber-500/10 text-amber-400 border-amber-400/20">
                        Jackpot Rollover
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to Become a{' '}
              <span className="gradient-text">Digital Hero</span>?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a community of golfers who play with purpose. Subscribe today
              and start making a difference while competing for monthly prizes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-13 text-lg animate-pulse-glow"
                asChild
              >
                <Link href={ROUTES.signup}>
                  Subscribe Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              From £9.99/month · Cancel anytime · 10%+ goes to charity
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
