import { Prisma } from '@/generated/prisma/client';

export type Loan = Prisma.LoanGetPayload<object>;

export interface DashboardStats {
  totalLoans: number;
  totalPortfolioValue: number;
  pendingCount: number;
  activeCount: number;
  paidCount: number;
  defaultedCount: number;
  recentLoans: Loan[];
}

export interface LoanFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
