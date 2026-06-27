import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, Heart, MessageCircle, MapPin } from 'lucide-react'
import { useStore } from '../data/StoreContext'
import { CROP_OPTIONS } from '../data/constants'

function highlightText(text: string, query: string) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.split(regex).map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="rounded bg-warm-200 px-0.5 text-soil-900"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { articles } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [activeCrop, setActiveCrop] = useState(() => searchParams.get('crop') || '全部')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filteredArticles = useMemo(() => {
    let results = articles
    if (activeCrop !== '全部') {
      results = results.filter((a) => a.crop === activeCrop)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q),
      )
    }
    return results
  }, [articles, query, activeCrop])

  const syncParams = (nextQuery: string, nextCrop: string) => {
    const params = new URLSearchParams()
    const trimmed = nextQuery.trim()
    if (trimmed) params.set('q', trimmed)
    if (nextCrop !== '全部') params.set('crop', nextCrop)
    setSearchParams(params, { replace: true })
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    syncParams(value, activeCrop)
  }

  const handleCropChange = (crop: string) => {
    setActiveCrop(crop)
    syncParams(query, crop)
  }

  const handleClear = () => {
    setQuery('')
    syncParams('', activeCrop)
    inputRef.current?.focus()
  }

  const handleCardClick = (id: string) => navigate(`/article/${id}`)

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-400 dark:text-soil-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(query)
            }}
            placeholder="搜索文章、作者、标签..."
            className="w-full rounded-2xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 py-3 sm:py-4 pl-12 pr-12 text-base text-soil-800 dark:text-soil-200 placeholder-soil-400 dark:placeholder-soil-500 outline-none transition-all focus:border-leaf-400 focus:ring-4 focus:ring-leaf-50 dark:focus:ring-leaf-900/30"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-soil-400 dark:text-soil-500 transition-colors hover:bg-soil-100 dark:hover:bg-soil-700 hover:text-soil-600 dark:hover:text-soil-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </motion.div>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-soil-500 dark:text-soil-400">
          <Filter size={14} />
          <span>按作物筛选</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CROP_OPTIONS.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => handleCropChange(crop)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCrop === crop
                  ? 'bg-leaf-600 text-white shadow-sm'
                  : 'bg-soil-100 dark:bg-soil-700 text-soil-600 dark:text-soil-300 hover:bg-soil-200 dark:hover:bg-soil-600'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-soil-500 dark:text-soil-400">
        共找到{' '}
        <span className="font-semibold text-soil-700 dark:text-soil-200">
          {filteredArticles.length}
        </span>{' '}
        篇相关内容
      </div>

      <AnimatePresence mode="wait">
        {filteredArticles.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center py-20 text-soil-400 dark:text-soil-500"
          >
            <Search size={48} className="mb-3 opacity-30" />
            <p className="text-lg font-medium dark:text-soil-300">未找到相关内容</p>
            <p className="mt-1 text-sm dark:text-soil-500">试试其他关键词或筛选条件</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleCardClick(article.id)}
                className="cursor-pointer overflow-hidden rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 shadow-sm transition-shadow hover:shadow-lg dark:hover:shadow-soil-900/50"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-4">
                  <div className="mb-1 flex items-center gap-1 text-xs">
                    <span>{article.cropIcon}</span>
                    <span className="text-leaf-600 dark:text-leaf-400">{article.crop}</span>
                    <span className="text-soil-300 dark:text-soil-600">丨</span>
                    <span className="text-soil-500 dark:text-soil-400">{article.authorName}</span>
                  </div>

                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-soil-800 dark:text-soil-200">
                    {highlightText(article.title, query)}
                  </h3>

                  <p className="mb-3 line-clamp-2 text-xs text-soil-400 dark:text-soil-500">
                    {article.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-leaf-100 dark:bg-leaf-900/30 px-2 py-0.5 text-xs font-medium text-leaf-600 dark:text-leaf-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-soil-400 dark:text-soil-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Heart size={14} />
                        {article.likes}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={14} />
                        {article.comments}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {article.region}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
