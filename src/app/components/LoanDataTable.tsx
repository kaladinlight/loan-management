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

const COLUMNS: { key: SortableColumn | 'purpose' | 'status'; label: string; sortable: boolean; align?: 'right' }[] = [
  { key: 'loanNumber', label: 'Loan Number', sortable: true },
  { key: 'borrowerName', label: 'Borrower', sortable: true },
  { key: 'purpose', label: 'Purpose', sortable: false },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { key: 'interestRate', label: 'Rate', sortable: true, align: 'right' },
  { key: 'term', label: 'Term', sortable: true, align: 'right' },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'startDate', label: 'Start Date', sortable: true },
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

  const getSortIndicator = (column: string): string => {
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
        <TableRow className="hover:bg-transparent">
          {COLUMNS.map((col) => (
            <TableHead key={col.key} className={col.align === 'right' ? 'text-right' : ''}>
              {col.sortable ? (
                <button
                  onClick={() => handleSort(col.key as SortableColumn)}
                  className="font-medium hover:text-foreground transition-colors cursor-pointer"
                >
                  {col.label}
                  {getSortIndicator(col.key)}
                </button>
              ) : (
                col.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id} className="relative hover:bg-muted/50 transition-colors cursor-pointer">
            <TableCell>
              <Link
                href={`/loans/${loan.loanNumber}`}
                className="font-medium text-primary hover:underline after:absolute after:inset-0"
              >
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
