import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Cloud,
  Send,
  ArrowUp,
  Sparkles,
  Clock,
} from 'lucide-react'
import { useStore } from '../data/StoreContext'
import type { Comment } from '../data/types'
import { Avatar } from '../components/Avatar'
import { formatTime } from '../utils/time'

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="thinking-dot" />
      <span className="thinking-dot" />
      <span className="thinking-dot" />
    </span>
  )
}

function RichParagraph({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s，。；！？\u2018-\u201d\-、]+)/g
  const parts = text.split(urlRegex)
  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(` ${part} `) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="source-link"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { articles, comments, profile, likedArticles, toggleLike, addComment } = useStore()

  const article = useMemo(() => articles.find((a) => a.id === id), [articles, id])
  const liked = id ? likedArticles.has(id) : false

  const [commentText, setCommentText] = useState('')
  const [submittedComment, setSubmittedComment] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showClimate, setShowClimate] = useState(false)
  const [thinkingStep, setThinkingStep] = useState(0)

  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [id])

  useEffect(() => {
    if (!aiLoading) {
      setThinkingStep(0)
      return
    }
    const steps = ['理解问题', '检索相关知识', '组织回答']
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % steps.length
      setThinkingStep(i)
    }, 1200)
    return () => clearInterval(interval)
  }, [aiLoading])

  const approvedComments = useMemo(() => {
    if (!article) return []
    return comments.filter(
      (c) => c.articleId === article.id && c.status === 'approved',
    )
  }, [comments, article])

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-soil-400 dark:text-soil-500">
        <span className="mb-4 text-6xl">🌾</span>
        <p className="text-lg font-medium dark:text-soil-300">文章不存在</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 rounded-lg bg-leaf-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
        >
          返回首页
        </button>
      </div>
    )
  }

  const handleLike = () => {
    if (id) toggleLike(id)
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !id) return
    const newComment: Comment = {
      id: `comment-local-${Date.now()}`,
      articleId: id,
      userId: profile.id,
      userName: profile.name,
      userAvatar: profile.avatar,
      content: commentText.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    addComment(newComment)
    setSubmittedComment(commentText.trim())
    setCommentText('')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // ignore
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAiSubmit = async () => {
    if (!aiQuestion.trim() || aiLoading) return
    setAiLoading(true)
    setAiResponse(null)
    try {
      const res = await fetch('/api/deepseek/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `你是一位专业的农业种植顾问。你正在帮助用户理解一篇关于${article.crop}种植的文章。文章作者是${article.authorName}，位于${article.region}（${article.climate}，${article.climateDesc}）。文章内容如下：\n\n${article.content}\n\n请基于文章内容，用中文回答用户的问题。回答要专业、具体、实用。`,
            },
            { role: 'user', content: aiQuestion.trim() },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })
      const data = await res.json()
      setAiResponse(
        data.choices?.[0]?.message?.content ?? '抱歉，AI 暂时无法回答这个问题，请稍后重试。',
      )
    } catch {
      setAiResponse('网络连接失败，请检查网络后重试。')
    } finally {
      setAiLoading(false)
    }
  }

  const paragraphs = article.content.split('\n').filter((p) => p.trim())

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-40 overflow-hidden sm:h-52 md:h-60 lg:h-72 bg-gradient-to-br from-soil-200 to-soil-400 dark:from-soil-700 dark:to-soil-600">
          <motion.img
            src={article.coverImage}
            alt={article.title}
            initial={{ scale: 1.1, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
            <motion.h1
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-1.5 text-lg font-bold leading-snug text-white sm:text-2xl md:text-3xl"
            >
              {article.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xs text-white/70 sm:text-sm md:text-base"
            >
              {article.subtitle}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mb-5"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <Avatar src={article.authorAvatar} name={article.authorName} size="md" />
            <div>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span>{article.cropIcon}</span>
                <span className="font-medium text-soil-800 dark:text-soil-200">{article.crop}</span>
                <span className="text-soil-300 dark:text-soil-600">丨</span>
                <span className="font-medium text-soil-800 dark:text-soil-200">{article.authorName}</span>
              </div>
              <div className="flex items-center gap-3 text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} />
                  {formatTime(article.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`/search?region=${encodeURIComponent(article.region)}`)}
              className="inline-flex items-center gap-1 rounded-full bg-soil-100 dark:bg-soil-700 px-2.5 py-1 text-2xs font-medium text-soil-600 dark:text-soil-300 transition-colors hover:bg-soil-200 dark:hover:bg-soil-600 sm:text-xs"
            >
              <MapPin size={12} className="text-leaf-500" />
              {article.region}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowClimate(!showClimate)}
                className="inline-flex items-center gap-1 rounded-full bg-soil-100 dark:bg-soil-700 px-2.5 py-1 text-2xs font-medium text-soil-600 dark:text-soil-300 transition-colors hover:bg-soil-200 dark:hover:bg-soil-600 sm:text-xs"
              >
                <Cloud size={12} className="text-leaf-500" />
                {article.climate}
              </button>
              {showClimate && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full z-20 mt-2 max-w-[calc(100vw-2rem)] w-64 rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 p-3 shadow-lg"
                >
                  <p className="text-xs leading-relaxed text-soil-600 dark:text-soil-300">
                    {article.climateDesc}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowClimate(false)}
                    className="mt-2 text-xs text-leaf-600 hover:text-leaf-700 dark:text-leaf-400 dark:hover:text-leaf-300"
                  >
                    关闭
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-leaf-100 dark:bg-leaf-900/30 px-2 py-0.5 text-2xs font-medium text-leaf-600 dark:text-leaf-400 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-8"
        >
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="mb-3 text-xs leading-relaxed text-soil-700 sm:mb-4 sm:text-sm sm:leading-[1.85] dark:text-soil-200"
            >
              <RichParagraph text={paragraph} />
            </p>
          ))}
        </motion.article>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="rounded-2xl border border-leaf-200 dark:border-leaf-800 bg-gradient-to-br from-leaf-50 to-soil-50 dark:from-leaf-900/20 dark:to-soil-900/30 p-4 sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <Sparkles size={16} className="text-leaf-600 dark:text-leaf-400 sm:!h-5 sm:!w-5" />
            <h3 className="text-base font-semibold text-leaf-700 sm:text-lg dark:text-leaf-400">
              AI 种植助手
            </h3>
          </div>

          <p className="mb-3 text-xs text-soil-500 sm:mb-4 sm:text-sm dark:text-soil-400">
            基于你的种植方案，向 AI 助手提出你的问题，获取个性化建议
          </p>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <textarea
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAiSubmit()
                }
              }}
              placeholder="问问我关于这种植方案的问题...（Enter 发送，Shift+Enter 换行）"
              rows={3}
              disabled={aiLoading}
              className="w-full resize-none rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 px-3 py-2.5 text-xs text-soil-800 outline-none transition-colors focus:border-leaf-300 focus:ring-2 focus:ring-leaf-50 disabled:opacity-60 sm:px-4 sm:py-3 sm:text-sm dark:text-soil-200 dark:placeholder-soil-500 dark:focus:ring-leaf-900/30"
            />

            <button
              type="button"
              onClick={handleAiSubmit}
              disabled={!aiQuestion.trim() || aiLoading}
              className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-leaf-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-leaf-700 disabled:opacity-50 sm:px-5 sm:text-sm"
            >
              {aiLoading ? (
                <>
                  <span className="thinking-wave inline-block">💭</span>
                  AI 思考中
                  <ThinkingDots />
                </>
              ) : (
                <>
                  <Sparkles size={14} className="sm:!h-4 sm:!w-4" />
                  咨询 AI
                </>
              )}
            </button>
          </div>

          {aiLoading && !aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-xl border border-leaf-200 dark:border-leaf-800 bg-white/60 dark:bg-soil-800/60 px-3 py-2.5 text-xs text-soil-500 sm:mt-4 sm:text-sm dark:text-soil-400"
            >
              <Sparkles size={12} className="text-leaf-500 sm:!h-3.5 sm:!w-3.5" />
              <span className="font-medium text-leaf-600 dark:text-leaf-400">
                {['理解你的问题', '检索相关文章', '组织专业回答'][thinkingStep]}
              </span>
              <ThinkingDots />
            </motion.div>
          )}

          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-3 rounded-xl border border-leaf-200 dark:border-leaf-800 bg-white dark:bg-soil-800 p-3 sm:mt-4 sm:p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={12} className="text-leaf-600 dark:text-leaf-400 sm:!h-3.5 sm:!w-3.5" />
                <span className="text-2xs font-medium text-leaf-600 sm:text-xs dark:text-leaf-400">
                  DeepSeek AI 回答
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-soil-700 dark:text-soil-200 overflow-x-auto text-xs sm:text-sm
                prose-headings:font-semibold prose-headings:text-soil-800 dark:prose-headings:text-soil-100
                prose-h1:text-base prose-h1:sm:text-lg prose-h2:text-sm prose-h2:sm:text-base prose-h3:text-xs prose-h3:sm:text-sm
                prose-p:leading-relaxed prose-p:my-1.5 sm:prose-p:my-2
                prose-strong:text-soil-800 dark:prose-strong:text-soil-100 prose-strong:font-semibold
                prose-code:bg-soil-100 dark:prose-code:bg-soil-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-2xs sm:prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-soil-800 prose-pre:text-soil-100 prose-pre:rounded-xl prose-pre:px-3 prose-pre:py-2 sm:prose-pre:px-4 sm:prose-pre:py-3
                prose-ul:my-1.5 sm:prose-ul:my-2 prose-li:my-0.5 sm:prose-li:my-1 prose-li:leading-relaxed
                prose-ol:my-1.5 sm:prose-ol:my-2
                prose-blockquote:border-leaf-400 prose-blockquote:bg-leaf-50/50 dark:prose-blockquote:bg-leaf-900/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1.5 prose-blockquote:px-3 sm:prose-blockquote:py-2 sm:prose-blockquote:px-4 prose-blockquote:not-italic
                prose-a:text-leaf-600 prose-a:underline
                prose-table:border-collapse prose-th:bg-soil-100 dark:prose-th:bg-soil-700 prose-th:px-2 prose-th:py-1.5 sm:prose-th:px-3 sm:prose-th:py-2 prose-th:text-2xs sm:prose-th:text-xs prose-th:font-semibold prose-td:border prose-td:border-soil-200 dark:prose-td:border-soil-700 prose-td:px-2 prose-td:py-1.5 sm:prose-td:px-3 sm:prose-td:py-2 prose-td:text-2xs sm:prose-td:text-xs
                [&_hr]:border-soil-200 dark:[&_hr]:border-soil-700
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiResponse}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <MessageCircle size={16} className="text-leaf-600 dark:text-leaf-400" />
            <h3 className="text-base font-semibold text-soil-800 sm:text-lg dark:text-soil-200">
              评论
              <span className="ml-1.5 text-xs font-normal text-soil-400 sm:ml-2 sm:text-sm dark:text-soil-500">
                (需审核后可见)
              </span>
            </h3>
          </div>

          {approvedComments.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {approvedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center gap-2.5 sm:gap-3">
                    <Avatar src={comment.userAvatar} name={comment.userName} size="sm" />
                    <div>
                      <span className="text-xs font-medium text-soil-800 sm:text-sm dark:text-soil-200">
                        {comment.userName}
                      </span>
                      <span className="ml-1.5 text-2xs text-soil-400 sm:ml-2 sm:text-xs dark:text-soil-500">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-soil-600 sm:text-sm dark:text-soil-300">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-soil-400 sm:py-8 sm:text-sm dark:text-soil-500">
              暂无评论，来发表第一条评论吧
            </p>
          )}

          {submittedComment && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl border border-warm-200 bg-warm-50 p-3 sm:mt-4 sm:p-4"
            >
              <p className="mb-1 text-2xs text-warm-600 sm:text-xs">你的评论已提交，审核通过后将显示</p>
              <p className="text-xs text-soil-700 sm:text-sm dark:text-soil-200">{submittedComment}</p>
            </motion.div>
          )}

          <div className="mt-3 flex gap-2.5 sm:mt-4 sm:gap-3">
            <Avatar
              src={profile.avatar}
              name={profile.name}
              size="md"
              className="hidden sm:flex"
            />
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-800 px-3 py-1.5 focus-within:border-leaf-300 focus-within:ring-2 focus-within:ring-leaf-50 sm:px-4 sm:py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommentSubmit()
                }}
                placeholder="写下你的评论..."
                className="min-w-0 flex-1 bg-transparent text-xs text-soil-800 outline-none sm:text-sm dark:text-soil-200 dark:placeholder-soil-500"
              />
              <button
                type="button"
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className="flex-shrink-0 rounded-lg p-1.5 text-leaf-600 transition-colors hover:bg-leaf-50 disabled:opacity-30 dark:text-leaf-400 dark:hover:bg-leaf-900/30"
                aria-label="发送评论"
              >
                <Send size={14} className="sm:!h-4 sm:!w-4" />
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="sticky bottom-3 z-30 mx-auto mt-6 w-full max-w-4xl px-4 sm:bottom-4 sm:px-8 lg:max-w-5xl lg:px-12"
      >
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-soil-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-lg dark:border-soil-700 dark:bg-soil-900/90 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleLike}
              className="inline-flex items-center gap-1.5 text-xs transition-colors sm:text-sm"
              aria-label={liked ? '取消点赞' : '点赞'}
            >
              <Heart
                size={16}
                className={liked ? 'fill-red-500 text-red-500' : 'text-soil-500 dark:text-soil-400 sm:!h-5 sm:!w-5'}
              />
              <span className="font-medium text-soil-700 dark:text-soil-200">
                {article.likes}
              </span>
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs text-soil-500 sm:text-sm dark:text-soil-400">
              <MessageCircle size={16} className="sm:!h-5 sm:!w-5" />
              <span className="font-medium">{approvedComments.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 rounded-full bg-soil-100 dark:bg-soil-700 px-2.5 py-1 text-2xs font-medium text-soil-600 transition-colors hover:bg-soil-200 sm:px-3 sm:text-xs dark:text-soil-300 dark:hover:bg-soil-600"
              aria-label="回到顶部"
            >
              <ArrowUp size={12} className="sm:!h-3.5 sm:!w-3.5" />
              顶部
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 rounded-full bg-leaf-100 dark:bg-leaf-900/30 px-2.5 py-1 text-2xs font-medium text-leaf-600 transition-colors hover:bg-leaf-200 sm:px-3 sm:text-xs dark:text-leaf-400 dark:hover:bg-leaf-900/50"
            >
              <Share2 size={12} className="sm:!h-3.5 sm:!w-3.5" />
              {copied ? '已复制' : '分享'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
