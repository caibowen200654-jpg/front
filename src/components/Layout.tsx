import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-soil-50 text-soil-800 dark:bg-soil-900 dark:text-soil-100">
      <TopBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-soil-200 bg-soil-50 py-3 text-center text-2xs text-soil-400 sm:text-xs dark:border-soil-800 dark:bg-soil-900 dark:text-soil-500">
        <span>© 2026 知耕 Know Grow · 仅供学习交流</span>
      </footer>
    </div>
  )
}
