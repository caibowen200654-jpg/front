import { useState } from 'react'
import { Mail, CheckCheck, Reply, MessageSquare } from 'lucide-react'
import { mockFeedbacks } from '../../data/mockData'
import type { Feedback } from '../../data/types'

export default function AdminMessages() {
  const [feedbacks] = useState<Feedback[]>(mockFeedbacks)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id))
  }

  const openReply = (id: string) => {
    setReplyTarget((prev) => (prev === id ? null : id))
    setReplyText('')
  }

  const handleReply = () => {
    if (!replyText.trim()) return
    setReplyTarget(null)
    setReplyText('')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Mail size={24} className="text-soil-600" />
        <h1 className="text-xl font-semibold text-soil-800">留言管理</h1>
      </div>

      {feedbacks.length === 0 ? (
        <div className="rounded-xl border border-soil-200 bg-white p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-soil-300" />
          <p className="mt-4 text-sm text-soil-400">暂无留言</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-xl border border-soil-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100">
                      <span className="text-sm font-medium text-leaf-600">
                        {feedback.userName.slice(0, 1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-soil-800">
                        {feedback.userName}
                      </span>
                      {feedback.contact && (
                        <span className="ml-2 text-xs text-soil-400">
                          {feedback.contact}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-soil-600">
                    {feedback.content}
                  </p>
                  <p className="mt-2 text-xs text-soil-400">
                    {new Date(feedback.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {!readIds.has(feedback.id) && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-2 text-xs font-medium text-leaf-600 transition-colors hover:bg-leaf-100"
                      onClick={() => markAsRead(feedback.id)}
                    >
                      <CheckCheck size={14} />
                      标记已读
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-soil-200 px-3 py-2 text-xs font-medium text-soil-500 transition-colors hover:bg-soil-50"
                    onClick={() => openReply(feedback.id)}
                  >
                    <Reply size={14} />
                    回复
                  </button>
                </div>
              </div>

              {replyTarget === feedback.id && (
                <div className="mt-4 border-t border-soil-100 pt-4">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`回复 ${feedback.userName}...`}
                    className="w-full rounded-lg border border-soil-200 px-3 py-2 text-sm text-soil-800 outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-soil-200 px-3 py-1.5 text-xs font-medium text-soil-500 transition-colors hover:bg-soil-50"
                      onClick={() => setReplyTarget(null)}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-leaf-700"
                      onClick={handleReply}
                    >
                      发送回复
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
