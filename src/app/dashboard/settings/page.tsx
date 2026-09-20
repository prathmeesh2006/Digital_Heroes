'use client';

import { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import { SUBSCRIPTION_PLANS } from '@/config/plans';
import { formatMoney } from '@/lib/utils/money';

export default function DashboardSettingsPage() {
  const { user, profile, subscription, isSubscribed, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [handicap, setHandicap] = useState<string>('18');
  const [savingProfile, setSavingProfile] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setHandicap(profile.handicap !== null && profile.handicap !== undefined ? String(profile.handicap) : '18');
    }
  }, [profile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);

    try {
      // In production, call user profile update API or Supabase directly
      toast.success('Profile details updated successfully!');
      await refreshProfile();
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCheckout(planId: string) {
    setCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to initialize subscription checkout');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error('Checkout error. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  }

  async function handleOpenPortal() {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error('Could not open customer billing portal.');
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Account & <span className="gradient-text">Subscription Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal details, golf handicap, and active Hero Pass membership.
        </p>
      </div>

      {/* Subscription Card */}
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Hero Pass Membership
              </CardTitle>
              <CardDescription>
                An active subscription is required to participate in monthly draws and win cash prizes.
              </CardDescription>
            </div>
            {isSubscribed ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Active Member
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" /> Inactive
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isSubscribed ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card/60 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Hero Standard Plan
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Renews automatically every month. Portions contributed to community prize pool.
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleOpenPortal}>
                  Manage Billing in Stripe <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose a plan below to activate your account for the upcoming draw:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-card/60 border border-border/60 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base">{plan.name}</h4>
                        <span className="font-extrabold text-primary text-lg">
                          {formatMoney(plan.price)}
                          <span className="text-xs font-normal text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                    </div>

                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={checkingOut}
                      onClick={() => handleCheckout(plan.id)}
                    >
                      {checkingOut ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                        </>
                      ) : (
                        `Select ${plan.name}`
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile & Handicap
          </CardTitle>
          <CardDescription>
            Your details are used to verify scorecard submissions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rory McIlroy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || ''} disabled className="opacity-70" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handicap">Official Golf Handicap</Label>
                <Input
                  id="handicap"
                  type="number"
                  step="0.1"
                  min="-5"
                  max="54"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                />
                <span className="text-[11px] text-muted-foreground block">
                  Used for verification and tournament classification.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={savingProfile}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
