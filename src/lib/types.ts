import { type Prisma } from '@/generated/prisma/client'

export type PrismaLoan = Prisma.LoanGetPayload<object>

export interface Loan {
  id: string
  loanNumber: string
  purpose: 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS' | 'OTHER'
  borrowerName: string
  borrowerEmail: string
  amount: number
  interestRate: number
  term: number
  status: 'PENDING' | 'ACTIVE' | 'PAID' | 'DEFAULTED'
  startDate: Date
  createdAt: Date
  updatedAt: Date
}

export function serializeLoan(loan: PrismaLoan): Loan {
  return {
    ...loan,
    amount: Number(loan.amount),
    interestRate: Number(loan.interestRate),
  }
}

export interface DashboardStats {
  totalLoans: number
  totalPortfolioValue: number
  pendingCount: number
  activeCount: number
  paidCount: number
  defaultedCount: number
  recentLoans: Loan[]
}

export interface ActionState {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export interface PaginationFilters {
  search?: string
  status?: string
  purpose?: string
}

export interface PaginatedLoansResult {
  loans: Loan[]
  total: number
  hasMore: boolean
}
