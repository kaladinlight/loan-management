import Link from 'next/link';
import { getDashboardStats } from '@/lib/data/loans';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@/app/components/StatCard';
import { LoanStatusBadge } from '@/app/components/LoanStatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';

export default async function DashboardPage(): Promise<React.ReactElement> {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your loan portfolio</p>
        </div>
        <Button asChild>
          <Link href="/loans/new">Create Loan</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Loans" value={stats.totalLoans} description="Total number of loans" />
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(stats.totalPortfolioValue)}
          description="Total outstanding amount"
        />
        <StatCard
          title="Active Loans"
          value={stats.activeCount}
          description={`${stats.pendingCount} pending approval`}
        />
        <StatCard
          title="Loan Performance"
          value={`${stats.paidCount} paid`}
          description={`${stats.defaultedCount} defaulted`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Loans</CardTitle>
          <CardDescription>Latest 5 loans in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentLoans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No loans yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/loans/new">Create your first loan</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Number</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentLoans.map((loan) => (
                  <TableRow key={loan.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/loans/${loan.id}`} className="font-medium hover:underline">
                        {loan.loanNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{loan.borrowerName}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>
                      <LoanStatusBadge status={loan.status} />
                    </TableCell>
                    <TableCell>{formatDate(loan.startDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/loans">View All Loans</Link>
        </Button>
      </div>
    </div>
  );
}
