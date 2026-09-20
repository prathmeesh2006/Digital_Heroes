import Link from 'next/link';
import { Heart, Mail, Globe } from 'lucide-react';
import { NAV_ITEMS, ROUTES } from '@/config/constants';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">
                Digital<span className="gradient-text"> Heroes</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Play golf. Win prizes. Change lives. A premium platform combining
              sport, rewards, and charitable giving.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Platform
            </h3>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Account
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href={ROUTES.login}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={ROUTES.signup}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Create Account
              </Link>
              <Link
                href={ROUTES.dashboard}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Contact
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@digitalheroes.co.in"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                hello@digitalheroes.co.in
              </a>
              <a
                href="https://digitalheroes.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                digitalheroes.co.in
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Digital Heroes. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Built with <Heart className="h-3 w-3 text-primary mx-1" /> for charity
          </div>
        </div>
      </div>
    </footer>
  );
}
