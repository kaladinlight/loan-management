'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getLoans } from '@/lib/data/loans';
import { prisma } from '@/lib/db';
import { loanSchema } from '@/lib/schemas/loan';
import type { ActionState, PaginatedLoansResult, PaginationFilters } from '@/lib/types';

async function getNextLoanNumber(): Promise<string> {
  const result = await prisma.$queryRaw<[{ nextval: bigint }]>`SELECT nextval('loan_number_seq')`;
  const nextVal = Number(result[0].nextval);
  return `LN-${nextVal}`;
}

export async function createLoan(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());
  const result = loanSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false, fieldErrors };
  }

  const loanNumber = await getNextLoanNumber();

  await prisma.loan.create({
    data: {
      loanNumber,
      purpose: result.data.purpose,
      borrowerName: result.data.borrowerName,
      borrowerEmail: result.data.borrowerEmail,
      amount: result.data.amount,
      interestRate: result.data.interestRate,
      term: result.data.term,
      status: result.data.status,
      startDate: result.data.startDate,
    },
  });

  revalidatePath('/');
  revalidatePath('/loans');
  redirect(`/loans/${loanNumber}`);
}

export async function updateLoan(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());
  const result = loanSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { success: false, fieldErrors };
  }

  const loan = await prisma.loan.update({
    where: { id },
    data: {
      purpose: result.data.purpose,
      borrowerName: result.data.borrowerName,
      borrowerEmail: result.data.borrowerEmail,
      amount: result.data.amount,
      interestRate: result.data.interestRate,
      term: result.data.term,
      status: result.data.status,
      startDate: result.data.startDate,
    },
  });

  revalidatePath('/');
  revalidatePath('/loans');
  redirect(`/loans/${loan.loanNumber}`);
}

export async function deleteLoan(id: string): Promise<void> {
  await prisma.loan.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/loans');
  redirect('/loans');
}

export async function fetchMoreLoans(
  offset: number,
  limit: number,
  filters?: PaginationFilters,
): Promise<PaginatedLoansResult> {
  return getLoans(offset, limit, filters);
}
