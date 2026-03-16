// Simulated network delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------- Search API ----------

const searchItems = [
  { id: 1, title: "React Hooks Deep Dive", category: "Frontend" },
  { id: 2, title: "Node.js Performance Tuning", category: "Backend" },
  { id: 3, title: "TypeScript Advanced Patterns", category: "Frontend" },
  { id: 4, title: "PostgreSQL Query Optimization", category: "Database" },
  { id: 5, title: "React Server Components", category: "Frontend" },
  { id: 6, title: "GraphQL Schema Design", category: "Backend" },
  { id: 7, title: "CSS Grid Layout Mastery", category: "Frontend" },
  { id: 8, title: "Redis Caching Strategies", category: "Backend" },
  { id: 9, title: "React Testing Best Practices", category: "Frontend" },
  { id: 10, title: "Docker Container Orchestration", category: "DevOps" },
  { id: 11, title: "REST API Design Principles", category: "Backend" },
  { id: 12, title: "React State Management", category: "Frontend" },
]

export async function searchArticles(query: string) {
  // Simulate variable latency — shorter queries are slower (simulates heavier search)
  const latency = Math.floor(Math.random() * 1500) + 500
  await delay(latency)

  if (!query.trim()) return []

  return searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  )
}

// ---------- Users API ----------

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "inactive" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Editor", status: "active" },
  { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "Admin", status: "active" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "inactive" },
]

export async function fetchUsers(): Promise<User[]> {
  await delay(300)
  return [...users]
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User> {
  await delay(500)

  // Simulate occasional failures
  if (Math.random() < 0.3) {
    throw new Error("Network error: failed to save user")
  }

  const index = users.findIndex((u) => u.id === id)
  if (index === -1) throw new Error("User not found")
  users[index] = { ...users[index], ...updates }
  return users[index]
}

// ---------- Feed API ----------

export interface Post {
  id: number
  author: string
  content: string
  likes: number
  timestamp: string
}

let postIdCounter = 100

function generatePosts(page: number, limit: number): Post[] {
  const posts: Post[] = []
  const authors = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
  const topics = [
    "Just deployed a new feature!",
    "Anyone else love TypeScript?",
    "Hot take: CSS is a programming language.",
    "Debugging in production again...",
    "Just finished a great book on system design.",
    "React 19 is amazing!",
    "Who else is at the conference?",
    "TIL about AbortController.",
    "Code review tip: read the tests first.",
    "Pair programming > solo debugging.",
  ]

  for (let i = 0; i < limit; i++) {
    posts.push({
      id: postIdCounter++,
      author: authors[Math.floor(Math.random() * authors.length)],
      content: topics[Math.floor(Math.random() * topics.length)],
      likes: Math.floor(Math.random() * 50),
      timestamp: new Date(Date.now() - (page * limit + i) * 3600000).toISOString(),
    })
  }

  return posts
}

export async function fetchPosts(page: number, limit = 10): Promise<{ posts: Post[]; hasMore: boolean }> {
  await delay(600)
  const posts = generatePosts(page, limit)
  return { posts, hasMore: page < 5 }
}

// ---------- Dashboard API ----------

export interface DashboardMetrics {
  activeUsers: number
  requestsPerSecond: number
  errorRate: number
  avgResponseTime: number
  topEndpoints: { path: string; count: number }[]
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(400)

  // Simulate occasional API failures
  if (Math.random() < 0.15) {
    throw new Error("Metrics service unavailable")
  }

  return {
    activeUsers: Math.floor(Math.random() * 500) + 100,
    requestsPerSecond: Math.floor(Math.random() * 1000) + 200,
    errorRate: parseFloat((Math.random() * 5).toFixed(2)),
    avgResponseTime: Math.floor(Math.random() * 300) + 50,
    topEndpoints: [
      { path: "/api/users", count: Math.floor(Math.random() * 1000) },
      { path: "/api/posts", count: Math.floor(Math.random() * 800) },
      { path: "/api/auth", count: Math.floor(Math.random() * 600) },
      { path: "/api/search", count: Math.floor(Math.random() * 400) },
    ],
  }
}
