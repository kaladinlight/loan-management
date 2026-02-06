import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { Header } from '@/app/components/Header';
import { ThemeProvider } from '@/app/components/ThemeProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Loan Management',
  description: 'An application for creating, viewing, and managing loans',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="container mx-auto px-4 py-8 flex-1 flex flex-col overflow-auto">{children}</main>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
