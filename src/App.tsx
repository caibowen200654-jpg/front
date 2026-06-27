import { Routes, Route } from 'react-router-dom'
import { StoreProvider } from './data/StoreContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ArticleDetail from './pages/ArticleDetail'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SubmitPage from './pages/SubmitPage'
import FeedbackPage from './pages/FeedbackPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import CropInfoPage from './pages/CropInfoPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArticles from './pages/admin/AdminArticles'
import AdminComments from './pages/admin/AdminComments'
import AdminMessages from './pages/admin/AdminMessages'

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/crop/:name" element={<CropInfoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </StoreProvider>
    </ErrorBoundary>
  )
}
