import { prisma } from '@/lib/db';
import type { DashboardStats, LoanFilters, Loan } from '@/lib/types';
import { serializeLoan } from '@/lib/types';
import { LoanStatus, Prisma } from '@/generated/prisma/client';

export async function getDashboardStats(): Promise<DashboardStats> {
  const [loans, statusCounts] = await Promise.all([
    prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.loan.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { amount: true },
    }),
  ]);

  let totalLoans = 0;
  let totalPortfolioValue = 0;
  let pendingCount = 0;
  let activeCount = 0;
  let paidCount = 0;
  let defaultedCount = 0;

  for (const group of statusCounts) {
    const count = group._count.status;
    totalLoans += count;
    totalPortfolioValue += Number(group._sum.amount ?? 0);

    switch (group.status) {
      case LoanStatus.PENDING:
        pendingCount = count;
        break;
      case LoanStatus.ACTIVE:
        activeCount = count;
        break;
      case LoanStatus.PAID:
        paidCount = count;
        break;
      case LoanStatus.DEFAULTED:
        defaultedCount = count;
        break;
    }
  }

  return {
    totalLoans,
    totalPortfolioValue,
    pendingCount,
    activeCount,
    paidCount,
    defaultedCount,
    recentLoans: loans.map(serializeLoan),
  };
}

export async function getLoans(filters?: LoanFilters): Promise<Loan[]> {
  const where: Prisma.LoanWhereInput = {};

  if (filters?.search) {
    where.OR = [
      { borrowerName: { contains: filters.search, mode: 'insensitive' } },
      { loanNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters?.status) {
    where.status = filters.status as LoanStatus;
  }

  const orderBy: Prisma.LoanOrderByWithRelationInput = {};
  const sortBy = filters?.sortBy ?? 'createdAt';
  const sortOrder = filters?.sortOrder ?? 'desc';
  (orderBy as Record<string, string>)[sortBy] = sortOrder;

  const loans = await prisma.loan.findMany({ where, orderBy });
  return loans.map(serializeLoan);
}

export async function getLoanById(id: string): Promise<Loan | null> {
  const loan = await prisma.loan.findUnique({ where: { id } });
  return loan ? serializeLoan(loan) : null;
}

export async function getLoanByNumber(loanNumber: string): Promise<Loan | null> {
  const loan = await prisma.loan.findUnique({ where: { loanNumber } });
  return loan ? serializeLoan(loan) : null;
}
