'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export function Header(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          <Link href="/" className="text-xl font-semibold hover:text-muted-foreground transition-colors">
            Loan Management
          </Link>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/loans"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Loans
            </Link>
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/loans/new">New Loan</Link>
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            <Link
              href="/loans"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              Loans
            </Link>
            <Button asChild className="w-full" size="sm">
              <Link href="/loans/new" onClick={() => setIsMenuOpen(false)}>
                New Loan
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
