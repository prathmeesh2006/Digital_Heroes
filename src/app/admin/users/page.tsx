'use client';

import { useState } from 'react';
import { Users, Search, Shield, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'subscriber';
  status: 'active' | 'inactive';
  scoresCount: number;
  handicap: number;
  joined: string;
}

const SAMPLE_USERS: AdminUserRow[] = [
  {
    id: 'u-1',
    name: 'Alexander Wright',
    email: 'alexander@example.com',
    role: 'admin',
    status: 'active',
    scoresCount: 5,
    handicap: 8.4,
    joined: '2026-01-10',
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'subscriber',
    status: 'active',
    scoresCount: 5,
    handicap: 14.2,
    joined: '2026-01-15',
  },
  {
    id: 'u-3',
    name: 'David MacLeod',
    email: 'david.m@example.com',
    role: 'subscriber',
    status: 'active',
    scoresCount: 4,
    handicap: 22.0,
    joined: '2026-02-01',
  },
  {
    id: 'u-4',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    role: 'subscriber',
    status: 'inactive',
    scoresCount: 2,
    handicap: 18.5,
    joined: '2026-02-20',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>(SAMPLE_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function toggleUserRole(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: u.role === 'admin' ? 'subscriber' : 'admin' }
          : u
      )
    );
    toast.success('User role updated successfully');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          User & Subscriber <span className="gradient-text">Directory</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor subscriber statuses, golf score participation, and access privilege roles.
        </p>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">Registered Members</CardTitle>
              <CardDescription>
                Manage permissions and verify active subscription states.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 text-xs uppercase text-muted-foreground bg-muted/20">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Active Scores</th>
                  <th className="p-3">Handicap</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-medium">
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>

                    <td className="p-3">
                      {user.role === 'admin' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                          <Shield className="h-3 w-3 mr-1" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Subscriber
                        </Badge>
                      )}
                    </td>

                    <td className="p-3">
                      {user.status === 'active' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active Pass
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" /> Inactive
                        </Badge>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-xs">
                        {user.scoresCount} / 5
                      </span>
                    </td>

                    <td className="p-3 font-mono text-xs">{user.handicap}</td>

                    <td className="p-3 text-xs text-muted-foreground">{user.joined}</td>

                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(user.id)}
                        className="text-xs h-8"
                      >
                        {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
