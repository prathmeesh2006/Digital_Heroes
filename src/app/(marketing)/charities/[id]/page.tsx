import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, Globe, Calendar, ArrowLeft, ShieldCheck, CheckCircle, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getCharityByIdOrSlug } from '@/lib/charities/service';
import { formatMoney } from '@/lib/utils/money';
import { ROUTES } from '@/config/constants';

interface CharityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharityDetailPage({ params }: CharityDetailPageProps) {
  const { id } = await params;
  const charity = await getCharityByIdOrSlug(id);

  if (!charity) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={ROUTES.charities}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Charity Directory
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden glass-card border-border/50 mb-10">
          <div className="h-64 sm:h-80 w-full relative bg-muted overflow-hidden">
            {charity.image_url ? (
              <img
                src={charity.image_url}
                alt={charity.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-secondary">
                <Heart className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="p-6 sm:p-10 relative -mt-20">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {charity.category && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {charity.category}
                </Badge>
              )}
              {charity.is_featured && (
                <Badge className="bg-emerald-500/90 text-white border-none text-sm px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Verified Partner
                </Badge>
              )}
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" /> 100% Verified Non-Profit
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {charity.name}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {charity.description || charity.short_description}
            </p>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="p-4 rounded-xl bg-card/50 border border-border/40">
                <div className="text-xs text-muted-foreground uppercase font-semibold">Total Received</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {formatMoney(charity.total_received || 0)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/50 border border-border/40">
                <div className="text-xs text-muted-foreground uppercase font-semibold">Donor Minimum Pledge</div>
                <div className="text-2xl font-bold text-foreground mt-1">
                  10% of Winnings
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/50 border border-border/40">
                <div className="text-xs text-muted-foreground uppercase font-semibold">Official Website</div>
                <div className="mt-1">
                  {charity.website_url ? (
                    <a
                      href={charity.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-sm pt-1"
                    >
                      Visit site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Available on file</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Events & Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Impact Details */}
            <Card className="glass-card border-border/50">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <h2 className="text-2xl font-bold">How Your Golf Drives Real Impact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every time you record your Stableford rounds in Digital Heroes, you enter our monthly prize draw.
                  When your numbers match, the percentage you selected (minimum 10%, up to 100%) goes directly to{' '}
                  <strong className="text-foreground">{charity.name}</strong>.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      <strong>Transparent payouts:</strong> Funds are transferred directly following draw verification.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      <strong>Tax receipts & attribution:</strong> Full reporting provided on your user dashboard.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      <strong>Change anytime:</strong> Adjust your chosen charity or donation percentage with 1 click.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            {charity.upcoming_events && charity.upcoming_events.length > 0 && (
              <Card className="glass-card border-border/50">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-4">Upcoming Initiatives & Events</h2>
                  <div className="space-y-4">
                    {charity.upcoming_events.map((event, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-card/50 border border-border/40 flex items-start gap-4"
                      >
                        <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <div className="text-xs text-primary font-medium mt-0.5">{event.date}</div>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: CTA Box */}
          <div className="space-y-6">
            <Card className="glass-card border-primary/40 bg-gradient-to-b from-primary/5 to-transparent">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Heart className="h-6 w-6 text-primary fill-primary/30" />
                </div>
                <h3 className="text-xl font-bold">Support {charity.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Choose this charity during registration or in your dashboard settings. Every monthly draw you play helps fund their vital mission.
                </p>

                <div className="pt-2">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" asChild>
                    <Link href={`${ROUTES.signup}?charity=${charity.id}`}>
                      Select & Join Digital Heroes
                    </Link>
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Cancel anytime. 100% of charitable pledges transferred to accredited partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
