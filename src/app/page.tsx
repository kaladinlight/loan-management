import Link from 'next/link'

import { LoanStatusBadge } from '@/app/components/LoanStatusBadge'
import { StatCard } from '@/app/components/StatCard'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { getDashboardStats } from '@/lib/data/loans'
import { formatCompactCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(): Promise<React.ReactElement> {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-4 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard title="Total Loans" value={stats.totalLoans} description="Total number of loans" />
        <StatCard
          title="Portfolio Value"
          value={formatCompactCurrency(stats.totalPortfolioValue)}
          description="Total outstanding"
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Loan Number</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentLoans.map((loan) => (
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
                      <TableCell>{formatCompactCurrency(loan.amount)}</TableCell>
                      <TableCell>
                        <LoanStatusBadge status={loan.status} />
                      </TableCell>
                      <TableCell>{formatDate(loan.startDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
