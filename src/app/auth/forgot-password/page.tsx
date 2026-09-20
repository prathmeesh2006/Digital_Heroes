'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/config/constants';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmitted(true);
      toast.success('Password reset link sent to your email.');
    } catch {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      <Card className="glass-card border-border/50">
        <CardHeader className="text-center space-y-4 pb-2">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              Digital<span className="gradient-text"> Heroes</span>
            </span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {submitted
                ? 'Check your inbox for reset instructions'
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>
        </CardHeader>

        {submitted ? (
          <CardContent className="space-y-4 pt-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We have sent a password reset link to <strong className="text-foreground">{email}</strong>.
              Click the link in the email to set a new password.
            </p>
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={ROUTES.login}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleResetRequest}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Remember your password?{' '}
                <Link
                  href={ROUTES.login}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
