'use client';

import { useState } from 'react';
import {
  Wallet,
  Trophy,
  Heart,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/format';

interface UserWinning {
  id: string;
  draw_name: string;
  draw_date: string;
  match_count: 5 | 4 | 3;
  gross_amount: number; // in minor units (£)
  charity_percentage: number;
  charity_amount: number;
  net_amount: number;
  charity_name: string;
  status: 'pending_proof' | 'under_review' | 'approved' | 'paid';
  proof_file_name?: string;
}

// Sample mock data for demo / user visual testing
const SAMPLE_WINNINGS: UserWinning[] = [
  {
    id: 'win-001',
    draw_name: 'February 2026 Monthly Draw',
    draw_date: '2026-02-28',
    match_count: 4,
    gross_amount: 60666, // £606.66
    charity_percentage: 15,
    charity_amount: 9100, // £91.00
    net_amount: 51566, // £515.66
    charity_name: 'Golf for All Foundation',
    status: 'paid',
    proof_file_name: 'feb_medal_scorecard.pdf',
  },
  {
    id: 'win-002',
    draw_name: 'March 2026 Monthly Draw',
    draw_date: '2026-03-31',
    match_count: 3,
    gross_amount: 11607, // £116.07
    charity_percentage: 15,
    charity_amount: 1741, // £17.41
    net_amount: 9866, // £98.66
    charity_name: 'Golf for All Foundation',
    status: 'pending_proof',
  },
];

export default function DashboardWinningsPage() {
  const [winnings, setWinnings] = useState<UserWinning[]>(SAMPLE_WINNINGS);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedWin, setSelectedWin] = useState<UserWinning | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const totalGross = winnings.reduce((sum, w) => sum + w.gross_amount, 0);
  const totalCharity = winnings.reduce((sum, w) => sum + w.charity_amount, 0);
  const totalNet = winnings.reduce((sum, w) => sum + w.net_amount, 0);

  function handleOpenUpload(win: UserWinning) {
    setSelectedWin(win);
    setFile(null);
    setUploadModalOpen(true);
  }

  async function handleSubmitProof(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !selectedWin) {
      toast.error('Please choose a scorecard file to upload.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('winnerId', selectedWin.id);

      const res = await fetch('/api/winners/proof', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to upload proof');
        return;
      }

      toast.success('Scorecard proof uploaded! Our team will review within 24 hours.');

      // Update state
      setWinnings((prev) =>
        prev.map((w) =>
          w.id === selectedWin.id
            ? { ...w, status: 'under_review', proof_file_name: file.name }
            : w
        )
      );

      setUploadModalOpen(false);
    } catch {
      toast.error('An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
    }
  }

  const StatusBadge = ({ status }: { status: UserWinning['status'] }) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Paid via Bank
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-primary/10 text-primary border-primary/30">
            <ShieldCheck className="h-3 w-3 mr-1" /> Approved for Payout
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="outline" className="text-amber-400 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" /> Proof Under Review
          </Badge>
        );
      case 'pending_proof':
      default:
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="h-3 w-3 mr-1" /> Scorecard Proof Required
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Winnings & <span className="gradient-text">Verification</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your draw winnings, submit scorecard proof for verification, and track charity donations and bank payouts.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Total Prize Won</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-foreground">
              {formatMoney(totalGross)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Gross prize allocation</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Charity Contributions</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-400">
              {formatMoney(totalCharity)}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-1">Direct philanthropic grants</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-5">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Net Paid to You</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-primary">
              {formatMoney(totalNet)}
            </div>
            <div className="text-[11px] text-primary/80 mt-1">Transferred after verification</div>
          </CardContent>
        </Card>
      </div>

      {/* Winnings List Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Prize Claims & Match Records</CardTitle>
          <CardDescription>
            Each winning match requires a verified scorecard before payout release.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {winnings.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl">
              <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <h4 className="text-sm font-semibold">No winnings recorded yet</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Keep recording your Stableford rounds to be in the next monthly draw!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {winnings.map((win) => (
                <div
                  key={win.id}
                  className="p-5 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{win.draw_name}</h3>
                        <Badge className="bg-primary/20 text-primary border-none text-xs">
                          {win.match_count}-Number Match
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Drawn on {formatDate(win.draw_date)}
                      </div>
                    </div>

                    <div>
                      <StatusBadge status={win.status} />
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-card/60 border border-border/40 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Gross Prize</span>
                      <span className="font-bold text-sm text-foreground">
                        {formatMoney(win.gross_amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">
                        Charity ({win.charity_percentage}%)
                      </span>
                      <span className="font-bold text-sm text-emerald-400">
                        -{formatMoney(win.charity_amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Designated Charity</span>
                      <span className="font-medium text-foreground truncate block">
                        {win.charity_name}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Net Payout</span>
                      <span className="font-extrabold text-sm text-primary">
                        {formatMoney(win.net_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions / Proof status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {win.proof_file_name ? (
                        <>
                          <FileText className="h-4 w-4 text-primary" />
                          <span>Uploaded: <strong>{win.proof_file_name}</strong></span>
                        </>
                      ) : (
                        <span>Upload photo of paper or electronic golf scorecard.</span>
                      )}
                    </div>

                    {win.status === 'pending_proof' && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleOpenUpload(win)}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Scorecard Proof
                      </Button>
                    )}

                    {win.status === 'under_review' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenUpload(win)}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Replace Upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proof Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Submit Scorecard Proof
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              For {selectedWin?.draw_name} ({selectedWin?.match_count}-number match). Upload a clear image or PDF of your scorecard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="scorecardFile" className="text-sm">
                Scorecard File (JPEG, PNG, WEBP, or PDF)
              </Label>
              <Input
                id="scorecardFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground block">
                Maximum file size: 5MB. Must clearly display player name, date, and Stableford points.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !file}
                className="bg-primary text-primary-foreground"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
