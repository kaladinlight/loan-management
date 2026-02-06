import { describe, expect, it } from 'vitest'

import { loanSchema } from './loan'

const validLoan = {
  purpose: 'PERSONAL',
  borrowerName: 'John Doe',
  borrowerEmail: 'john@example.com',
  amount: 10000,
  interestRate: 5.5,
  term: 12,
  status: 'PENDING',
  startDate: new Date('2024-01-15'),
}

describe('loanSchema', () => {
  it('validates a correct loan', () => {
    const result = loanSchema.safeParse(validLoan)
    expect(result.success).toBe(true)
  })

  it('coerces string numbers', () => {
    const result = loanSchema.safeParse({
      ...validLoan,
      amount: '15000',
      interestRate: '6.5',
      term: '24',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.amount).toBe(15000)
      expect(result.data.interestRate).toBe(6.5)
      expect(result.data.term).toBe(24)
    }
  })

  it('coerces date strings', () => {
    const result = loanSchema.safeParse({
      ...validLoan,
      startDate: '2024-06-01',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date)
    }
  })

  describe('borrowerName', () => {
    it('rejects names shorter than 2 characters', () => {
      const result = loanSchema.safeParse({ ...validLoan, borrowerName: 'A' })
      expect(result.success).toBe(false)
    })

    it('rejects names longer than 100 characters', () => {
      const result = loanSchema.safeParse({ ...validLoan, borrowerName: 'A'.repeat(101) })
      expect(result.success).toBe(false)
    })
  })

  describe('borrowerEmail', () => {
    it('rejects invalid emails', () => {
      const result = loanSchema.safeParse({ ...validLoan, borrowerEmail: 'not-an-email' })
      expect(result.success).toBe(false)
    })
  })

  describe('amount', () => {
    it('rejects zero', () => {
      const result = loanSchema.safeParse({ ...validLoan, amount: 0 })
      expect(result.success).toBe(false)
    })

    it('rejects negative values', () => {
      const result = loanSchema.safeParse({ ...validLoan, amount: -1000 })
      expect(result.success).toBe(false)
    })

    it('rejects amounts exceeding 10 million', () => {
      const result = loanSchema.safeParse({ ...validLoan, amount: 10_000_001 })
      expect(result.success).toBe(false)
    })
  })

  describe('interestRate', () => {
    it('rejects rates below 0.01%', () => {
      const result = loanSchema.safeParse({ ...validLoan, interestRate: 0 })
      expect(result.success).toBe(false)
    })

    it('rejects rates above 100%', () => {
      const result = loanSchema.safeParse({ ...validLoan, interestRate: 101 })
      expect(result.success).toBe(false)
    })
  })

  describe('term', () => {
    it('rejects zero months', () => {
      const result = loanSchema.safeParse({ ...validLoan, term: 0 })
      expect(result.success).toBe(false)
    })

    it('rejects terms exceeding 360 months', () => {
      const result = loanSchema.safeParse({ ...validLoan, term: 361 })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer terms', () => {
      const result = loanSchema.safeParse({ ...validLoan, term: 12.5 })
      expect(result.success).toBe(false)
    })
  })

  describe('purpose', () => {
    it('accepts valid purposes', () => {
      for (const purpose of ['PERSONAL', 'MORTGAGE', 'AUTO', 'BUSINESS', 'OTHER']) {
        const result = loanSchema.safeParse({ ...validLoan, purpose })
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid purposes', () => {
      const result = loanSchema.safeParse({ ...validLoan, purpose: 'INVALID' })
      expect(result.success).toBe(false)
    })
  })

  describe('status', () => {
    it('accepts valid statuses', () => {
      for (const status of ['PENDING', 'ACTIVE', 'PAID', 'DEFAULTED']) {
        const result = loanSchema.safeParse({ ...validLoan, status })
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid statuses', () => {
      const result = loanSchema.safeParse({ ...validLoan, status: 'CANCELLED' })
      expect(result.success).toBe(false)
    })
  })
})
