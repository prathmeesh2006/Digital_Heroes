'use client';

import { BarChart3, Download, Heart, Trophy, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatMoney } from '@/lib/utils/money';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  function handleExportCSV() {
    toast.success('Financial report exported to CSV successfully.');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Financial & <span className="gradient-text">Impact Reports</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reconcile subscription dues, draw prize distributions, charity disbursements, and jackpot rollover balances.
          </p>
        </div>

        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export Audit CSV
        </Button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Gross Subscription Revenue
            </span>
            <div className="text-2xl font-bold mt-1 text-foreground">
              {formatMoney(3744000)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">3-Month Cumulative</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Total Prizes Awarded
            </span>
            <div className="text-2xl font-bold mt-1 text-amber-400">
              {formatMoney(1570000)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Across 41 winner claims</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Total Charity Grants Released
            </span>
            <div className="text-2xl font-bold mt-1 text-emerald-400">
              {formatMoney(9255000)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Direct EFT remittances</div>
          </CardContent>
        </Card>
      </div>

      {/* Rollover Ledger Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Jackpot Rollover Accounting Ledger</CardTitle>
          <CardDescription>
            Audit trail of 5-number match jackpot carry-overs when no member qualifies.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 text-xs uppercase text-muted-foreground bg-muted/20">
                <tr>
                  <th className="p-3">Draw Period</th>
                  <th className="p-3">Rollover In</th>
                  <th className="p-3">New Allocation (40%)</th>
                  <th className="p-3">Jackpot Claimed?</th>
                  <th className="p-3">Rollover Out (to Next Month)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-xs">
                <tr>
                  <td className="p-3 font-sans font-medium text-foreground">January 2026</td>
                  <td className="p-3">{formatMoney(0)}</td>
                  <td className="p-3">{formatMoney(160000)}</td>
                  <td className="p-3 text-emerald-400 font-sans">Yes (£1,600 Won)</td>
                  <td className="p-3">{formatMoney(0)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-foreground">February 2026</td>
                  <td className="p-3">{formatMoney(0)}</td>
                  <td className="p-3">{formatMoney(208000)}</td>
                  <td className="p-3 text-emerald-400 font-sans">Yes (£2,080 Won)</td>
                  <td className="p-3">{formatMoney(0)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-foreground">March 2026</td>
                  <td className="p-3">{formatMoney(0)}</td>
                  <td className="p-3">{formatMoney(260000)}</td>
                  <td className="p-3 text-amber-400 font-sans">Unclaimed (No 5-match)</td>
                  <td className="p-3 font-bold text-amber-400">{formatMoney(260000)}</td>
                </tr>
                <tr className="bg-primary/5 font-semibold">
                  <td className="p-3 font-sans text-primary">April 2026 (Scheduled)</td>
                  <td className="p-3 text-amber-400">{formatMoney(260000)}</td>
                  <td className="p-3">{formatMoney(312000)}</td>
                  <td className="p-3 text-muted-foreground font-sans">Draw on 30 Apr</td>
                  <td className="p-3 text-primary">Pending execution</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
