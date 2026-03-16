import { Link } from "react-router-dom"

const challenges = [
  { path: "/notifications", title: "1. Notifications", description: "Toast notification system" },
  { path: "/search", title: "2. Search", description: "Article search with live API results" },
  { path: "/profile", title: "3. Profile Dashboard", description: "Component rendering & re-render discussion" },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Code Review Challenges</h1>
      <p className="mb-8 text-muted-foreground">
        Each component below contains intentional bugs and anti-patterns.
        Review the code and identify the issues.
      </p>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <Link
            key={challenge.path}
            to={challenge.path}
            className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <h2 className="font-semibold text-foreground">{challenge.title}</h2>
            <p className="text-sm text-muted-foreground">
              {challenge.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
