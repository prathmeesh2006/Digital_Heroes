'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Search, ExternalLink, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FALLBACK_CHARITIES } from '@/config/charities';
import { formatMoney } from '@/lib/utils/money';
import { ROUTES } from '@/config/constants';

const CATEGORIES = ['All', 'Youth & Sport', 'Environment', 'Veterans & Health', 'Healthcare', 'Youth & Education'];

export default function CharitiesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCharities = FALLBACK_CHARITIES.filter((charity) => {
    const matchesSearch =
      charity.name.toLowerCase().includes(search.toLowerCase()) ||
      (charity.short_description && charity.short_description.toLowerCase().includes(search.toLowerCase())) ||
      (charity.description && charity.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || charity.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalRaisedAcrossCharities = FALLBACK_CHARITIES.reduce(
    (sum, c) => sum + (c.total_received || 0),
    0
  );

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
            <Heart className="h-3.5 w-3.5 fill-emerald-400" />
            Every Draw Gives Back
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Accredited Charity <span className="gradient-text">Directory</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Subscribers pledge a minimum of 10% (up to 100%) of any draw winnings directly to their chosen charity.
            Explore our verified partners transforming lives and landscapes.
          </p>

          {/* Cumulative Impact Banner */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-2xl glass-card border-border/50 text-left">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Total Donated</div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {formatMoney(totalRaisedAcrossCharities)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">Minimum Pledge</div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mt-1">10% Guaranteed</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-xs text-muted-foreground uppercase font-semibold">Verification</div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mt-1">100% Direct</div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search charities by name or cause..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCharities.map((charity) => (
            <Card
              key={charity.id}
              className="glass-card overflow-hidden border-border/50 hover:border-primary/50 transition-all group flex flex-col"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {charity.image_url ? (
                  <img
                    src={charity.image_url}
                    alt={charity.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-secondary">
                    <Heart className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}
                {charity.is_featured && (
                  <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white border-none shadow-md">
                    <Sparkles className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                )}
                {charity.category && (
                  <Badge variant="secondary" className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md">
                    {charity.category}
                  </Badge>
                )}
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {charity.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                  {charity.short_description || charity.description}
                </p>

                {/* Raised & Events summary */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground block">Received from Draws</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      {formatMoney(charity.total_received || 0)}
                    </span>
                  </div>

                  {charity.upcoming_events && charity.upcoming_events.length > 0 && (
                    <div className="text-right">
                      <span className="text-muted-foreground block">Next Event</span>
                      <span className="text-foreground font-medium flex items-center gap-1 justify-end">
                        <Calendar className="h-3 w-3 text-primary" />
                        {charity.upcoming_events[0].title.slice(0, 18)}...
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/charities/${charity.slug || charity.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full bg-primary text-primary-foreground" asChild>
                    <Link href={`${ROUTES.signup}?charity=${charity.id}`}>
                      Select & Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredCharities.length === 0 && (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No charities found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search terms or category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
