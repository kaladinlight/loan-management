'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useRef } from 'react'

import { LoanStatusBadge } from '@/app/components/LoanStatusBadge'
import { Button } from '@/app/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { usePaginatedLoanData } from '@/app/hooks/usePaginatedLoanData'
import type { Loan, PaginationFilters, SortableColumn, SortOrder } from '@/lib/types/loan'
import { formatCurrency, formatDate } from '@/lib/utils'

interface LoanDataTableProps {
  initial: {
    loans: Loan[]
    total: number
    hasMore: boolean
  }
}

const COLUMNS: { key: SortableColumn | 'purpose' | 'status'; label: string; sortable: boolean; align?: 'right' }[] = [
  { key: 'loanNumber', label: 'Loan Number', sortable: true },
  { key: 'borrowerName', label: 'Borrower', sortable: true },
  { key: 'purpose', label: 'Purpose', sortable: false },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { key: 'interestRate', label: 'Rate', sortable: true, align: 'right' },
  { key: 'term', label: 'Term', sortable: true, align: 'right' },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'startDate', label: 'Start Date', sortable: true },
]

export function LoanDataTable({ initial }: LoanDataTableProps): React.ReactElement {
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const filters: PaginationFilters = useMemo(
    () => ({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      purpose: searchParams.get('purpose') ?? undefined,
      sortBy: (searchParams.get('sortBy') as SortableColumn) ?? undefined,
      sortOrder: (searchParams.get('sortOrder') as SortOrder) ?? undefined,
    }),
    [searchParams],
  )

  const handleReset = useMemo(
    () => () => {
      scrollContainerRef.current?.scrollTo(0, 0)
    },
    [],
  )

  const { loans, total, hasMore, isLoading, loadMore } = usePaginatedLoanData({
    initial,
    filters,
    onReset: handleReset,
  })

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
    scrollContainerRef,
  })

  const handleSort = (column: SortableColumn): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (filters.sortBy !== column) {
      params.set('sortBy', column)
      params.set('sortOrder', 'asc')
    } else if (filters.sortOrder === 'asc') {
      params.set('sortBy', column)
      params.set('sortOrder', 'desc')
    } else {
      params.delete('sortBy')
      params.delete('sortOrder')
    }

    window.history.replaceState(null, '', `/loans?${params.toString()}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const getSortIndicator = (column: string): React.ReactNode => {
    const isActive = filters.sortBy === column
    return (
      <span className="ml-1 inline-flex flex-col leading-[0.5] text-[0.6em] align-middle">
        <span className={isActive && filters.sortOrder === 'asc' ? '' : 'text-muted-foreground/40'}>↑</span>
        <span className={isActive && filters.sortOrder === 'desc' ? '' : 'text-muted-foreground/40'}>↓</span>
      </span>
    )
  }

  const hasActiveFilters = filters.search || filters.status || filters.purpose

  if (loans.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No loans found</p>
        <p className="mt-1">
          {hasActiveFilters ? 'Try adjusting your filters.' : 'Create your first loan to get started.'}
        </p>
        {!hasActiveFilters && (
          <Button asChild className="mt-4">
            <Link href="/loans/new">Create Loan</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="text-sm text-muted-foreground mb-4 shrink-0">
        Showing {loans.length} of {total} loans
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

        <div ref={sentinelRef} className="py-4 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading...</span>
            </div>
          )}
          {!hasMore && loans.length > 0 && !isLoading && (
            <span className="text-sm text-muted-foreground">All loans loaded</span>
          )}
        </div>
      </div>
    </div>
  )
}
