import { describe, expect, it } from 'vitest'

import {
  calculateMonthlyPayment,
  calculateTotalRepayment,
  cn,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})

describe('formatCurrency', () => {
  it('formats whole numbers', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })

  it('formats decimals', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
  })
})

describe('formatCompactCurrency', () => {
  it('formats thousands as K', () => {
    expect(formatCompactCurrency(1500)).toBe('$1.50K')
  })

  it('formats millions as M', () => {
    expect(formatCompactCurrency(2500000)).toBe('$2.50M')
  })

  it('formats small numbers with decimals', () => {
    expect(formatCompactCurrency(500)).toBe('$500.00')
  })
})

describe('formatDate', () => {
  it('formats Date objects', () => {
    // Use explicit time to avoid timezone issues
    expect(formatDate(new Date('2024-03-15T12:00:00'))).toBe('Mar 15, 2024')
  })

  it('formats date strings', () => {
    expect(formatDate('2024-12-25T12:00:00')).toBe('Dec 25, 2024')
  })
})

describe('calculateMonthlyPayment', () => {
  it('calculates monthly payment correctly', () => {
    // $10,000 at 6% for 12 months
    const payment = calculateMonthlyPayment(10000, 6, 12)
    expect(payment).toBeCloseTo(860.66, 2)
  })

  it('handles zero interest rate', () => {
    const payment = calculateMonthlyPayment(12000, 0, 12)
    expect(payment).toBe(1000)
  })

  it('handles longer terms', () => {
    // $100,000 at 5% for 360 months (30 years)
    const payment = calculateMonthlyPayment(100000, 5, 360)
    expect(payment).toBeCloseTo(536.82, 2)
  })
})

describe('calculateTotalRepayment', () => {
  it('calculates total repayment correctly', () => {
    const total = calculateTotalRepayment(10000, 6, 12)
    expect(total).toBeCloseTo(10327.97, 1)
  })

  it('equals principal with zero interest', () => {
    const total = calculateTotalRepayment(12000, 0, 12)
    expect(total).toBe(12000)
  })
})
