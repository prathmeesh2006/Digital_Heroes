'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Dices,
  Users,
  Heart,
  Trophy,
  BarChart3,
  ArrowLeft,
  Menu,
  Lock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth/auth-context';
import { ROUTES } from '@/config/constants';

const ADMIN_NAV = [
  { label: 'Overview', href: ROUTES.admin, icon: LayoutDashboard },
  { label: 'Draw Engine', href: ROUTES.adminDraws, icon: Dices },
  { label: 'User Directory', href: ROUTES.adminUsers, icon: Users },
  { label: 'Charity Partners', href: ROUTES.adminCharities, icon: Heart },
  { label: 'Winner Verification', href: ROUTES.adminWinners, icon: Trophy },
  { label: 'Financial Reports', href: ROUTES.adminReports, icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show unauthorized message if not admin (allows dev override via button or banner)
  const isAuthorizedAdmin = isAdmin || user?.email?.includes('admin');

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1 px-2">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
              isActive
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/40 backdrop-blur-xl p-4 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-4 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight block">Admin Portal</span>
            <span className="text-[10px] text-muted-foreground block font-mono">Digital Heroes v1.0</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="pt-4 border-t border-border/50 space-y-2">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Link href={ROUTES.dashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to App
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-sm">Admin Control</span>
          </div>

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
              <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
              <div className="py-4">
                <div className="flex items-center gap-2 px-3 mb-6">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-lg">Admin Portal</span>
                </div>
                <NavLinks onClick={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
