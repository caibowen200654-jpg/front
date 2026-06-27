import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, FileText, Heart, MessageCircle, MapPin, Sprout, Camera, X, Check, Calendar, User as UserIcon } from 'lucide-react'
import { useStore } from '../data/StoreContext'
import { Avatar } from '../components/Avatar'
import { formatTime } from '../utils/time'

type Tab = 'articles' | 'likes' | 'comments'

const TABS = [
  { key: 'articles' as const, label: '我的投稿', icon: FileText },
  { key: 'likes' as const, label: '收到的赞', icon: Heart },
  { key: 'comments' as const, label: '我的评论', icon: MessageCircle },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('articles')
  const { articles, profile, updateProfile } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userArticles = articles.filter((a) => a.authorId === profile.id)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (dataUrl) {
        updateProfile({ avatar: dataUrl })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleStartEdit = () => {
    setDraft(profile)
    setEditing(true)
  }

  const handleSave = () => {
    updateProfile(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(profile)
    setEditing(false)
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-6 shadow-sm dark:border-soil-700 dark:bg-soil-800">
          <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="group relative block rounded-full"
                  title="点击更换头像"
                  aria-label="更换头像"
                >
                  <Avatar
                    src={profile.avatar}
                    name={profile.name}
                    size="lg"
                    className="!h-14 !w-14 !bg-leaf-200 sm:!h-20 sm:!w-20"
                  />
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={18} className="text-white sm:!h-6 sm:!w-6" />
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-soil-800 sm:text-xl dark:text-soil-100">
                  {profile.name}
                </h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-2xs text-soil-500 sm:mt-1 sm:text-sm dark:text-soil-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {profile.region}
                  </span>
                  <span className="text-soil-300 dark:text-soil-600">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Sprout size={12} className="text-leaf-500" />
                    {profile.cropFocus}
                  </span>
                </div>
              </div>
            </div>
            {!editing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-soil-200 px-2.5 py-1.5 text-xs font-medium text-soil-600 transition-colors hover:bg-soil-50 sm:px-3 sm:py-2 sm:text-sm dark:border-soil-700 dark:text-soil-300 dark:hover:bg-soil-700"
              >
                <Edit3 size={12} className="sm:!h-3.5 sm:!w-3.5" />
                编辑资料
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 rounded-lg bg-soil-50 p-4 dark:bg-soil-700/40"
              >
                <div>
                  <label className="mb-1 block text-2xs font-medium text-soil-600 sm:text-xs dark:text-soil-300">
                    昵称
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 dark:border-soil-600 dark:bg-soil-800 dark:text-soil-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-2xs font-medium text-soil-600 sm:text-xs dark:text-soil-300">
                    所在地区
                  </label>
                  <input
                    type="text"
                    value={draft.region}
                    onChange={(e) => setDraft({ ...draft, region: e.target.value })}
                    className="w-full rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 dark:border-soil-600 dark:bg-soil-800 dark:text-soil-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-2xs font-medium text-soil-600 sm:text-xs dark:text-soil-300">
                    种植作物
                  </label>
                  <input
                    type="text"
                    value={draft.cropFocus}
                    onChange={(e) => setDraft({ ...draft, cropFocus: e.target.value })}
                    placeholder="如：玉米、小麦"
                    className="w-full rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 dark:border-soil-600 dark:bg-soil-800 dark:text-soil-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-2xs font-medium text-soil-600 sm:text-xs dark:text-soil-300">
                    种植年限
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={draft.experienceYears}
                    onChange={(e) => setDraft({ ...draft, experienceYears: Number(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 dark:border-soil-600 dark:bg-soil-800 dark:text-soil-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-2xs font-medium text-soil-600 sm:text-xs dark:text-soil-300">
                    个性签名
                  </label>
                  <textarea
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-100 dark:border-soil-600 dark:bg-soil-800 dark:text-soil-100"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1 rounded-lg border border-soil-200 px-3 py-1.5 text-xs font-medium text-soil-600 transition-colors hover:bg-soil-100 dark:border-soil-600 dark:text-soil-300 dark:hover:bg-soil-700"
                  >
                    <X size={12} />
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1 rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-leaf-700"
                  >
                    <Check size={12} />
                    保存
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg bg-soil-50 p-3 sm:p-4 dark:bg-soil-700/40"
              >
                <p className="text-xs leading-relaxed text-soil-600 sm:text-sm dark:text-soil-300">
                  {profile.bio}
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {formatTime(profile.joinedAt)} 加入
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserIcon size={11} />
                    种植 {profile.experienceYears} 年
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 rounded-2xl border border-soil-200 bg-white shadow-sm dark:border-soil-700 dark:bg-soil-800">
          <div className="flex border-b border-soil-100 dark:border-soil-700">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:py-3 sm:text-sm ${
                  activeTab === key
                    ? 'border-b-2 border-leaf-600 text-leaf-600 dark:border-leaf-400 dark:text-leaf-400'
                    : 'text-soil-400 hover:text-soil-600 dark:text-soil-500 dark:hover:text-soil-300'
                }`}
              >
                <Icon size={14} className="sm:!h-4 sm:!w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-4">
            {activeTab === 'articles' && (
              <div className="space-y-2.5 sm:space-y-3">
                {userArticles.length === 0 ? (
                  <p className="py-8 text-center text-xs text-soil-400 sm:text-sm dark:text-soil-500">暂无投稿</p>
                ) : (
                  userArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex gap-2.5 rounded-lg border border-soil-100 p-2.5 transition-colors hover:bg-soil-50 sm:gap-3 sm:p-3 dark:border-soil-700 dark:hover:bg-soil-700/40"
                    >
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-12 w-16 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-24"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-medium text-soil-800 line-clamp-1 sm:text-sm dark:text-soil-100">
                          {article.title}
                        </h3>
                        <p className="mt-0.5 text-2xs text-soil-400 line-clamp-1 sm:text-xs dark:text-soil-500">
                          {article.subtitle}
                        </p>
                        <div className="mt-1 flex items-center gap-2.5 text-2xs text-soil-400 sm:mt-1.5 sm:gap-3 sm:text-xs dark:text-soil-500">
                          <span className="inline-flex items-center gap-1">
                            <Heart size={10} />
                            {article.likes}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle size={10} />
                            {article.comments}
                          </span>
                          <span className="text-soil-300 dark:text-soil-600">{article.crop}</span>
                          <span className="text-soil-300 dark:text-soil-600">{formatTime(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab !== 'articles' && (
              <div className="flex flex-col items-center py-10 text-soil-400 sm:py-12 dark:text-soil-500">
                {activeTab === 'likes' ? <Heart size={36} className="mb-3" /> : <MessageCircle size={36} className="mb-3" />}
                <p className="text-xs sm:text-sm">
                  {activeTab === 'likes' ? '收到的赞' : '我的评论'}功能即将上线
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
