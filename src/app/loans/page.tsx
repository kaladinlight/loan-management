import { Suspense } from 'react';
import { getLoans } from '@/lib/data/loans';
import { LoanDataTable } from '@/app/components/LoanDataTable';
import { LoanFilters } from '@/app/components/LoanFilters';
import { Card, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

interface LoansPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

async function LoansTableContent({
  searchParams,
}: {
  searchParams: LoansPageProps['searchParams'];
}): Promise<React.ReactElement> {
  const params = await searchParams;
  const loans = await getLoans({
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return (
    <>
      <div className="overflow-x-auto">
        <LoanDataTable loans={loans} />
      </div>
    </>
  );
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
  );
}

export default function LoansPage({ searchParams }: LoansPageProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
      </div>

      <Suspense fallback={null}>
        <LoanFilters />
      </Suspense>

      <Card>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <LoansTableContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
