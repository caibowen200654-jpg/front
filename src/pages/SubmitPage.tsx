import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Send, CheckCircle } from 'lucide-react'
import { CROPS } from '../data/constants'

const SUBMITTABLE_CROPS = [...CROPS, '其他']
const CLIMATES = ['温带季风', '亚热带季风', '温带大陆性', '高原山地', '热带季风']

export default function SubmitPage() {
  const [crop, setCrop] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [region, setRegion] = useState('')
  const [climate, setClimate] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSaveDraft = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl"
    >
      <h1 className="mb-6 text-2xl font-semibold text-soil-800">分享你的方法论</h1>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-soil-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                作物选择
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
              >
                <option value="" disabled>请选择作物</option>
                {SUBMITTABLE_CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                所在地区
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="例如：河南周口"
                className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                气候类型
              </label>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
              >
                <option value="" disabled>请选择气候类型</option>
                {CLIMATES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-soil-700">
                标签
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="多个标签用逗号分隔"
                className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              副标题
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="请输入文章副标题"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              封面图片 URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
            {coverImage && (
              <div className="mt-3 overflow-hidden rounded-lg border border-soil-200">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="h-32 sm:h-40 lg:h-48 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请分享你的种植经验、技术方法..."
              className="h-40 sm:h-52 lg:h-64 w-full resize-y rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-soil-100 pt-6">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-lg border border-soil-200 px-4 py-2.5 text-sm font-medium text-soil-600 transition-colors hover:bg-soil-50"
          >
            <Save size={16} />
            保存草稿
          </button>
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-leaf-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
          >
            <Send size={16} />
            提交审核
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
              <CheckCircle size={16} />
              投稿已提交，等待审核
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>
  )
}
