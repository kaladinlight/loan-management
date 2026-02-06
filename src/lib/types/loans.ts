import type { LoanPurpose, LoanStatus, Prisma } from '@/generated/prisma/client'

export type PrismaLoan = Prisma.LoanGetPayload<object>

export interface Loan {
  id: string
  loanNumber: string
  purpose: LoanPurpose
  borrowerName: string
  borrowerEmail: string
  amount: number
  interestRate: number
  term: number
  status: LoanStatus
  startDate: Date
  createdAt: Date
  updatedAt: Date
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

export type SortableColumn =
  | 'loanNumber'
  | 'borrowerName'
  | 'amount'
  | 'interestRate'
  | 'term'
  | 'startDate'
  | 'createdAt'

export type SortOrder = 'asc' | 'desc'

export interface PaginationFilters {
  search?: string
  status?: string
  purpose?: string
  sortBy?: SortableColumn
  sortOrder?: SortOrder
}

export interface PaginatedLoansResult {
  loans: Loan[]
  total: number
  hasMore: boolean
}
