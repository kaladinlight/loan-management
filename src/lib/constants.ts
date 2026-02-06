export const LOAN_PURPOSE_OPTIONS = [
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'MORTGAGE', label: 'Mortgage' },
  { value: 'AUTO', label: 'Auto' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OTHER', label: 'Other' },
] as const

export const LOAN_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAID', label: 'Paid' },
  { value: 'DEFAULTED', label: 'Defaulted' },
] as const
