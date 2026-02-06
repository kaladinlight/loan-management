import { Suspense } from 'react'

import { LoanDataTable } from '@/app/components/LoanDataTable'
import { LoanFilters } from '@/app/components/LoanFilters'
import { Card, CardContent } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'
import { LOAN_PAGE_SIZE } from '@/lib/constants'
import { getLoans } from '@/lib/data/loans'
import type { SortableColumn, SortOrder } from '@/lib/types/loans'

interface LoansPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    purpose?: string
    sortBy?: SortableColumn
    sortOrder?: SortOrder
  }>
}

async function LoansTableContent({
  searchParams,
}: {
  searchParams: LoansPageProps['searchParams']
}): Promise<React.ReactElement> {
  const params = await searchParams
  const { loans, total, hasMore } = await getLoans(0, LOAN_PAGE_SIZE, params)

  return <LoanDataTable initial={{ loans, total, hasMore }} />
}

function TableSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <div className="space-y-3">
        <div className="flex gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: 8 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-24" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoansPage({ searchParams }: LoansPageProps): React.ReactElement {
  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] min-h-0 gap-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
      </div>

      <div className="shrink-0">
        <Suspense fallback={null}>
          <LoanFilters />
        </Suspense>
      </div>

      <Card className="flex-1 min-h-0 flex flex-col">
        <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Suspense fallback={<TableSkeleton />}>
            <LoansTableContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
