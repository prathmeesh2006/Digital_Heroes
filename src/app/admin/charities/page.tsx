'use client';

import { useState } from 'react';
import { Heart, Plus, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FALLBACK_CHARITIES } from '@/config/charities';
import { formatMoney } from '@/lib/utils/money';
import type { Charity } from '@/types';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>(FALLBACK_CHARITIES);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Youth & Sport');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [saving, setSaving] = useState(false);

  function handleCreateCharity(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const newCharity: Charity = {
        id: `c-custom-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description,
        short_description: description.slice(0, 120),
        website_url: websiteUrl,
        image_url: null,
        logo_url: null,
        total_received: 0,
        is_featured: false,
        is_active: true,
        upcoming_events: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCharities([newCharity, ...charities]);
      toast.success('New accredited charity registered successfully!');
      setModalOpen(false);

      // Reset
      setName('');
      setDescription('');
      setWebsiteUrl('');
    } catch {
      toast.error('Failed to create charity.');
    } finally {
      setSaving(false);
    }
  }

  function toggleActive(id: string) {
    setCharities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
    toast.success('Charity status updated');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accredited Charity <span className="gradient-text">Partners</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage beneficiary non-profit organizations, monitor grant disbursements, and onboard new partners.
          </p>
        </div>

        <Button
          className="bg-emerald-600 hover:bg-emerald-500 text-white"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Charity
        </Button>
      </div>

      {/* Charities Table Card */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Partner Organizations</CardTitle>
          <CardDescription>
            Non-profits eligible to receive draw pledges (minimum 10% from every winning member).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 text-xs uppercase text-muted-foreground bg-muted/20">
                <tr>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Total Disbursed</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {charities.map((charity) => (
                  <tr key={charity.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-medium">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-emerald-400" />
                        {charity.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                        {charity.short_description || charity.description}
                      </div>
                    </td>

                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {charity.category || 'General'}
                      </Badge>
                    </td>

                    <td className="p-3 font-bold text-emerald-400">
                      {formatMoney(charity.total_received || 0)}
                    </td>

                    <td className="p-3">
                      {charity.is_active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" /> Deactivated
                        </Badge>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(charity.id)}
                        className="text-xs h-8"
                      >
                        {charity.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Charity Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Register New Charity Partner</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a verified non-profit organization to the Digital Heroes beneficiary roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCharity} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="charityName">Charity Name</Label>
              <Input
                id="charityName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fairway Youth Outreach"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Youth & Education, Healthcare"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mission & Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize the core impact and mission of this charity..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...
                  </>
                ) : (
                  'Register Charity'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
