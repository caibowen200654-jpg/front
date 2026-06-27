import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, BookOpen } from 'lucide-react'
import { useStore } from '../data/StoreContext'
import { CROPS } from '../data/constants'
import { CROP_TIPS, type CropTip } from '../data/cropTips'
import ArticleCard from '../components/ArticleCard'
import CropTipCard from '../components/CropTipCard'
import CropDetailModal from '../components/CropDetailModal'
import Credits from '../components/Credits'

const TITLES = [
  '从土地到指尖，\n每一份经验都值得被看见',
  '土地的回响，指尖的答案',
  '把大地装进屏幕，让经验自由流动',
  '每一双手，都是一所农学院',
  '从泥土到云端，种植智慧在生长',
  '田野无界，经验有声',
  '种地的人，值得被全世界看见',
  '你躬身耕耘的样子，就是最好的教科书',
  '大地不言，却给了所有回答',
  '让每一寸经验，都长出新的收成',
  '农人不说教，只把结果种给你看',
  '深耕一亩田，照亮万千路',
  '好把式，说出来才是活水',
  '指尖轻点，经验便落地生根',
  '你田里的秘密，是别人渴望的光',
  '从手心的茧，到屏幕的光',
  '种植不止靠天，更靠彼此看见',
  '让经验穿过屏幕，滴进另一片泥土',
  '一双手种地，千万双手传经',
  '泥土里长出的智慧，最该被收藏',
  '把丰收的密码，写进共享的土壤',
]

const SUBTITLES = [
  '汇聚全国新农人的种植方法论与智慧',
  '一个专门为种地人建造的经验库',
  '从华南稻田到西北大棚，种植心得实时共享',
  '把每一次试错，都变成集体的养分',
  '让老农谚与新农技，在同一块屏幕上相遇',
  '用分享，缩短从播种到丰收的距离',
  '看天看地看市场，先看同行怎么干',
  '不再一个人查资料，而是一群人给答案',
  '你的随手记，可能就是别人的救命方',
  '拆解每一道农事工序，沉淀可复用的经验',
  '将千万块零散的土地，连成一张智慧网',
  '这里只讲种地的真话、实话、管用的话',
  '让今天分享的除草技巧，成为明早田里的底气',
  '用最朴素的记录，做最扎实的农业知识库',
  '从土地到指尖，从指尖回到更远的土地',
  '让种植方法，像种子一样被传递下去',
  '一部由全国新农人共同编写的"活农书"',
  '经验不烂在田里，好法子不烂在心里',
  '种地遇到的所有问题，都能在这里找到同行者',
  '以分享致敬土地，以经验连结人心',
]

function pickDaily(key: string, pool: string[]): string {
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) return stored
  } catch { }
  const picked = pool[Math.floor(Math.random() * pool.length)]
  try { sessionStorage.setItem(key, picked) } catch { }
  return picked
}

export default function HomePage() {
  const navigate = useNavigate()
  const { articles } = useStore()
  const [selectedTip, setSelectedTip] = useState<CropTip | null>(null)

  const [title] = useState(() => pickDaily('hero_title', TITLES))
  const [subtitle] = useState(() => pickDaily('hero_sub', SUBTITLES))

  const groupedByCrop = useMemo(() => {
    const map = new Map<string, typeof articles>()
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const crop of CROPS) {
      if (!seen.has(crop)) {
        seen.add(crop)
        ordered.push(crop)
      }
    }
    for (const article of articles) {
      if (!seen.has(article.crop)) {
        seen.add(article.crop)
        ordered.push(article.crop)
      }
    }
    for (const crop of ordered) {
      const list = articles.filter((a) => a.crop === crop)
      if (list.length > 0) map.set(crop, list)
    }
    return map
  }, [articles])

  const scrollToContent = () => {
    document.getElementById('crop-sections')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full">
      <section className="relative flex min-h-[55vh] flex-col justify-center overflow-hidden bg-gradient-to-b from-leaf-50 via-soil-50 to-soil-100 px-4 sm:min-h-[75vh] sm:px-8 lg:min-h-[85vh] lg:px-12 dark:from-soil-900 dark:via-soil-900 dark:to-soil-800">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-leaf-50 px-4 py-1.5 text-sm text-leaf-600 dark:border-leaf-800 dark:bg-leaf-900 dark:text-leaf-300"
          >
            🌱 知耕 Know Grow
          </motion.div>

          <h1 className="mb-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-soil-800 whitespace-pre-line sm:text-3xl md:text-4xl lg:text-5xl lg:leading-tight dark:text-soil-100">
            {title}
          </h1>

          <p className="mb-8 text-sm text-soil-500 sm:text-base md:text-lg dark:text-soil-300">
            {subtitle}
          </p>

          <button
            type="button"
            onClick={scrollToContent}
            className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-leaf-700 active:scale-95 dark:bg-leaf-500 dark:hover:bg-leaf-400"
          >
            开始探索
            <ArrowDown size={18} className="animate-bounce" />
          </button>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 -z-0 opacity-30 dark:opacity-10">
          <div className="absolute left-1/4 top-1/4 hidden h-64 w-64 rounded-full bg-leaf-200 blur-3xl sm:block dark:bg-leaf-700" />
          <div className="absolute right-1/4 bottom-1/4 hidden h-80 w-80 rounded-full bg-warm-200 blur-3xl sm:block dark:bg-warm-800" />
        </div>
      </section>

      <section className="border-y border-soil-100 bg-gradient-to-b from-soil-50 to-white py-4 sm:py-6 dark:border-soil-800 dark:from-soil-900 dark:to-soil-900">
        <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-10">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-leaf-600 sm:size-4 dark:text-leaf-400" />
              <h2 className="text-sm font-semibold tracking-tight text-soil-800 sm:text-base dark:text-soil-100">
                常见作物速查
              </h2>
              <span className="rounded-full bg-soil-100 px-2 py-0.5 text-2xs font-medium text-soil-500 sm:text-xs dark:bg-soil-800 dark:text-soil-400">
                {CROP_TIPS.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-1.5 rounded-full border border-soil-200 px-3 py-1.5 text-2xs font-medium text-soil-500 transition-colors hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-600 sm:text-xs dark:border-soil-700 dark:text-soil-400 dark:hover:border-leaf-700 dark:hover:bg-leaf-900/30 dark:hover:text-leaf-400"
            >
              查看更多
              <ArrowRight size={12} className="sm:size-3.5" />
            </button>
          </div>

          <div className="-mx-3 snap-x snap-mandatory overflow-x-auto overflow-y-visible scrollbar-none sm:-mx-6 lg:-mx-10">
            <div className="flex gap-2 px-3 pt-2 pb-5 sm:gap-2.5 sm:px-6 sm:pt-2 sm:pb-6 lg:gap-3 lg:px-10 lg:pb-7">
              {CROP_TIPS.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10px' }}
                  transition={{ duration: 0.25, delay: (index % 8) * 0.02, ease: 'easeOut' }}
                  className="snap-start"
                >
                  <CropTipCard tip={tip} onClick={setSelectedTip} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="crop-sections" className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {Array.from(groupedByCrop.entries()).map(([crop, articles], groupIndex) => (
          <motion.section
            key={crop}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-soil-800 sm:text-lg dark:text-soil-100">{crop}</h2>
                <span className="rounded-full bg-soil-100 px-2.5 py-0.5 text-2xs font-medium text-soil-500 sm:text-xs dark:bg-soil-800 dark:text-soil-400">
                  {articles.length} 篇
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/search?crop=${encodeURIComponent(crop)}`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-soil-200 px-3 py-1.5 text-2xs font-medium text-soil-500 transition-colors hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-600 sm:text-xs dark:border-soil-700 dark:text-soil-400 dark:hover:border-leaf-700 dark:hover:bg-leaf-900/30 dark:hover:text-leaf-400"
              >
                查看全部
                <ArrowRight size={12} className="sm:size-3.5" />
              </button>
            </div>

            <div className="-mx-4 snap-x snap-mandatory overflow-x-auto overflow-y-visible scrollbar-none sm:-mx-8 lg:-mx-12">
              <div className="flex gap-4 px-4 pt-2 pb-6 sm:gap-5 sm:px-8 sm:pt-2 sm:pb-8 lg:gap-6 lg:px-12 lg:pb-10">
                {articles.map((article, cardIndex) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{
                      duration: 0.4,
                      delay: cardIndex * 0.08,
                      ease: 'easeOut',
                    }}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <Credits />

      <CropDetailModal tip={selectedTip} onClose={() => setSelectedTip(null)} />
    </div>
  )
}
