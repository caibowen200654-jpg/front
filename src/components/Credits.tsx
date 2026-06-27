import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const CONTRIBUTORS = [
  { name: '蔡博文' },
  { name: '梁嘉育' },
  { name: '李劲灏' },
]

interface Confetti {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  rotation: number
  size: number
  origin: 'left' | 'right'
}

const CONFETTI_COLORS = [
  '#588a57', '#78a476', '#e2ede1',
  '#a68b6e', '#d3c5b0', '#d4a574',
  '#f4b860', '#f59e0b', '#ef4444', '#3b82f6',
]

function generateConfetti(origin: 'left' | 'right'): Confetti[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: Date.now() + i + Math.random() * 1000,
    x: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.6 + Math.random() * 1.2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8,
    origin,
  }))
}

export default function Credits() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [confetti, setConfetti] = useState<{ left: Confetti[]; right: Confetti[] }>({
    left: [],
    right: [],
  })
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (hasShown) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShown) {
          setIsVisible(true)
          setHasShown(true)
          setConfetti({
            left: generateConfetti('left'),
            right: generateConfetti('right'),
          })
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasShown])

  return (
    <section ref={ref} className="relative overflow-hidden" aria-label="制作人员">
      <AnimatePresence>
        {isVisible && (
          <>
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
              {[...confetti.left, ...confetti.right].map((c) => {
                const fromX = c.origin === 'left' ? -10 : 110
                const toX = c.x
                const fromY = 100
                const toY = -20 - Math.random() * 30
                return (
                  <motion.div
                    key={c.id}
                    initial={{ left: `${fromX}%`, top: `${fromY}%`, rotate: c.rotation, opacity: 1 }}
                    animate={{
                      left: [`${fromX}%`, `${toX}%`, `${toX + (c.origin === 'left' ? 8 : -8)}%`],
                      top: [`${fromY}%`, `${toY}%`, `${toY - 20}%`],
                      rotate: c.rotation + (c.origin === 'left' ? 720 : -720),
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: c.duration, delay: c.delay, ease: [0.22, 0.61, 0.36, 1], times: [0, 0.6, 1] }}
                    style={{ width: c.size, height: c.size * 1.6, backgroundColor: c.color, position: 'absolute' }}
                  />
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 mx-auto w-full max-w-3xl px-4 py-6 text-center sm:px-8 sm:py-10 lg:px-12"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
                className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-leaf-100 to-warm-100 text-leaf-600 sm:mb-3 sm:h-11 sm:w-11 dark:from-leaf-800 dark:to-warm-900 dark:text-leaf-300"
              >
                <Sparkles size={16} className="sm:size-[18px]" />
              </motion.div>

              <h2 className="mb-1 text-sm font-medium text-soil-600 sm:text-base dark:text-soil-300">
                制作团队
              </h2>
              <p className="mb-4 text-2xs text-soil-500 sm:mb-5 sm:text-xs dark:text-soil-400">
                感谢以下同学将知耕 Know Grow 带到现实
              </p>

              <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6 sm:gap-4">
                {CONTRIBUTORS.map((person, idx) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-leaf-500 to-warm-500 text-sm font-medium text-white shadow-sm sm:h-12 sm:w-12 sm:text-base">
                      {person.name.charAt(0)}
                    </div>
                    <p className="mt-1 text-2xs font-medium text-soil-700 sm:text-xs dark:text-soil-200">
                      {person.name}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mb-1.5 flex items-center justify-center gap-2 text-soil-400 sm:gap-3">
                <span className="h-px w-8 bg-soil-300 sm:w-12 dark:bg-soil-700" />
                <span className="font-serif text-2xs italic text-soil-500 sm:text-xs dark:text-soil-400">
                  知耕 Know Grow
                </span>
                <span className="h-px w-8 bg-soil-300 sm:w-12 dark:bg-soil-700" />
              </div>
              <p className="text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
                从土地到指尖 · 每一份经验都值得被看见
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
