'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LoanDetailError({ error, reset }: ErrorProps): React.ReactElement {
  useEffect(() => {
    console.error('Loan detail error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-4 text-gray-500 max-w-md">An error occurred while loading the loan details. Please try again.</p>
      {error.digest && <p className="mt-2 text-xs text-gray-400">Error ID: {error.digest}</p>}
      <div className="mt-6 flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button asChild variant="outline">
          <Link href="/loans">Back to Loans</Link>
        </Button>
      </div>
    </div>
  );
}
