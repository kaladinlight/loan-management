import { LoanForm } from '@/app/components/LoanForm';
import { createLoan } from '@/lib/actions/loan';

export default function NewLoanPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Loan</h1>
      </div>

      <LoanForm action={createLoan} submitLabel="Create Loan" />
    </div>
  );
}
