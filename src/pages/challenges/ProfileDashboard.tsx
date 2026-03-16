import { useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

// ─── Types ──────────────────────────────────────────────────────────────────

interface Activity {
  id: number
  type: "post" | "comment" | "like"
  description: string
  timestamp: string
  likes: number
}

interface UserProfile {
  name: string
  handle: string
  bio: string
  avatar: string
  joinedDate: string
}

interface UserStats {
  posts: number
  followers: number
  following: number
  likes: number
}

// ─── Theme Context ──────────────────────────────────────────────────────────
type AccentColor = "blue" | "rose" | "green" | "purple"

const ACCENT_CLASSES: Record<AccentColor, { bg: string; text: string; swatch: string }> = {
  blue: { bg: "bg-blue-500", text: "text-blue-500", swatch: "bg-blue-500" },
  rose: { bg: "bg-rose-500", text: "text-rose-500", swatch: "bg-rose-500" },
  green: { bg: "bg-green-500", text: "text-green-500", swatch: "bg-green-500" },
  purple: { bg: "bg-purple-500", text: "text-purple-500", swatch: "bg-purple-500" },
}

interface ThemeContextValue {
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  accentColor: "blue",
  setAccentColor: () => { },
})

function useTheme() {
  return useContext(ThemeContext)
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_PROFILE: UserProfile = {
  name: "Alex Rivera",
  handle: "@arivera",
  bio: "Full-stack developer. Building things that matter.",
  avatar: "AR",
  joinedDate: "March 2023",
}

const MOCK_STATS: UserStats = {
  posts: 142,
  followers: 1283,
  following: 891,
  likes: 3847,
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, type: "post", description: "Published \"Understanding React Fiber\"", timestamp: "2h ago", likes: 24 },
  { id: 2, type: "comment", description: "Commented on \"State Management in 2025\"", timestamp: "4h ago", likes: 8 },
  { id: 3, type: "like", description: "Liked \"Building a Design System\"", timestamp: "5h ago", likes: 0 },
  { id: 4, type: "post", description: "Published \"CSS Container Queries Guide\"", timestamp: "1d ago", likes: 56 },
  { id: 5, type: "comment", description: "Commented on \"TypeScript 6.0 Features\"", timestamp: "1d ago", likes: 12 },
  { id: 6, type: "post", description: "Published \"Async Patterns in React\"", timestamp: "2d ago", likes: 31 },
]

// ─── Components ─────────────────────────────────────────────────────────────

function Header({ name, handle }: { name: string; handle: string }) {
  const { accentColor } = useTheme()

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{name}</h1>
        <p className={cn("text-muted-foreground", ACCENT_CLASSES[accentColor].text)}>
          {handle}
        </p>
      </div>
    </div>
  )
}

function UserCard({
  profile,
  onBioChange,
}: {
  profile: UserProfile
  onBioChange: (bio: string) => void
}) {
  const { accentColor } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(profile.bio)

  const handleSave = () => {
    onBioChange(draft)
    setIsEditing(false)
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn("flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white", ACCENT_CLASSES[accentColor].bg)}
        >
          {profile.avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{profile.name}</p>
          <p className="text-sm text-muted-foreground">Joined {profile.joinedDate}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full rounded border border-input bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={cn("rounded px-3 py-1 text-sm text-white", ACCENT_CLASSES[accentColor].bg)}
            >
              Save
            </button>
            <button
              onClick={() => { setIsEditing(false); setDraft(profile.bio) }}
              className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="group">
          <p className="text-sm text-foreground">{profile.bio}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Edit bio
          </button>
        </div>
      )}
    </div>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const [liked, setLiked] = useState(false)

  const typeIcon = { post: "📝", comment: "💬", like: "❤️" }[activity.type]

  return (
    <div className="flex items-start justify-between border-b border-border py-3 last:border-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-base">{typeIcon}</span>
        <div>
          <p className="text-sm text-foreground">{activity.description}</p>
          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
        </div>
      </div>
      <button
        onClick={() => setLiked(!liked)}
        className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${liked
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground"
          }`}
      >
        {liked ? "♥" : "♡"} {activity.likes + (liked ? 1 : 0)}
      </button>
    </div>
  )
}

function ActivityFeed({
  activities,
  filter,
}: {
  activities: Activity[]
  filter: string
}) {
  const filtered = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter)

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-lg font-semibold text-foreground">Recent Activity</h2>
      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No activity to show</p>
      ) : (
        filtered.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))
      )}
    </div>
  )
}

function StatWidget({ label, value }: { label: string; value: number }) {
  const { accentColor } = useTheme()

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <p className={cn("text-2xl font-bold", ACCENT_CLASSES[accentColor].text)}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Sidebar({ stats }: { stats: UserStats }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Stats</h2>
      <div className="grid grid-cols-2 gap-3">
        <StatWidget label="Posts" value={stats.posts} />
        <StatWidget label="Followers" value={stats.followers} />
        <StatWidget label="Following" value={stats.following} />
        <StatWidget label="Likes" value={stats.likes} />
      </div>
    </div>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())

  useState(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  })

  return (
    <p className="text-sm text-muted-foreground">
      {time.toLocaleTimeString()}
    </p>
  )
}

function AccentPicker() {
  const { accentColor, setAccentColor } = useTheme()
  const colors: AccentColor[] = ["blue", "rose", "green", "purple"]

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Accent:</span>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setAccentColor(color)}
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-transform",
            ACCENT_CLASSES[color].swatch,
            accentColor === color ? "scale-125 border-foreground" : "border-transparent",
          )}
        />
      ))}
    </div>
  )
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ProfileDashboard() {
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [filter, setFilter] = useState<string>("all")
  const [accentColor, setAccentColor] = useState<AccentColor>("blue")

  const handleBioChange = (bio: string) => {
    setProfile((prev) => ({ ...prev, bio }))
  }

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-4 flex items-center justify-between">
          <Header name={profile.name} handle={profile.handle} />
          <div className="flex items-center gap-6">
            <AccentPicker />
            <Clock />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main content — 2 columns */}
          <div className="md:col-span-2">
            <UserCard profile={profile} onBioChange={handleBioChange} />

            <div className="mb-4 flex gap-2">
              {["all", "post", "comment", "like"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs capitalize transition-colors",
                    filter === type
                      ? cn("text-white", ACCENT_CLASSES[accentColor].bg)
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {type === "all" ? "All" : `${type}s`}
                </button>
              ))}
            </div>

            <ActivityFeed activities={MOCK_ACTIVITIES} filter={filter} />
          </div>

          {/* Sidebar — 1 column */}
          <div>
            <Sidebar stats={MOCK_STATS} />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
