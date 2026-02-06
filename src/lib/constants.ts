import type { LoanPurpose, LoanStatus } from '@/generated/prisma/client'

export const LOAN_PAGE_SIZE = 20

const LOAN_PURPOSE_LABELS: Record<LoanPurpose, string> = {
  PERSONAL: 'Personal',
  MORTGAGE: 'Mortgage',
  AUTO: 'Auto',
  BUSINESS: 'Business',
  OTHER: 'Other',
}

const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  PAID: 'Paid',
  DEFAULTED: 'Defaulted',
}

export const LOAN_PURPOSE_OPTIONS = Object.entries(LOAN_PURPOSE_LABELS).map(([value, label]) => ({
  value: value as LoanPurpose,
  label,
}))

export const LOAN_STATUS_OPTIONS = Object.entries(LOAN_STATUS_LABELS).map(([value, label]) => ({
  value: value as LoanStatus,
  label,
}))
