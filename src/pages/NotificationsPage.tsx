import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, CheckCircle, Bell, ExternalLink } from 'lucide-react'
import { mockNotifications } from '../data/mockData'
import type { Notification } from '../data/types'
import { formatTime } from '../utils/time'

const iconMap: Record<Notification['type'], { icon: typeof Heart; color: string; bg: string }> = {
  like: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  reply: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  approve: { icon: CheckCircle, color: 'text-leaf-600', bg: 'bg-leaf-50' },
  system: { icon: Bell, color: 'text-warm-500', bg: 'bg-warm-50' },
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(mockNotifications)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleClick = (n: Notification) => {
    if (n.articleId) {
      navigate(`/article/${n.articleId}`)
    }
  }

  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-soil-800 sm:text-2xl dark:text-soil-100">消息通知</h1>
          {hasUnread && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-leaf-600 transition-colors hover:text-leaf-700"
            >
              全部标为已读
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-soil-400">
            <Bell size={48} className="mb-4" />
            <p className="text-sm">暂无通知</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const { icon: Icon, color, bg } = iconMap[notification.type]
              const clickable = !!notification.articleId
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleClick(notification)}
                  disabled={!clickable}
                  className={`group relative flex w-full gap-3 rounded-xl border p-4 text-left transition-all ${
                    notification.read
                      ? 'border-soil-100 bg-white hover:border-leaf-200 hover:bg-soil-50 dark:border-soil-700 dark:bg-soil-800 dark:hover:border-leaf-700 dark:hover:bg-soil-700/50'
                      : 'border-leaf-100 bg-leaf-50/30 hover:border-leaf-300 hover:bg-leaf-50/60 dark:border-leaf-800 dark:bg-leaf-900/20 dark:hover:border-leaf-600 dark:hover:bg-leaf-900/30'
                  } ${clickable ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'}`}
                >
                  {!notification.read && (
                    <span className="absolute left-3 top-4 h-2 w-2 rounded-full bg-leaf-500" />
                  )}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bg} ${!notification.read ? 'ml-3' : ''}`}
                  >
                    <Icon size={18} className={color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm leading-relaxed ${
                        notification.read
                          ? 'text-soil-600'
                          : 'font-medium text-soil-800 dark:text-soil-100'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-soil-400">{formatTime(notification.createdAt)}</p>
                  </div>
                  {clickable && (
                    <ExternalLink
                      size={14}
                      className="mt-1 flex-shrink-0 text-soil-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-soil-600"
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
