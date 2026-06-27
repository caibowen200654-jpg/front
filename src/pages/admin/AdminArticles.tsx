import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useStore } from '../../data/StoreContext'

type StatusFilter = 'all' | 'published' | 'pending' | 'rejected'

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  published: { label: '已发布', color: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900 dark:text-leaf-300', icon: CheckCircle2 },
  pending: { label: '审核中', color: 'bg-warm-100 text-warm-700 dark:bg-warm-900 dark:text-warm-300', icon: Clock },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle },
}

const PAGE_SIZE = 8

export default function AdminArticles() {
  const navigate = useNavigate()
  const { articles, deleteArticle } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [cropFilter, setCropFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const allCrops = useMemo(() => {
    const set = new Set(articles.map((a) => a.crop))
    return Array.from(set).sort()
  }, [articles])

  const stats = useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.status === 'published' || !a.status).length,
      pending: articles.filter((a) => a.status === 'pending').length,
      rejected: articles.filter((a) => a.status === 'rejected').length,
    }
  }, [articles])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles.filter((a) => {
      if (statusFilter === 'published' && a.status && a.status !== 'published') return false
      if (statusFilter === 'pending' && a.status !== 'pending') return false
      if (statusFilter === 'rejected' && a.status !== 'rejected') return false
      if (cropFilter !== 'all' && a.crop !== cropFilter) return false
      if (!q) return true
      return (
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.crop.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [articles, search, statusFilter, cropFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pagedArticles = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (pagedArticles.every((a) => selectedIds.has(a.id))) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pagedArticles.map((a) => a.id)))
    }
  }

  const handleBatchDelete = () => {
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 篇文章吗？`)) return
    selectedIds.forEach((id) => deleteArticle(id))
    setSelectedIds(new Set())
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteArticle(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 3000)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: '总文章', value: stats.total, color: 'from-soil-100 to-soil-200 dark:from-soil-800 dark:to-soil-700', icon: FileText, text: 'text-soil-700 dark:text-soil-200' },
          { label: '已发布', value: stats.published, color: 'from-leaf-100 to-leaf-200 dark:from-leaf-900 dark:to-leaf-800', icon: CheckCircle2, text: 'text-leaf-700 dark:text-leaf-300' },
          { label: '审核中', value: stats.pending, color: 'from-warm-100 to-warm-200 dark:from-warm-900 dark:to-warm-800', icon: Clock, text: 'text-warm-700 dark:text-warm-300' },
          { label: '总阅读', value: articles.reduce((sum, a) => sum + (a.likes || 0), 0), color: 'from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800', icon: TrendingUp, text: 'text-amber-700 dark:text-amber-300' },
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
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="搜索标题、作物、作者、标签…"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-leaf-400 focus:bg-white dark:border-soil-600 dark:bg-soil-700 dark:focus:bg-soil-600"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter)
                setPage(1)
              }}
              className="rounded-lg border border-soil-200 bg-soil-50 px-3 py-2 text-sm text-soil-700 outline-none dark:border-soil-600 dark:bg-soil-700 dark:text-soil-200"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="pending">审核中</option>
              <option value="rejected">已拒绝</option>
            </select>
            <select
              value={cropFilter}
              onChange={(e) => {
                setCropFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-soil-200 bg-soil-50 px-3 py-2 text-sm text-soil-700 outline-none dark:border-soil-600 dark:bg-soil-700 dark:text-soil-200"
            >
              <option value="all">全部作物</option>
              {allCrops.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={handleBatchDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
              >
                <Trash2 size={14} />
                删除选中 ({selectedIds.size})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-soil-200 bg-white dark:border-soil-700 dark:bg-soil-800">
        <div className="hidden border-b border-soil-100 bg-soil-50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-soil-500 sm:grid sm:grid-cols-[auto_1fr_140px_120px_120px_100px] sm:gap-4 sm:px-6 dark:border-soil-700 dark:bg-soil-800/50 dark:text-soil-400">
          <input
            type="checkbox"
            checked={pagedArticles.length > 0 && pagedArticles.every((a) => selectedIds.has(a.id))}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-soil-300 text-leaf-600 focus:ring-leaf-500"
          />
          <span>文章</span>
          <span>作物</span>
          <span>作者</span>
          <span>状态</span>
          <span className="text-right">操作</span>
        </div>

        {pagedArticles.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-soil-500 dark:text-soil-400">
            没有找到匹配的文章
          </div>
        ) : (
          <ul className="divide-y divide-soil-100 dark:divide-soil-700">
            {pagedArticles.map((article) => {
              const status = article.status || 'published'
              const statusInfo = STATUS_LABELS[status]
              const StatusIcon = statusInfo?.icon || CheckCircle2
              const isSelected = selectedIds.has(article.id)
              return (
                <motion.li
                  key={article.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex flex-col gap-2 px-4 py-3 transition-colors sm:grid sm:grid-cols-[auto_1fr_140px_120px_120px_100px] sm:items-center sm:gap-4 sm:px-6 sm:py-4 ${
                    isSelected ? 'bg-leaf-50/40 dark:bg-leaf-900/20' : 'hover:bg-soil-50/50 dark:hover:bg-soil-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(article.id)}
                      className="h-4 w-4 rounded border-soil-300 text-leaf-600 focus:ring-leaf-500"
                    />
                    <div className="min-w-0 flex-1 sm:flex-initial">
                      <p className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">
                        {article.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-soil-500 dark:text-soil-400">
                        {article.subtitle}
                      </p>
                      <p className="mt-1 text-2xs text-soil-400 dark:text-soil-500 sm:hidden">
                        {article.crop} · {article.authorName}
                      </p>
                    </div>
                  </div>
                  <p className="hidden text-sm text-soil-700 sm:block dark:text-soil-200">{article.crop}</p>
                  <p className="hidden text-sm text-soil-600 sm:block dark:text-soil-300">{article.authorName}</p>
                  <div className="hidden sm:block">
                    {statusInfo && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${statusInfo.color}`}>
                        <StatusIcon size={10} />
                        {statusInfo.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="rounded p-1.5 text-soil-500 transition-colors hover:bg-soil-100 hover:text-soil-800 dark:text-soil-400 dark:hover:bg-soil-700 dark:hover:text-soil-100"
                      title="查看"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/edit/${article.id}`)}
                      className="rounded p-1.5 text-soil-500 transition-colors hover:bg-soil-100 hover:text-soil-800 dark:text-soil-400 dark:hover:bg-soil-700 dark:hover:text-soil-100"
                      title="编辑"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      className={`rounded p-1.5 transition-colors ${
                        confirmDeleteId === article.id
                          ? 'bg-red-500 text-white'
                          : 'text-soil-500 hover:bg-red-50 hover:text-red-600 dark:text-soil-400 dark:hover:bg-red-950 dark:hover:text-red-400'
                      }`}
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-soil-600 dark:text-soil-300">
          <span>
            第 {page} / {totalPages} 页 · 共 {filtered.length} 条
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-soil-200 bg-white p-1.5 transition-colors hover:bg-soil-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-soil-700 dark:bg-soil-800 dark:hover:bg-soil-700"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`min-w-8 rounded-lg border px-2 py-1 text-xs transition-colors ${
                  page === p
                    ? 'border-leaf-500 bg-leaf-50 text-leaf-700 dark:border-leaf-400 dark:bg-leaf-900 dark:text-leaf-300'
                    : 'border-soil-200 bg-white text-soil-600 hover:bg-soil-50 dark:border-soil-700 dark:bg-soil-800 dark:text-soil-300 dark:hover:bg-soil-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-soil-200 bg-white p-1.5 transition-colors hover:bg-soil-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-soil-700 dark:bg-soil-800 dark:hover:bg-soil-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
