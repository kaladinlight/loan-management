import { type LoanPurpose, LoanStatus, type Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/db'
import type { DashboardStats, Loan, PaginatedLoansResult, PaginationFilters } from '@/lib/types'
import { serializeLoan } from '@/lib/types'

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
  ])

  let totalLoans = 0
  let totalPortfolioValue = 0
  let pendingCount = 0
  let activeCount = 0
  let paidCount = 0
  let defaultedCount = 0

  for (const group of statusCounts) {
    const count = group._count.status
    totalLoans += count
    totalPortfolioValue += Number(group._sum.amount ?? 0)

    switch (group.status) {
      case LoanStatus.PENDING:
        pendingCount = count
        break
      case LoanStatus.ACTIVE:
        activeCount = count
        break
      case LoanStatus.PAID:
        paidCount = count
        break
      case LoanStatus.DEFAULTED:
        defaultedCount = count
        break
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
  }
}

export async function getLoanByNumber(loanNumber: string): Promise<Loan | null> {
  const loan = await prisma.loan.findUnique({ where: { loanNumber } })
  return loan ? serializeLoan(loan) : null
}

export async function getLoans(
  offset: number,
  limit: number,
  filters?: PaginationFilters,
): Promise<PaginatedLoansResult> {
  const where: Prisma.LoanWhereInput = {}

  if (filters?.search) {
    where.OR = [
      { borrowerName: { contains: filters.search, mode: 'insensitive' } },
      { loanNumber: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters?.status) {
    where.status = filters.status as LoanStatus
  }

  if (filters?.purpose) {
    where.purpose = filters.purpose as LoanPurpose
  }

  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.loan.count({ where }),
  ])

  return {
    loans: loans.map(serializeLoan),
    total,
    hasMore: offset + loans.length < total,
  }
}
