import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"

interface NotificationItem {
  id: number
  title: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "New comment on your post", read: false },
  { id: 2, title: "Your build succeeded", read: false },
  { id: 3, title: "Alice mentioned you", read: false },
  { id: 4, title: "Deployment complete", read: true },
  { id: 5, title: "New follower: Bob", read: false },
]

function NotificationBell({ count }: { count: number }) {
  if (count > 0) {
    return (
      <div className="relative inline-block">
        <span className="text-2xl">🔔</span>
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          {count}
        </span>
      </div>
    )
  }

  return <span className="text-2xl">🔔</span>
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)
  const { addToast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    addToast("Marked as read", "success")
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    addToast("All notifications marked as read", "success")
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    addToast("Notification deleted", "info")
  }

  const handleAddNotification = () => {
    const newNotification = {
      id: Date.now(),
      title: `New notification at ${new Date().toLocaleTimeString()}`,
      read: false,
    }
    setNotifications([newNotification, ...notifications])
    addToast("New notification received!", "info")
  }

  let displayedNotifications = notifications
  if (showOnlyUnread) {
    displayedNotifications = notifications.filter((n) => !n.read)
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <NotificationBell count={unreadCount} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNotification}
            className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            Simulate New
          </button>
          <button
            onClick={handleMarkAllRead}
            className="rounded bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showOnlyUnread}
            onChange={() => setShowOnlyUnread(!showOnlyUnread)}
            className="rounded"
          />
          Show only unread
        </label>
      </div>

      <div className="space-y-2">
        {displayedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              notification.read
                ? "border-border bg-card"
                : "border-primary/20 bg-primary/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
              <span
                className={
                  notification.read
                    ? "text-muted-foreground"
                    : "font-medium text-foreground"
                }
              >
                {notification.title}
              </span>
            </div>
            <div className="flex gap-2">
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => handleDelete(notification.id)}
                className="text-sm text-destructive hover:text-destructive/80"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {displayedNotifications.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            No notifications to show
          </p>
        )}
      </div>
    </div>
  )
}
