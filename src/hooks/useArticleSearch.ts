import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchArticles } from "@/lib/api/mock"

function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)
  }, [value, delayMs])

  return debouncedValue
}

export function useArticleSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300)
  const isDebouncing = query !== debouncedQuery

  const result = useQuery({
    queryKey: ["articles", debouncedQuery],
    queryFn: () => searchArticles(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  })

  return {
    ...result,
    isLoading: result.isLoading || isDebouncing,
  }
}
