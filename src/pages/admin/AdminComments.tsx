import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, MessageSquare, Clock, Trash2, User } from 'lucide-react'
import { useStore } from '../../data/StoreContext'
import { formatTime } from '../../utils/time'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: '待审核', color: 'bg-warm-100 text-warm-700 dark:bg-warm-900 dark:text-warm-300', icon: Clock },
  approved: { label: '已通过', color: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle },
}

export default function AdminComments() {
  const { comments, articles, approveComment, rejectComment, deleteComment } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const articleMap = useMemo(() => {
    const map = new Map<string, string>()
    articles.forEach((a) => map.set(a.id, a.title))
    return map
  }, [articles])

  const stats = useMemo(() => ({
    total: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  }), [comments])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return comments.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!q) return true
      return (
        c.userName.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        (articleMap.get(c.articleId) ?? '').toLowerCase().includes(q)
      )
    })
  }, [comments, search, statusFilter, articleMap])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBatchApprove = () => {
    selectedIds.forEach((id) => {
      const c = comments.find((x) => x.id === id)
      if (c && c.status === 'pending') approveComment(id)
    })
    setSelectedIds(new Set())
  }

  const handleBatchReject = () => {
    selectedIds.forEach((id) => {
      const c = comments.find((x) => x.id === id)
      if (c && c.status === 'pending') rejectComment(id)
    })
    setSelectedIds(new Set())
  }

  const handleBatchDelete = () => {
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 条评论吗？`)) return
    selectedIds.forEach((id) => deleteComment(id))
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: '总评论', value: stats.total, color: 'from-soil-100 to-soil-200 dark:from-soil-800 dark:to-soil-700', icon: MessageSquare, text: 'text-soil-700 dark:text-soil-200' },
          { label: '待审核', value: stats.pending, color: 'from-warm-100 to-warm-200 dark:from-warm-900 dark:to-warm-800', icon: Clock, text: 'text-warm-700 dark:text-warm-300' },
          { label: '已通过', value: stats.approved, color: 'from-leaf-100 to-leaf-200 dark:from-leaf-900 dark:to-leaf-800', icon: CheckCircle, text: 'text-leaf-700 dark:text-leaf-300' },
          { label: '已拒绝', value: stats.rejected, color: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800', icon: XCircle, text: 'text-red-700 dark:text-red-300' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-2xl bg-gradient-to-br ${stat.color} p-3 sm:p-4`}>
              <div className="flex items-center justify-between">
                <Icon size={16} className={stat.text} />
                <span className={`text-2xl font-semibold ${stat.text} sm:text-3xl`}>{stat.value}</span>
              </div>
              <p className={`mt-1 text-xs ${stat.text} opacity-80`}>{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-soil-200 bg-white p-3 sm:p-4 dark:border-soil-700 dark:bg-soil-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索评论人、内容、文章标题…"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-leaf-400 focus:bg-white dark:border-soil-600 dark:bg-soil-700 dark:focus:bg-soil-600"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-lg border border-soil-200 bg-soil-50 px-3 py-2 text-sm text-soil-700 outline-none dark:border-soil-600 dark:bg-soil-700 dark:text-soil-200"
            >
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
            {selectedIds.size > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleBatchApprove}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-200 bg-leaf-50 px-3 py-2 text-sm text-leaf-700 transition-colors hover:bg-leaf-100 dark:border-leaf-700 dark:bg-leaf-900 dark:text-leaf-300"
                >
                  <CheckCircle size={14} />通过 ({selectedIds.size})
                </button>
                <button
                  type="button"
                  onClick={handleBatchReject}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 transition-colors hover:bg-warm-100 dark:border-warm-700 dark:bg-warm-900 dark:text-warm-300"
                >
                  <XCircle size={14} />拒绝
                </button>
                <button
                  type="button"
                  onClick={handleBatchDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                >
                  <Trash2 size={14} />删除
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-soil-200 bg-white p-12 text-center text-sm text-soil-500 dark:border-soil-700 dark:bg-soil-800 dark:text-soil-400">
          没有找到匹配的评论
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((comment) => {
            const statusInfo = STATUS_LABELS[comment.status]
            const StatusIcon = statusInfo?.icon || Clock
            const articleTitle = articleMap.get(comment.articleId) ?? '已删除文章'
            const isSelected = selectedIds.has(comment.id)
            return (
              <motion.li
                key={comment.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl border bg-white p-3 transition-colors sm:p-4 dark:bg-soil-800 ${
                  isSelected
                    ? 'border-leaf-300 bg-leaf-50/40 dark:border-leaf-600 dark:bg-leaf-900/20'
                    : 'border-soil-200 hover:border-soil-300 dark:border-soil-700 dark:hover:border-soil-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(comment.id)}
                    className="mt-1 h-4 w-4 rounded border-soil-300 text-leaf-600 focus:ring-leaf-500"
                  />
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <User size={12} className="text-soil-400" />
                      <span className="text-sm font-medium text-soil-800 dark:text-soil-100">
                        {comment.userName}
                      </span>
                      <span className="text-2xs text-soil-400">{formatTime(comment.createdAt)}</span>
                      {statusInfo && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${statusInfo.color}`}>
                          <StatusIcon size={10} />
                          {statusInfo.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-soil-700 dark:text-soil-200">
                      {comment.content}
                    </p>
                    <p className="mt-1.5 truncate text-2xs text-soil-400">
                      评论于 · {articleTitle}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {comment.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => approveComment(comment.id)}
                          className="rounded p-1.5 text-leaf-600 transition-colors hover:bg-leaf-50 dark:text-leaf-400 dark:hover:bg-leaf-900"
                          title="通过"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectComment(comment.id)}
                          className="rounded p-1.5 text-warm-600 transition-colors hover:bg-warm-50 dark:text-warm-400 dark:hover:bg-warm-900"
                          title="拒绝"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('确定要删除这条评论吗？')) deleteComment(comment.id)
                      }}
                      className="rounded p-1.5 text-soil-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-soil-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
