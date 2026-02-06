import { z } from 'zod'

export const loanSchema = z.object({
  purpose: z.enum(['PERSONAL', 'MORTGAGE', 'AUTO', 'BUSINESS', 'OTHER'], {
    error: 'Purpose is required',
  }),
  borrowerName: z
    .string({ error: 'Borrower name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  borrowerEmail: z.string({ error: 'Borrower email is required' }).email('Invalid email address'),
  amount: z.coerce
    .number({ error: 'Amount is required' })
    .positive('Amount must be greater than 0')
    .max(10_000_000, 'Amount cannot exceed 10,000,000'),
  interestRate: z.coerce
    .number({ error: 'Interest rate is required' })
    .min(0.01, 'Interest rate must be at least 0.01%')
    .max(100, 'Interest rate cannot exceed 100%'),
  term: z.coerce
    .number({ error: 'Term is required' })
    .int('Term must be a whole number')
    .min(1, 'Term must be at least 1 month')
    .max(360, 'Term cannot exceed 360 months'),
  status: z.enum(['PENDING', 'ACTIVE', 'PAID', 'DEFAULTED'], {
    error: 'Status is required',
  }),
  startDate: z.coerce.date({ error: 'Start date is required' }),
})

export type LoanFormData = z.infer<typeof loanSchema>
