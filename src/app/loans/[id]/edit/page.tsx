import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLoanByNumber } from '@/lib/data/loans';
import { updateLoan } from '@/lib/actions/loan';
import { LoanForm } from '@/app/components/LoanForm';
import { Button } from '@/app/components/ui/button';
import type { ActionState } from '@/lib/types';

interface EditLoanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLoanPage({ params }: EditLoanPageProps): Promise<React.ReactElement> {
  const { id: loanNumber } = await params;
  const loan = await getLoanByNumber(loanNumber);

  if (!loan) {
    notFound();
  }

  const updateLoanWithId = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    'use server';
    return updateLoan(loan.id, prevState, formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/loans/${loan.loanNumber}`}>← Back to Loan Details</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Loan</h1>
        <p className="text-muted-foreground">Update loan {loan.loanNumber}</p>
      </div>

      <LoanForm loan={loan} action={updateLoanWithId} submitLabel="Save Changes" />
    </div>
  );
}
