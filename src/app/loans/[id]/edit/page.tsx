import { notFound } from 'next/navigation'

import { LoanForm } from '@/app/components/LoanForm'
import { updateLoan } from '@/lib/actions/loan'
import { getLoanByNumber } from '@/lib/data/loans'
import type { ActionState } from '@/lib/types'

interface EditLoanPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLoanPage({ params }: EditLoanPageProps): Promise<React.ReactElement> {
  const { id: loanNumber } = await params
  const loan = await getLoanByNumber(loanNumber)

  if (!loan) {
    notFound()
  }

  const updateLoanWithId = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    'use server'
    return updateLoan(loan.id, prevState, formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Loan</h1>
      </div>

      <LoanForm loan={loan} action={updateLoanWithId} submitLabel="Save Changes" />
    </div>
  )
}
