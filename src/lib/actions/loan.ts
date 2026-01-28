'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { loanSchema } from '@/lib/schemas/loan';
import { generateLoanNumber } from '@/lib/utils';
import type { ActionState } from '@/lib/types';

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

  const count = await prisma.loan.count();
  const loanNumber = generateLoanNumber(count);

  const loan = await prisma.loan.create({
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
  redirect(`/loans/${loan.id}`);
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

  await prisma.loan.update({
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
  redirect(`/loans/${id}`);
}

export async function deleteLoan(id: string): Promise<ActionState> {
  await prisma.loan.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/loans');
  redirect('/loans');
}
