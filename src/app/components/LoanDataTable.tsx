'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LoanStatusBadge } from '@/app/components/LoanStatusBadge';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { fetchMoreLoans } from '@/lib/actions/loan';
import type { Loan, PaginationFilters } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const PAGE_SIZE = 20;

interface LoanDataTableProps {
  initialLoans: Loan[];
  initialTotal: number;
  initialHasMore: boolean;
  initialFilters: PaginationFilters;
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

export function LoanDataTable({
  initialLoans,
  initialTotal,
  initialHasMore,
  initialFilters,
}: LoanDataTableProps): React.ReactElement {
  const searchParams = useSearchParams();

  const [allLoans, setAllLoans] = useState<Loan[]>(initialLoans);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [currentFilters, setCurrentFilters] = useState<PaginationFilters>(initialFilters);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentSortBy = searchParams.get('sortBy');
  const currentSortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;
  const searchTerm = searchParams.get('search') ?? '';
  const statusFilter = searchParams.get('status') ?? '';
  const purposeFilter = searchParams.get('purpose') ?? '';

  // Reset data when filters change
  useEffect(() => {
    const newFilters: PaginationFilters = {
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      purpose: purposeFilter || undefined,
    };

    const filtersChanged =
      newFilters.search !== currentFilters.search ||
      newFilters.status !== currentFilters.status ||
      newFilters.purpose !== currentFilters.purpose;

    if (filtersChanged) {
      setCurrentFilters(newFilters);
      setIsLoading(true);

      fetchMoreLoans(0, PAGE_SIZE, newFilters)
        .then((result) => {
          setAllLoans(result.loans);
          setHasMore(result.hasMore);
          setTotal(result.total);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Scroll to top when filters change
      scrollContainerRef.current?.scrollTo(0, 0);
    }
  }, [searchTerm, statusFilter, purposeFilter, currentFilters]);

  // Client-side sorting only (no filtering - server handles that)
  const sortedLoans = useMemo(() => {
    const result = [...allLoans];

    const sortBy = currentSortBy ?? 'createdAt';
    const sortOrder = currentSortOrder ?? 'desc';

    result.sort((a, b) => {
      let aVal: string | number | Date = a[sortBy as keyof Loan] as string | number | Date;
      let bVal: string | number | Date = b[sortBy as keyof Loan] as string | number | Date;

      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allLoans, currentSortBy, currentSortOrder]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await fetchMoreLoans(allLoans.length, PAGE_SIZE, currentFilters);
      setAllLoans((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const newLoans = result.loans.filter((l) => !existingIds.has(l.id));
        return [...prev, ...newLoans];
      });
      setHasMore(result.hasMore);
      setTotal(result.total);
    } finally {
      setIsLoading(false);
    }
  }, [allLoans.length, hasMore, isLoading, currentFilters]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!sentinel || !scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { root: scrollContainer, rootMargin: '100px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const handleSort = (column: SortableColumn): void => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortBy !== column) {
      params.set('sortBy', column);
      params.set('sortOrder', 'asc');
    } else if (currentSortOrder === 'asc') {
      params.set('sortBy', column);
      params.set('sortOrder', 'desc');
    } else {
      params.delete('sortBy');
      params.delete('sortOrder');
    }

    window.history.replaceState(null, '', `/loans?${params.toString()}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getSortIndicator = (column: string): React.ReactNode => {
    const isActive = currentSortBy === column;
    return (
      <span className="ml-1 inline-flex flex-col leading-[0.5] text-[0.6em] align-middle">
        <span className={isActive && currentSortOrder === 'asc' ? '' : 'text-muted-foreground/40'}>↑</span>
        <span className={isActive && currentSortOrder === 'desc' ? '' : 'text-muted-foreground/40'}>↓</span>
      </span>
    );
  };

  if (allLoans.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No loans found</p>
        <p className="mt-1">
          {searchTerm || statusFilter || purposeFilter
            ? 'Try adjusting your filters.'
            : 'Create your first loan to get started.'}
        </p>
        {!searchTerm && !statusFilter && !purposeFilter && (
          <Button asChild className="mt-4">
            <Link href="/loans/new">Create Loan</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="text-sm text-muted-foreground mb-4 shrink-0">
        Showing {sortedLoans.length} of {total} loans
        {hasMore && ' (scroll for more)'}
      </div>
      <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-auto scrollbar-thin">
        <Table wrapper={false}>
          <TableHeader className="sticky top-0 bg-background z-10">
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
            {sortedLoans.map((loan) => (
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

        <div ref={sentinelRef} className="py-4 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading...</span>
            </div>
          )}
          {!hasMore && allLoans.length > 0 && !isLoading && (
            <span className="text-sm text-muted-foreground">All loans loaded</span>
          )}
        </div>
      </div>
    </div>
  );
}
