import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLoanByNumber } from '@/lib/data/loans';
import { formatCurrency, formatDate, calculateMonthlyPayment, calculateTotalRepayment } from '@/lib/utils';
import { LoanStatusBadge } from '@/app/components/LoanStatusBadge';
import { DeleteLoanDialog } from '@/app/components/DeleteLoanDialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

interface LoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps): Promise<React.ReactElement> {
  const { id: loanNumber } = await params;
  const loan = await getLoanByNumber(loanNumber);

  if (!loan) {
    notFound();
  }

  const monthlyPayment = calculateMonthlyPayment(loan.amount, loan.interestRate, loan.term);
  const totalRepayment = calculateTotalRepayment(loan.amount, loan.interestRate, loan.term);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/loans">← Back to Loans</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{loan.loanNumber}</h1>
            <LoanStatusBadge status={loan.status} />
          </div>
          <p className="text-muted-foreground mt-1">{loan.borrowerName}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/loans/${loan.loanNumber}/edit`}>Edit</Link>
          </Button>
          <DeleteLoanDialog loanId={loan.id} loanNumber={loan.loanNumber} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Borrower Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{loan.borrowerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">
                <a href={`mailto:${loan.borrowerEmail}`} className="hover:underline text-primary">
                  {loan.borrowerEmail}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium capitalize">{loan.purpose.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <LoanStatusBadge status={loan.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(loan.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="font-medium">{loan.term} months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Loan amount and payment calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Principal Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-2xl font-bold">{loan.interestRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Repayment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRepayment)}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <span>Total Interest: </span>
                <span className="font-medium text-foreground">{formatCurrency(totalRepayment - loan.amount)}</span>
              </div>
              <div>
                <span>Created: </span>
                <span className="font-medium text-foreground">{formatDate(loan.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
