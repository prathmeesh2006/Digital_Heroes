'use client';

import { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/format';

interface AdminWinnerItem {
  id: string;
  draw_name: string;
  draw_date: string;
  user_name: string;
  user_email: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  match_count: 5 | 4 | 3;
  gross_amount: number;
  charity_name: string;
  charity_percentage: number;
  charity_amount: number;
  net_amount: number;
  proof_file_name?: string;
  proof_url?: string;
  status: 'pending_proof' | 'under_review' | 'approved' | 'paid';
}

const SAMPLE_WINNERS_QUEUE: AdminWinnerItem[] = [
  {
    id: 'w-101',
    draw_name: 'March 2026 Monthly Draw',
    draw_date: '2026-03-31',
    user_name: 'David MacLeod',
    user_email: 'david.m@example.com',
    tier: 'tier3',
    match_count: 3,
    gross_amount: 11607, // £116.07
    charity_name: 'Golf for All Foundation',
    charity_percentage: 15,
    charity_amount: 1741,
    net_amount: 9866,
    proof_file_name: 'david_march_scorecard.pdf',
    proof_url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    status: 'under_review',
  },
  {
    id: 'w-102',
    draw_name: 'February 2026 Monthly Draw',
    draw_date: '2026-02-28',
    user_name: 'Sarah Jenkins',
    user_email: 'sarah.j@example.com',
    tier: 'tier2',
    match_count: 4,
    gross_amount: 60666, // £606.66
    charity_name: 'Golf for All Foundation',
    charity_percentage: 15,
    charity_amount: 9100,
    net_amount: 51566,
    proof_file_name: 'sarah_feb_card.jpg',
    proof_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80',
    status: 'paid',
  },
];

export default function AdminWinnersPage() {
  const [queue, setQueue] = useState<AdminWinnerItem[]>(SAMPLE_WINNERS_QUEUE);

  function handleApprove(id: string) {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
    toast.success('Winner scorecard proof verified and approved for bank payout!');
  }

  function handleReject(id: string) {
    if (!confirm('Are you sure you want to reject this scorecard submission?')) return;
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'pending_proof' } : item
      )
    );
    toast.error('Scorecard rejected. Winner requested to submit valid documentation.');
  }

  function handleMarkPaid(id: string) {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'paid' } : item
      )
    );
    toast.success('Payout marked as settled and sent via bank transfer!');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Winner Verification & <span className="gradient-text">Payout Review</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review uploaded golf scorecards, approve verified matches, and release bank disbursements.
        </p>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Verification Queue</CardTitle>
          <CardDescription>
            All winning draws require human verification to preserve game integrity.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-card/40 border border-border/40 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-foreground">{item.user_name}</span>
                      <Badge className="bg-primary/20 text-primary border-none text-xs">
                        {item.match_count}-Number Match
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.draw_name}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.user_email} • Drawn on {formatDate(item.draw_date)}
                    </div>
                  </div>

                  <div>
                    {item.status === 'under_review' && (
                      <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-xs">
                        <Clock className="h-3 w-3 mr-1" /> Awaiting Admin Approval
                      </Badge>
                    )}
                    {item.status === 'approved' && (
                      <Badge className="bg-primary/20 text-primary border-none text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Approved (Ready for Payout)
                      </Badge>
                    )}
                    {item.status === 'paid' && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                      </Badge>
                    )}
                    {item.status === 'pending_proof' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" /> Awaiting Scorecard
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-card/60 border border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Gross Prize</span>
                    <span className="font-bold text-sm text-foreground">
                      {formatMoney(item.gross_amount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">
                      Charity ({item.charity_percentage}%)
                    </span>
                    <span className="font-bold text-sm text-emerald-400">
                      -{formatMoney(item.charity_amount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Charity Partner</span>
                    <span className="font-medium text-foreground truncate block">
                      {item.charity_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Net Payable to Winner</span>
                    <span className="font-extrabold text-sm text-primary">
                      {formatMoney(item.net_amount)}
                    </span>
                  </div>
                </div>

                {/* Scorecard Proof View & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    {item.proof_file_name ? (
                      <>
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Scorecard Proof:</span>
                        <a
                          href={item.proof_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary flex items-center gap-1 underline"
                        >
                          {item.proof_file_name} <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No proof uploaded yet</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'under_review' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(item.id)}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject Scorecard
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white"
                          onClick={() => handleApprove(item.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve Claim
                        </Button>
                      </>
                    )}

                    {item.status === 'approved' && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleMarkPaid(item.id)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" /> Release Bank Payout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
