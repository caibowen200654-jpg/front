import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sprout, Phone, KeyRound, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleSendCode = () => {
    setError('')
    if (!phone) {
      setError('请输入手机号')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    if (countdown > 0) return
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone) {
      setError('请输入手机号')
      return
    }
    if (!code) {
      setError('请输入验证码')
      return
    }
    if (!agreed) {
      setError('请先同意服务条款')
      return
    }
    navigate('/')
  }

  const handleQuickLogin = () => {
    navigate('/')
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-leaf-200/40 blur-3xl dark:bg-leaf-900/30" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-soil-200/40 blur-3xl dark:bg-soil-700/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-soil-200 bg-white shadow-xl lg:grid-cols-2 dark:border-soil-700 dark:bg-soil-800"
      >
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-leaf-500 via-leaf-600 to-soil-600 p-8 text-white lg:flex lg:p-10">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Sprout size={20} />
              </div>
              <span className="text-lg font-semibold">知耕 Know Grow</span>
            </div>
            <h1 className="mb-3 text-2xl font-bold leading-tight">
              与千万新农人<br />共享种植智慧
            </h1>
            <p className="text-sm leading-relaxed text-white/80">
              权威农业知识库 · 实战经验分享 · AI 种植助手<br />
              助力每一块土地获得丰收
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: '60+ 权威农业文章持续更新' },
              { icon: Sparkles, text: 'DeepSeek AI 智能问答' },
              { icon: Sprout, text: '35 种常见作物速查' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2.5 text-sm"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon size={14} />
                </div>
                <span className="text-white/90">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-7 lg:hidden">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-100 dark:bg-leaf-900/40">
                <Sprout size={16} className="text-leaf-600 dark:text-leaf-400" />
              </div>
              <span className="text-base font-semibold text-soil-800 dark:text-soil-100">
                知耕 Know Grow
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-1 text-xl font-semibold text-soil-800 sm:text-2xl dark:text-soil-100">
              欢迎回来
            </h2>
            <p className="text-xs text-soil-500 sm:text-sm dark:text-soil-400">
              登录后开启你的种植成长之旅
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-soil-700 sm:text-sm dark:text-soil-300">
                手机号
              </label>
              <div className="group relative flex items-center overflow-hidden rounded-xl border border-soil-200 bg-soil-50 transition-all focus-within:border-leaf-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-leaf-100 dark:border-soil-700 dark:bg-soil-700/40 dark:focus-within:bg-soil-800 dark:focus-within:ring-leaf-900/30">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-soil-400 sm:h-12 sm:w-12 dark:text-soil-500">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 11)
                    setPhone(v)
                    if (error) setError('')
                  }}
                  placeholder="请输入手机号"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none sm:text-base dark:text-soil-100 dark:placeholder-soil-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-soil-700 sm:text-sm dark:text-soil-300">
                验证码
              </label>
              <div className="group relative flex items-center overflow-hidden rounded-xl border border-soil-200 bg-soil-50 transition-all focus-within:border-leaf-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-leaf-100 dark:border-soil-700 dark:bg-soil-700/40 dark:focus-within:bg-soil-800 dark:focus-within:ring-leaf-900/30">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-soil-400 sm:h-12 sm:w-12 dark:text-soil-500">
                  <KeyRound size={16} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(v)
                    if (error) setError('')
                  }}
                  placeholder="6 位短信验证码"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-soil-800 placeholder-soil-400 outline-none sm:text-base dark:text-soil-100 dark:placeholder-soil-500"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="mr-1.5 flex-shrink-0 whitespace-nowrap rounded-lg bg-leaf-50 px-3 py-1.5 text-xs font-medium text-leaf-600 transition-colors hover:bg-leaf-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-leaf-50 sm:mr-2 sm:px-3.5 sm:py-2 sm:text-sm dark:bg-leaf-900/30 dark:text-leaf-400 dark:hover:bg-leaf-900/50"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '发送验证码'}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {error}
              </motion.p>
            )}

            <label className="flex cursor-pointer items-start gap-2 select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-soil-300 text-leaf-600 focus:ring-leaf-300"
              />
              <span className="text-2xs text-soil-500 sm:text-xs dark:text-soil-400">
                我已阅读并同意 <a className="source-link inline" href="#">服务条款</a> 与 <a className="source-link inline" href="#">隐私政策</a>
              </span>
            </label>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-leaf-600 to-leaf-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-leaf-700 hover:to-leaf-800 sm:py-3 sm:text-base"
            >
              登录
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 border-t border-soil-100 pt-5 text-center dark:border-soil-700">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="text-xs text-soil-400 transition-colors hover:text-leaf-600 sm:text-sm dark:text-soil-500 dark:hover:text-leaf-400"
            >
              仅用于演示，点击免登录进入
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
