import Link from 'next/link';

export function Header(): React.ReactElement {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            Loan Management
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/loans" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Loans
            </Link>
            <Link
              href="/loans/new"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              New Loan
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
