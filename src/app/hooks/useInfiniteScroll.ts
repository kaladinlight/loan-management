import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions<S extends HTMLElement> {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  rootMargin?: string
  scrollContainerRef?: RefObject<S | null>
}

interface UseInfiniteScrollReturn<T extends HTMLElement, S extends HTMLElement> {
  sentinelRef: RefObject<T | null>
  scrollContainerRef: RefObject<S | null>
}

export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement, S extends HTMLElement = HTMLDivElement>({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '100px',
  scrollContainerRef: externalScrollContainerRef,
}: UseInfiniteScrollOptions<S>): UseInfiniteScrollReturn<T, S> {
  const sentinelRef = useRef<T>(null)
  const internalScrollContainerRef = useRef<S>(null)
  const scrollContainerRef = externalScrollContainerRef ?? internalScrollContainerRef

  useEffect(() => {
    const sentinel = sentinelRef.current
    const scrollContainer = scrollContainerRef.current
    if (!sentinel || !scrollContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        const hasScrolled = scrollContainer.scrollTop > 0
        if (entries[0].isIntersecting && hasMore && !isLoading && hasScrolled) {
          onLoadMore()
        }
      },
      { root: scrollContainer, rootMargin },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, rootMargin, scrollContainerRef])

  return { sentinelRef, scrollContainerRef }
}
