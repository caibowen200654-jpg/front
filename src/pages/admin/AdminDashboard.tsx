import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  MessageSquare,
  Heart,
  Bell,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Users,
} from 'lucide-react'
import { useStore } from '../../data/StoreContext'
import { formatTime } from '../../utils/time'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { articles, comments, notifications } = useStore()

  const stats = useMemo(() => ({
    totalArticles: articles.length,
    totalComments: comments.length,
    totalLikes: articles.reduce((sum, a) => sum + (a.likes || 0), 0),
    totalFeedback: 0,
    pendingComments: comments.filter((c) => c.status === 'pending').length,
    pendingArticles: articles.filter((a) => a.status === 'pending').length,
  }), [articles, comments, notifications])

  const cropStats = useMemo(() => {
    const map = new Map<string, number>()
    articles.forEach((a) => map.set(a.crop, (map.get(a.crop) || 0) + 1))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [articles])

  const recentComments = useMemo(
    () => [...comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [comments]
  )

  const recentArticles = useMemo(
    () => [...articles].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [articles]
  )

  const totalInCropStats = cropStats.reduce((sum, [, count]) => sum + count, 0)
  const maxCropCount = Math.max(...cropStats.map(([, c]) => c), 1)

  const cards = [
    { label: '总文章', value: stats.totalArticles, icon: FileText, color: 'from-leaf-100 to-leaf-200 dark:from-leaf-900 dark:to-leaf-800', text: 'text-leaf-700 dark:text-leaf-300', trend: '+12%' },
    { label: '总评论', value: stats.totalComments, icon: MessageSquare, color: 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800', text: 'text-amber-700 dark:text-amber-300', trend: '+8%' },
    { label: '总点赞', value: stats.totalLikes, icon: Heart, color: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800', text: 'text-red-700 dark:text-red-300', trend: '+23%' },
    { label: '用户反馈', value: stats.totalFeedback, icon: Bell, color: 'from-soil-100 to-soil-200 dark:from-soil-800 dark:to-soil-700', text: 'text-soil-700 dark:text-soil-200', trend: '+3' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 sm:p-4`}
            >
              <div className="flex items-start justify-between">
                <Icon size={18} className={card.text} />
                <span className={`inline-flex items-center gap-0.5 text-2xs font-medium ${card.text} opacity-80`}>
                  <TrendingUp size={10} />
                  {card.trend}
                </span>
              </div>
              <p className={`mt-2 text-2xl font-semibold sm:text-3xl ${card.text}`}>
                {card.value.toLocaleString()}
              </p>
              <p className={`mt-0.5 text-xs ${card.text} opacity-80`}>{card.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 sm:gap-6">
        <div className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-5 lg:col-span-2 dark:border-soil-700 dark:bg-soil-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-soil-800 sm:text-lg dark:text-soil-100">作物分布</h2>
              <p className="mt-0.5 text-xs text-soil-500 dark:text-soil-400">文章数量 Top 6 作物</p>
            </div>
            <Users size={20} className="text-soil-300 dark:text-soil-600" />
          </div>
          <div className="space-y-2.5">
            {cropStats.map(([crop, count]) => {
              const percent = (count / maxCropCount) * 100
              return (
                <div key={crop}>
                  <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-soil-700 dark:text-soil-200">{crop}</span>
                    <span className="text-soil-500 dark:text-soil-400">{count} 篇</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-soil-100 dark:bg-soil-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-5 dark:border-soil-700 dark:bg-soil-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-soil-800 sm:text-lg dark:text-soil-100">待处理</h2>
              <p className="mt-0.5 text-xs text-soil-500 dark:text-soil-400">需要立即处理的事项</p>
            </div>
            <Clock size={20} className="text-warm-400" />
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/admin/comments')}
              className="group flex w-full items-center justify-between rounded-xl border border-soil-100 bg-soil-50/50 p-3 text-left transition-colors hover:border-warm-200 hover:bg-warm-50 dark:border-soil-700 dark:bg-soil-800/50 dark:hover:border-warm-700 dark:hover:bg-warm-900/20"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-warm-500" />
                <div>
                  <p className="text-sm font-medium text-soil-800 dark:text-soil-100">待审核评论</p>
                  <p className="text-2xs text-soil-500 dark:text-soil-400">需要人工审核</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-warm-100 px-2 py-0.5 text-2xs font-semibold text-warm-700 dark:bg-warm-900 dark:text-warm-300">
                  {stats.pendingComments}
                </span>
                <ArrowUpRight size={14} className="text-soil-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="group flex w-full items-center justify-between rounded-xl border border-soil-100 bg-soil-50/50 p-3 text-left transition-colors hover:border-leaf-200 hover:bg-leaf-50 dark:border-soil-700 dark:bg-soil-800/50 dark:hover:border-leaf-700 dark:hover:bg-leaf-900/20"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-leaf-500" />
                <div>
                  <p className="text-sm font-medium text-soil-800 dark:text-soil-100">待发布文章</p>
                  <p className="text-2xs text-soil-500 dark:text-soil-400">等待审核中</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-2xs font-semibold text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300">
                  {stats.pendingArticles}
                </span>
                <ArrowUpRight size={14} className="text-soil-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </button>
            <div className="rounded-xl border border-soil-100 bg-soil-50/50 p-3 dark:border-soil-700 dark:bg-soil-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-leaf-500" />
                  <p className="text-sm font-medium text-soil-800 dark:text-soil-100">今日活跃</p>
                </div>
                <span className="text-base font-semibold text-leaf-600 dark:text-leaf-400">
                  {recentComments.length + recentArticles.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-5 dark:border-soil-700 dark:bg-soil-800">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-soil-800 dark:text-soil-100">最近评论</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/comments')}
              className="text-xs text-leaf-600 hover:underline"
            >
              查看全部
            </button>
          </div>
          <ul className="space-y-3">
            {recentComments.length === 0 ? (
              <li className="text-center text-sm text-soil-500 dark:text-soil-400">暂无评论</li>
            ) : (
              recentComments.map((c) => (
                <li key={c.id} className="flex items-start gap-2.5">
                  <img src={c.userAvatar} alt={c.userName} className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">{c.userName}</span>
                      <span className="text-2xs text-soil-400">{formatTime(c.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-soil-600 dark:text-soil-300">{c.content}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-5 dark:border-soil-700 dark:bg-soil-800">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-soil-800 dark:text-soil-100">最新发布</h2>
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="text-xs text-leaf-600 hover:underline"
            >
              查看全部
            </button>
          </div>
          <ul className="space-y-3">
            {recentArticles.length === 0 ? (
              <li className="text-center text-sm text-soil-500 dark:text-soil-400">暂无文章</li>
            ) : (
              recentArticles.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <img src={a.coverImage} alt={a.title} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">{a.title}</p>
                    <p className="mt-0.5 truncate text-xs text-soil-500 dark:text-soil-400">
                      {a.crop} · {a.authorName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-2xs text-soil-400">
                      <span className="inline-flex items-center gap-0.5">
                        <Heart size={10} /> {a.likes}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <MessageSquare size={10} /> {a.comments}
                      </span>
                      <span>{formatTime(a.createdAt)}</span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
