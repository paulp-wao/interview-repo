import { useState } from "react"
import { useArticleSearch } from "@/hooks/useArticleSearch"

export default function Search() {
  const [query, setQuery] = useState("")
  const { data: results = [], isLoading } = useArticleSearch(query)

  const resultCount = results.length

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Article Search</h1>

      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 w-full rounded-md border border-input bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />

      <p className="mb-4 text-sm text-muted-foreground">
        {isLoading ? "Searching..." : `${resultCount} results found`}
      </p>

      <ul className="space-y-2">
        {results.map((result) => (
          <li
            key={result.id}
            className="rounded-md border border-border bg-card p-4"
          >
            <h3 className="font-medium text-card-foreground">{result.title}</h3>
            <span className="text-sm text-muted-foreground">
              {result.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
