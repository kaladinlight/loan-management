import Link from 'next/link'

import { Button } from '@/app/components/ui/button'

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-2 text-gray-500 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/loans">View Loans</Link>
        </Button>
      </div>
    </div>
  )
}
