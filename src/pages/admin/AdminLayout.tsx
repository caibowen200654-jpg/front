import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  ArrowLeft,
  User,
  Menu,
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '数据概览', end: true },
  { to: '/admin/articles', icon: FileText, label: '文章管理' },
  { to: '/admin/comments', icon: MessageSquare, label: '评论审核' },
  { to: '/admin/messages', icon: Mail, label: '留言管理' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-soil-700 text-white'
        : 'text-soil-300 hover:bg-soil-800 hover:text-white'
    }`

  const sidebarContent = (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col bg-soil-900 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-soil-700 px-5">
        <span className="text-lg font-semibold tracking-tight text-leaf-400">
          知耕
        </span>
        <span className="text-sm text-soil-400">管理后台</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-soil-700 px-5 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-soil-300 transition-colors hover:bg-soil-800 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          返回前台
        </button>

        <div className="mt-3 flex items-center gap-3 border-t border-soil-700 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soil-700">
            <User size={16} className="text-soil-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">管理员</p>
            <p className="text-xs text-soil-400">admin@zhigeng.com</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">{sidebarContent}</div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-auto bg-soil-50">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-soil-200 bg-soil-50/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-soil-600 hover:bg-soil-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-soil-700">管理后台</span>
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
