import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  CornerDownLeft,
  ArrowRight,
  Home,
} from 'lucide-react'
import { CROPS } from '../data/constants'
import { useStore } from '../data/StoreContext'
import { useTheme } from './useTheme'

export default function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { articles, profile } = useStore()
  const { isDark, toggle } = useTheme()

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifications = 3
  const isLoggedIn = true

  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    if (!searchOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [searchOpen])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/'

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100)
      } else {
        setSearchQuery('')
      }
      return next
    })
  }

  const handleLogout = () => {
    setMenuOpen(false)
    navigate('/login')
  }

  const submitSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setSearchOpen(false)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    submitSearch(searchQuery)
  }

  const handleCropFilter = (crop: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    navigate(`/search?crop=${encodeURIComponent(crop)}`)
  }

  const searchResults = searchQuery.trim()
    ? articles
        .filter((a) => {
          const q = searchQuery.trim().toLowerCase()
          return (
            a.title.toLowerCase().includes(q) ||
            a.subtitle.toLowerCase().includes(q) ||
            a.crop.toLowerCase().includes(q) ||
            a.authorName.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
          )
        })
        .slice(0, 6)
    : []

  return (
    <>
      <nav className="sticky top-0 z-40 h-14 border-b border-soil-200 bg-soil-50/80 backdrop-blur-xl saturate-150 dark:border-soil-700/30 dark:bg-soil-900/80">
        <div className="flex h-full items-center justify-between px-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="-ml-1.5 flex items-center gap-0.5 rounded-lg py-1 pl-1.5 pr-2 text-soil-500 transition-all hover:bg-soil-50 hover:text-leaf-600 dark:text-soil-400 dark:hover:bg-soil-800 dark:hover:text-leaf-400"
            >
              {!isHome && <Home size={15} className="flex-shrink-0" />}
              <span className="text-base font-semibold tracking-tight text-leaf-600 sm:text-lg dark:text-leaf-400">
                知耕 Know Grow
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-soil-600 transition-colors hover:bg-soil-100 hover:text-soil-800 dark:text-soil-300 dark:hover:bg-soil-800 dark:hover:text-soil-100"
              onClick={toggleSearch}
              aria-label={searchOpen ? '关闭搜索' : '搜索'}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-soil-600 transition-colors hover:bg-soil-100 hover:text-soil-800 dark:text-soil-300 dark:hover:bg-soil-800 dark:hover:text-soil-100"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="菜单"
              >
                <Menu size={18} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-soil-200 bg-white p-2 shadow-lg dark:border-soil-700 dark:bg-soil-800"
                  >
                    {isLoggedIn ? (
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-soil-50 dark:hover:bg-soil-700"
                        onClick={() => {
                          setMenuOpen(false)
                          navigate('/profile')
                        }}
                      >
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                        />
                        <span className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">
                          {profile.name}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg bg-leaf-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
                        onClick={() => {
                          setMenuOpen(false)
                          navigate('/login')
                        }}
                      >
                        登录/注册
                      </button>
                    )}

                    <div className="my-2 border-t border-soil-100 dark:border-soil-700" />

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-soil-700 transition-colors hover:bg-soil-50 dark:text-soil-200 dark:hover:bg-soil-700"
                      onClick={() => {
                        setMenuOpen(false)
                        navigate('/notifications')
                      }}
                    >
                      <Bell size={16} className="text-soil-500 dark:text-soil-300" />
                      <span className="flex-1">通知</span>
                      {notifications > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warm-400 text-xs font-medium text-soil-900">
                          {notifications}
                        </span>
                      )}
                    </button>

                    <div className="my-2 border-t border-soil-100 dark:border-soil-700" />

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-soil-700 transition-colors hover:bg-soil-50 dark:text-soil-200 dark:hover:bg-soil-700"
                      onClick={toggle}
                    >
                      {isDark ? (
                        <Sun size={16} className="text-warm-400" />
                      ) : (
                        <Moon size={16} className="text-soil-500 dark:text-soil-300" />
                      )}
                      <span>切换{isDark ? '亮色' : '暗色'}模式</span>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-soil-700 transition-colors hover:bg-soil-50 dark:text-soil-200 dark:hover:bg-soil-700"
                      onClick={() => {
                        setMenuOpen(false)
                        navigate('/settings')
                      }}
                    >
                      <Settings size={16} className="text-soil-500 dark:text-soil-300" />
                      <span>设置</span>
                    </button>

                    {isLoggedIn && (
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>退出登录</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-50 bg-soil-900/30 backdrop-blur-sm dark:bg-soil-950/60"
            />
            <motion.div
              key="search-popover"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed left-1/2 top-20 z-50 w-[min(92vw,640px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-soil-200 bg-white shadow-2xl dark:border-soil-700 dark:bg-soil-800"
              role="dialog"
              aria-label="搜索"
            >
              <div className="flex items-center gap-3 border-b border-soil-100 px-4 py-3 dark:border-soil-700">
                <Search size={18} className="flex-shrink-0 text-soil-400 dark:text-soil-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="搜索文章、作物、作者…"
                  className="flex-1 bg-transparent text-sm text-soil-800 outline-none placeholder-soil-400 dark:text-soil-100 dark:placeholder-soil-500"
                />
                <kbd className="hidden items-center gap-1 rounded border border-soil-200 bg-soil-50 px-1.5 py-0.5 text-2xs text-soil-500 sm:inline-flex dark:border-soil-600 dark:bg-soil-700 dark:text-soil-300">
                  <CornerDownLeft size={10} /> Enter
                </kbd>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded p-1 text-soil-400 hover:bg-soil-100 hover:text-soil-700 dark:text-soil-500 dark:hover:bg-soil-700 dark:hover:text-soil-200"
                  aria-label="关闭"
                >
                  <X size={16} />
                </button>
              </div>

              {searchQuery.trim() && searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto p-2">
                  {searchResults.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => submitSearch(article.title)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-soil-50 dark:hover:bg-soil-700"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-leaf-100 text-xs text-leaf-600 dark:bg-leaf-900 dark:text-leaf-300">
                        {article.crop.slice(0, 1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">
                          {article.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-soil-500 dark:text-soil-400">
                          {article.crop} · {article.authorName} · {article.subtitle}
                        </p>
                      </div>
                      <ArrowRight size={14} className="mt-1 flex-shrink-0 text-soil-300 dark:text-soil-600" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => submitSearch(searchQuery)}
                    className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-soil-200 px-3 py-2 text-xs text-leaf-600 hover:border-leaf-300 hover:bg-leaf-50 dark:border-soil-600 dark:text-leaf-400 dark:hover:bg-leaf-900"
                  >
                    查看全部 "{searchQuery}" 的搜索结果
                    <ArrowRight size={12} />
                  </button>
                </div>
              ) : searchQuery.trim() ? (
                <div className="px-4 py-6 text-center text-sm text-soil-500 dark:text-soil-400">
                  没有找到匹配的文章
                </div>
              ) : (
                <>
                  <div className="border-b border-soil-100 px-4 py-3 dark:border-soil-700">
                    <p className="mb-2 text-2xs font-medium text-soil-500 dark:text-soil-400">按作物搜索</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CROPS.map((crop) => (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => handleCropFilter(crop)}
                          className="rounded-full border border-soil-200 px-3 py-1 text-xs text-soil-600 transition-colors hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-600 dark:border-soil-600 dark:text-soil-300 dark:hover:border-leaf-500 dark:hover:bg-leaf-900 dark:hover:text-leaf-300"
                        >
                          {crop}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3 text-2xs text-soil-400 dark:text-soil-500">
                    提示：按 <kbd className="rounded border border-soil-200 bg-soil-50 px-1 dark:border-soil-600 dark:bg-soil-700">Esc</kbd> 关闭
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
