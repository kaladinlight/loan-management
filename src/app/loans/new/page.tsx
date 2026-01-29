import Link from 'next/link';
import { createLoan } from '@/lib/actions/loan';
import { LoanForm } from '@/app/components/LoanForm';
import { Button } from '@/app/components/ui/button';

export default function NewLoanPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/loans">← Back to Loans</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Loan</h1>
        <p className="text-muted-foreground">Add a new loan to the system</p>
      </div>

      <LoanForm action={createLoan} submitLabel="Create Loan" />
    </div>
  );
}
