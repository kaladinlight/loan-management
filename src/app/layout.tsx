import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/app/components/Header';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Loan Management',
  description: 'A full-stack application for creating, viewing, and managing loans',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background h-screen flex flex-col overflow-hidden`}>
        <ThemeProvider>
          <Header />
          <main className="container mx-auto px-4 py-8 flex-1 overflow-hidden flex flex-col">{children}</main>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
