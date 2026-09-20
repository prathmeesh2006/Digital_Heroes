'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  LayoutDashboard,
  Target,
  Trophy,
  Wallet,
  Settings,
  Menu,
  LogOut,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/lib/auth/auth-context';

const NAV_ITEMS = [
  { label: 'Overview', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'My Scores', href: ROUTES.dashboardScores, icon: Target },
  { label: 'Charity Choice', href: ROUTES.dashboardCharity, icon: Heart },
  { label: 'Monthly Draws', href: ROUTES.dashboardDraws, icon: Trophy },
  { label: 'Winnings & Proof', href: ROUTES.dashboardWinnings, icon: Wallet },
  { label: 'Account Settings', href: ROUTES.dashboardSettings, icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, subscription, isSubscribed, isAdmin, signOut } = useAuth();

  const userDisplayName = profile?.full_name || user?.email?.split('@')[0] || 'Hero Member';

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1 px-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
            {item.label}
          </Link>
        );
      })}

      {isAdmin && (
        <div className="pt-4 mt-4 border-t border-border/50">
          <Link
            href={ROUTES.admin}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all border border-emerald-500/20"
          >
            <Shield className="h-4 w-4" />
            Admin Portal
          </Link>
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/40 backdrop-blur-xl p-4 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Digital<span className="gradient-text"> Heroes</span>
          </span>
        </Link>

        {/* Status Card */}
        <div className="mb-6 p-3.5 rounded-2xl glass-card border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Membership</span>
            {isSubscribed ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] px-2">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px] px-2">
                <AlertCircle className="h-3 w-3 mr-1" /> Free / Inactive
              </Badge>
            )}
          </div>
          <div className="text-sm font-semibold text-foreground mt-2 truncate">
            {userDisplayName}
          </div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>

          {!isSubscribed && (
            <Button
              size="sm"
              className="w-full mt-3 h-7 text-xs bg-primary text-primary-foreground"
              asChild
            >
              <Link href={ROUTES.dashboardSettings}>
                <CreditCard className="h-3 w-3 mr-1" /> Activate Pass
              </Link>
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-border/50 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold">Digital Heroes</span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-4 bg-background">
              <SheetTitle className="sr-only">Dashboard Menu</SheetTitle>
              <div className="py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 mb-6"
                  onClick={() => setMobileOpen(false)}
                >
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">Digital Heroes</span>
                </Link>
                <NavLinks onClick={() => setMobileOpen(false)} />

                <div className="mt-8 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
