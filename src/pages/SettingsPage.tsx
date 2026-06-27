import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon,
  Sun,
  Type,
  Globe,
  Bell,
  Mail,
  Smartphone,
  Image as ImageIcon,
  Loader2,
  Check,
  Sparkles,
  Eye,
  Cloud,
  Award,
  Download,
  Heart,
  CheckCircle2,
  Settings as SettingsIcon,
  Trash2,
  CloudOff,
  CloudUpload,
} from 'lucide-react'
import { useStore } from '../data/StoreContext'
import { useTheme } from '../components/useTheme'

export default function SettingsPage() {
  const { settings, updateSettings, profile, updateProfile } = useStore()
  const { isDark, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const showToast = () => {
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 1600)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProfile({ avatar: reader.result as string })
      showToast()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-5 flex items-center gap-2 sm:mb-6">
        <SettingsIcon size={18} className="text-leaf-600 sm:size-5 dark:text-leaf-400" />
        <h1 className="text-lg font-semibold text-soil-800 sm:text-xl dark:text-soil-100">设置</h1>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* 头像与昵称 */}
        <Section title="个人信息" icon={<ImageIcon size={14} className="text-leaf-500" />}>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-soil-200 transition-all hover:ring-leaf-300 sm:h-16 sm:w-16 dark:ring-soil-700 dark:hover:ring-leaf-600"
            >
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <ImageIcon size={16} className="text-white sm:size-5" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full truncate rounded-lg border border-soil-200 bg-white px-2.5 py-1.5 text-sm font-medium text-soil-800 outline-none focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 sm:px-3 sm:py-2 sm:text-base dark:border-soil-700 dark:bg-soil-800 dark:text-soil-100 dark:focus:border-leaf-600"
              />
              <p className="mt-1 truncate text-2xs text-soil-500 sm:text-xs dark:text-soil-400">
                {profile.region} · {profile.cropFocus}
              </p>
            </div>
          </div>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfile({ bio: e.target.value })}
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-soil-200 bg-white px-2.5 py-1.5 text-xs text-soil-700 outline-none focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 sm:px-3 sm:py-2 sm:text-sm dark:border-soil-700 dark:bg-soil-800 dark:text-soil-200 dark:focus:border-leaf-600"
            placeholder="一句话介绍自己"
          />
        </Section>

        {/* 外观 */}
        <Section title="外观" icon={<Sparkles size={14} className="text-leaf-500" />}>
          <div className="space-y-3">
            <Row
              icon={<Moon size={16} />}
              title="深色模式"
              desc="启用深色背景，减少夜间用眼疲劳"
              control={
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    isDark ? 'bg-leaf-600' : 'bg-soil-300 dark:bg-soil-600'
                  }`}
                  aria-label="切换深色模式"
                >
                  <span
                    className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
                      isDark ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  >
                    {isDark ? <Moon size={10} className="text-leaf-700" /> : <Sun size={10} className="text-amber-500" />}
                  </span>
                </button>
              }
            />
            <Row
              icon={<Eye size={16} />}
              title="跟随系统主题"
              desc="根据设备的明暗设置自动切换"
              control={
                <Switch
                  checked={settings.autoTheme}
                  onChange={(v) => updateSettings({ autoTheme: v })}
                />
              }
            />
            <Row
              icon={<Type size={16} />}
              title="字体大小"
              desc="调整文章正文的字号"
              control={
                <div className="flex gap-1 rounded-lg bg-soil-100 p-0.5 dark:bg-soil-700">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        updateSettings({ fontSize: size })
                        showToast()
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                        settings.fontSize === size
                          ? 'bg-white text-soil-800 shadow-sm dark:bg-soil-800 dark:text-soil-100'
                          : 'text-soil-500 hover:text-soil-700 dark:text-soil-400 dark:hover:text-soil-200'
                      }`}
                    >
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              }
            />
            <Row
              icon={<Sparkles size={16} />}
              title="减少动效"
              desc="关闭页面切换与卡片悬浮动画"
              control={
                <Switch
                  checked={settings.reduceMotion}
                  onChange={(v) => updateSettings({ reduceMotion: v })}
                />
              }
            />
          </div>
        </Section>

        {/* 阅读偏好 */}
        <Section title="阅读偏好" icon={<Globe size={14} className="text-leaf-500" />}>
          <div className="space-y-3">
            <Row
              icon={<Cloud size={16} />}
              title="显示气候信息"
              desc="在文章列表中显示区域与气候标签"
              control={
                <Switch
                  checked={settings.showClimate}
                  onChange={(v) => updateSettings({ showClimate: v })}
                />
              }
            />
            <Row
              icon={<Award size={16} />}
              title="显示作物标签"
              desc="在文章卡片上显示作物名"
              control={
                <Switch
                  checked={settings.showCropTag}
                  onChange={(v) => updateSettings({ showCropTag: v })}
                />
              }
            />
          </div>
        </Section>

        {/* 通知 */}
        <Section title="通知" icon={<Bell size={14} className="text-leaf-500" />}>
          <div className="space-y-3">
            <Row
              icon={<Mail size={16} />}
              title="站内消息"
              desc="评论、回复、点赞等互动提醒"
              control={
                <Switch
                  checked={settings.notifyComment}
                  onChange={(v) => updateSettings({ notifyComment: v })}
                />
              }
            />
            <Row
              icon={<Heart size={16} />}
              title="点赞收藏"
              desc="文章被点赞或收藏时通知"
              control={
                <Switch
                  checked={settings.notifyLike}
                  onChange={(v) => updateSettings({ notifyLike: v })}
                />
              }
            />
            <Row
              icon={<Smartphone size={16} />}
              title="新关注者"
              desc="有新用户关注你时通知"
              control={
                <Switch
                  checked={settings.notifyFollow}
                  onChange={(v) => updateSettings({ notifyFollow: v })}
                />
              }
            />
            <Row
              icon={<CheckCircle2 size={16} />}
              title="每周精选"
              desc="每周一推送高价值文章合集"
              control={
                <Switch
                  checked={settings.notifyWeekly}
                  onChange={(v) => updateSettings({ notifyWeekly: v })}
                />
              }
            />
          </div>
        </Section>

        {/* 数据 */}
        <Section title="数据" icon={<Cloud size={14} className="text-leaf-500" />}>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ articles: '同步中...', articles_count: 0 }, null, 2)],
                  { type: 'application/json' },
                )
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `zhigeng-data-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
                showToast()
              }}
              className="flex w-full items-center gap-3 rounded-lg bg-soil-50 px-3 py-2.5 text-left transition-colors hover:bg-soil-100 sm:px-4 sm:py-3 dark:bg-soil-700/50 dark:hover:bg-soil-700"
            >
              <Download size={16} className="flex-shrink-0 text-leaf-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-soil-800 dark:text-soil-100">导出我的数据</p>
                <p className="text-2xs text-soil-500 sm:text-xs dark:text-soil-400">下载所有文章与设置</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('确定清空所有本地数据吗？此操作不可恢复。')) {
                  localStorage.clear()
                  location.reload()
                }
              }}
              className="flex w-full items-center gap-3 rounded-lg bg-red-50 px-3 py-2.5 text-left transition-colors hover:bg-red-100 sm:px-4 sm:py-3 dark:bg-red-900/20 dark:hover:bg-red-900/30"
            >
              <Trash2 size={16} className="flex-shrink-0 text-red-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">清空所有数据</p>
                <p className="text-2xs text-soil-500 sm:text-xs dark:text-soil-400">清空全部文章、评论、设置</p>
              </div>
            </button>
          </div>
        </Section>

        {/* 关于 */}
        <Section title="关于" icon={<Sparkles size={14} className="text-leaf-500" />}>
          <div className="space-y-1.5 text-xs text-soil-600 sm:text-sm dark:text-soil-300">
            <p>知耕 Know Grow · v1.0.0</p>
            <p className="text-soil-500 dark:text-soil-400">从土地到指尖 · 每一份经验都值得被看见</p>
            <p className="pt-1 text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
              © 2026 知耕 Know Grow · 仅供学习交流
            </p>
          </div>
        </Section>
      </div>

      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-soil-800 px-4 py-2 text-xs text-white shadow-lg sm:text-sm dark:bg-soil-700"
          >
            <Check size={14} className="text-leaf-400" />
            已保存
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-soil-200 bg-white p-3.5 sm:p-4 dark:border-soil-700 dark:bg-soil-800">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-soil-800 sm:text-sm dark:text-soil-100">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({
  icon,
  title,
  desc,
  control,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <span className="mt-0.5 flex-shrink-0 text-soil-500 dark:text-soil-400">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-soil-800 dark:text-soil-100">{title}</p>
          <p className="text-2xs text-soil-500 sm:text-xs dark:text-soil-400">{desc}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
        checked ? 'bg-leaf-600' : 'bg-soil-300 dark:bg-soil-600'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      >
        {checked && <Check size={10} className="text-leaf-700" />}
      </span>
    </button>
  )
}
