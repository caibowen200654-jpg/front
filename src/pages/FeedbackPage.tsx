import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { mockFeedbacks } from '../data/mockData'

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setName('')
    setContact('')
    setContent('')
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-soil-800">意见反馈</h1>
        <p className="mt-1 text-sm text-soil-500">
          我们希望听到你的声音，帮助我们做得更好
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-soil-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入你的名字"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              联系方式 <span className="text-soil-400">（选填）</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="手机号或邮箱"
              className="w-full rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-soil-700">
              反馈内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述你的建议或遇到的问题..."
              rows={5}
              className="w-full resize-y rounded-lg border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none transition-colors focus:border-leaf-300 focus:bg-white focus:ring-2 focus:ring-leaf-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-leaf-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
        >
          提交反馈
        </button>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-leaf-50 p-3 text-sm text-leaf-600">
                <CheckCircle size={16} />
                感谢你的反馈！
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-soil-500 transition-colors hover:text-soil-700"
        >
          <MessageSquare size={16} />
          历史反馈
          {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {mockFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border border-soil-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-soil-800">
                        {feedback.userName}
                      </span>
                      <span className="text-xs text-soil-400">
                        {new Date(feedback.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-soil-600">
                      {feedback.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </div>
  )
}
