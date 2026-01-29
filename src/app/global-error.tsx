'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): React.ReactElement {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-4 text-gray-500 max-w-md">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          {error.digest && <p className="mt-2 text-xs text-gray-400">Error ID: {error.digest}</p>}
          <div className="mt-6">
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
