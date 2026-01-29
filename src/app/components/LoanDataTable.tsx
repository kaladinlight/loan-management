'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LoanStatusBadge } from '@/app/components/LoanStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import type { Loan } from '@/lib/types';

interface LoanDataTableProps {
  loans: Loan[];
}

type SortableColumn = 'loanNumber' | 'borrowerName' | 'amount' | 'interestRate' | 'term' | 'startDate';

const SORTABLE_COLUMNS: { key: SortableColumn; label: string; align?: 'right' }[] = [
  { key: 'loanNumber', label: 'Loan Number' },
  { key: 'borrowerName', label: 'Borrower Name' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'interestRate', label: 'Interest Rate', align: 'right' },
  { key: 'term', label: 'Term', align: 'right' },
  { key: 'startDate', label: 'Start Date' },
];

export function LoanDataTable({ loans }: LoanDataTableProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy') ?? 'createdAt';
  const currentSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc';

  const handleSort = (column: SortableColumn): void => {
    const params = new URLSearchParams(searchParams.toString());
    const newOrder = currentSortBy === column && currentSortOrder === 'asc' ? 'desc' : 'asc';
    params.set('sortBy', column);
    params.set('sortOrder', newOrder);
    router.push(`/loans?${params.toString()}`);
  };

  const getSortIndicator = (column: SortableColumn): string => {
    if (currentSortBy !== column) return '';
    return currentSortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No loans found</p>
        <p className="mt-1">Create your first loan to get started.</p>
        <Button asChild className="mt-4">
          <Link href="/loans/new">Create Loan</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {SORTABLE_COLUMNS.slice(0, 2).map((col) => (
            <TableHead key={col.key}>
              <button
                onClick={() => handleSort(col.key)}
                className="font-medium hover:text-foreground transition-colors"
                aria-label={`Sort by ${col.label}`}
              >
                {col.label}
                {getSortIndicator(col.key)}
              </button>
            </TableHead>
          ))}
          <TableHead>Purpose</TableHead>
          {SORTABLE_COLUMNS.slice(2, 5).map((col) => (
            <TableHead key={col.key} className={col.align === 'right' ? 'text-right' : ''}>
              <button
                onClick={() => handleSort(col.key)}
                className="font-medium hover:text-foreground transition-colors"
                aria-label={`Sort by ${col.label}`}
              >
                {col.label}
                {getSortIndicator(col.key)}
              </button>
            </TableHead>
          ))}
          <TableHead>Status</TableHead>
          <TableHead>
            <button
              onClick={() => handleSort('startDate')}
              className="font-medium hover:text-foreground transition-colors"
              aria-label="Sort by Start Date"
            >
              Start Date
              {getSortIndicator('startDate')}
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell>
              <Link href={`/loans/${loan.id}`} className="font-medium hover:underline">
                {loan.loanNumber}
              </Link>
            </TableCell>
            <TableCell>{loan.borrowerName}</TableCell>
            <TableCell className="capitalize">{loan.purpose.toLowerCase()}</TableCell>
            <TableCell className="text-right">{formatCurrency(loan.amount)}</TableCell>
            <TableCell className="text-right">{loan.interestRate.toFixed(2)}%</TableCell>
            <TableCell className="text-right">{loan.term} mo</TableCell>
            <TableCell>
              <LoanStatusBadge status={loan.status} />
            </TableCell>
            <TableCell>{formatDate(loan.startDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
