import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchMoreLoans } from '@/lib/actions/loan'
import type { Loan, PaginationFilters } from '@/lib/types'

interface UsePaginatedLoanDataOptions {
  initialLoans: Loan[]
  initialTotal: number
  initialHasMore: boolean
  initialFilters: PaginationFilters
  currentFilters: PaginationFilters
  pageSize: number
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
  initialLoans,
  initialTotal,
  initialHasMore,
  initialFilters,
  currentFilters,
  pageSize,
  onReset,
}: UsePaginatedLoanDataOptions): UsePaginatedLoanDataReturn {
  const [loans, setLoans] = useState<Loan[]>(initialLoans)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const appliedFiltersRef = useRef<PaginationFilters>(initialFilters)

  // Reset data when filters change
  useEffect(() => {
    const filtersChanged =
      currentFilters.search !== appliedFiltersRef.current.search ||
      currentFilters.status !== appliedFiltersRef.current.status ||
      currentFilters.purpose !== appliedFiltersRef.current.purpose

    if (!filtersChanged) return

    appliedFiltersRef.current = currentFilters

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await fetchMoreLoans(0, pageSize, currentFilters)
        setLoans(result.loans)
        setHasMore(result.hasMore)
        setTotal(result.total)
        onReset?.()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentFilters, pageSize, onReset])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await fetchMoreLoans(loans.length, pageSize, appliedFiltersRef.current)
      setLoans((prev) => [...prev, ...result.loans])
      setHasMore(result.hasMore)
      setTotal(result.total)
    } finally {
      setIsLoading(false)
    }
  }, [loans.length, hasMore, isLoading, pageSize])

  return { loans, total, hasMore, isLoading, loadMore }
}
