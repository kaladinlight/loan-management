import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchMoreLoans } from '@/lib/actions/loan'
import { LOAN_PAGE_SIZE } from '@/lib/constants'
import type { Loan, PaginationFilters } from '@/lib/types'

interface InitialData {
  loans: Loan[]
  total: number
  hasMore: boolean
}

interface UsePaginatedLoanDataOptions {
  initial: InitialData
  filters: PaginationFilters
  onReset?: () => void
}

interface UsePaginatedLoanDataReturn {
  loans: Loan[]
  total: number
  hasMore: boolean
  isLoading: boolean
  loadMore: () => Promise<void>
}

export function usePaginatedLoanData({
  initial,
  filters,
  onReset,
}: UsePaginatedLoanDataOptions): UsePaginatedLoanDataReturn {
  const [loans, setLoans] = useState<Loan[]>(initial.loans)
  const [total, setTotal] = useState(initial.total)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [isLoading, setIsLoading] = useState(false)
  const appliedFiltersRef = useRef<PaginationFilters>(filters)

  // Reset data when filters change
  useEffect(() => {
    const prev = appliedFiltersRef.current
    const changed =
      filters.search !== prev.search ||
      filters.status !== prev.status ||
      filters.purpose !== prev.purpose ||
      filters.sortBy !== prev.sortBy ||
      filters.sortOrder !== prev.sortOrder

    if (!changed) return

    appliedFiltersRef.current = filters

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await fetchMoreLoans(0, LOAN_PAGE_SIZE, filters)
        setLoans(result.loans)
        setHasMore(result.hasMore)
        setTotal(result.total)
        onReset?.()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters, onReset])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await fetchMoreLoans(loans.length, LOAN_PAGE_SIZE, appliedFiltersRef.current)
      setLoans((prev) => [...prev, ...result.loans])
      setHasMore(result.hasMore)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }, [loans.length, hasMore, isLoading])

  return { loans, total, hasMore, isLoading, loadMore }
}
