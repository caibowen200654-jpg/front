import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Thermometer,
  Ruler,
  Sprout,
  FlaskConical,
  Bug,
  Wheat,
  MapPin,
  Cloud,
  User,
  FileText,
  ExternalLink,
  Tag,
  Search,
} from 'lucide-react'
import { CROP_TIPS, getCropImage } from '../data/cropTips'
import { useStore } from '../data/StoreContext'

interface InfoBlockProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoBlock({ icon, label, value }: InfoBlockProps) {
  return (
    <div className="rounded-xl border border-soil-200 bg-white p-3 sm:p-4 dark:border-soil-700 dark:bg-soil-800">
      <div className="mb-1.5 flex items-center gap-1.5 text-2xs text-soil-500 sm:text-xs dark:text-soil-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium leading-relaxed text-soil-800 sm:text-base dark:text-soil-100">{value}</p>
    </div>
  )
}

export default function CropInfoPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const { articles } = useStore()
  const [imgError, setImgError] = useState(false)

  const tip = useMemo(
    () => CROP_TIPS.find((t) => t.crop === decodeURIComponent(name || '')),
    [name]
  )

  const relatedArticles = useMemo(
    () => articles.filter((a) => a.crop === decodeURIComponent(name || '')).slice(0, 6),
    [articles, name]
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [name])

  if (!tip) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
        <span className="mb-4 text-5xl">🌾</span>
        <h2 className="mb-2 text-lg font-semibold text-soil-800 dark:text-soil-100">未找到该作物</h2>
        <p className="mb-5 text-sm text-soil-500 dark:text-soil-400">
          没有找到「{name}」的速查资料
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full bg-leaf-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
        >
          返回首页
        </button>
      </div>
    )
  }

  const imageUrl = getCropImage(tip.imageSeed, 1200, 500)

  return (
    <div className="w-full">
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-leaf-100 to-soil-100 sm:h-56 md:h-64 dark:from-soil-800 dark:to-soil-700">
        {!imgError && (
          <img
            src={imageUrl}
            alt={tip.crop}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-soil-700 shadow-md backdrop-blur transition-colors hover:bg-white sm:left-4 sm:top-4 dark:bg-soil-900/80 dark:text-soil-200"
          aria-label="返回"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">{tip.cropIcon}</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-2xs font-medium text-white backdrop-blur sm:text-xs">
                {tip.category}
              </span>
            </div>
            <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {tip.crop}
            </h1>
            <p className="text-xs text-white/80 sm:text-sm md:text-base">
              速查手册 · 点击查阅实战经验
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-soil-800 sm:mb-4 sm:text-lg dark:text-soil-100">
            <Sprout size={16} className="text-leaf-500" />
            关键种植参数
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            <InfoBlock icon={<Calendar size={12} />} label="适宜播期" value={tip.season} />
            <InfoBlock icon={<Thermometer size={12} />} label="适宜温度" value={tip.bestTemperature} />
            <InfoBlock icon={<Ruler size={12} />} label="株行距" value={tip.spacing} />
            <InfoBlock icon={<Sprout size={12} />} label="栽培密度" value={tip.density} />
            <div className="sm:col-span-2 md:col-span-3">
              <InfoBlock icon={<FlaskConical size={12} />} label="关键施肥" value={tip.fertilization} />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <InfoBlock icon={<Bug size={12} />} label="主要病虫害" value={tip.keyPest} />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <InfoBlock icon={<Wheat size={12} />} label="收获期与产量" value={tip.harvest} />
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="flex items-center gap-1.5 text-base font-semibold text-soil-800 sm:text-lg dark:text-soil-100">
              <FileText size={16} className="text-leaf-500" />
              公开权威经验分享
              <span className="ml-1 rounded-full bg-leaf-50 px-2 py-0.5 text-2xs font-medium text-leaf-700 sm:ml-2 sm:text-xs dark:bg-leaf-900/40 dark:text-leaf-300">
                {tip.experiences.length} 条
              </span>
            </h2>
          </div>
          {tip.experiences.length === 0 ? (
            <div className="rounded-xl border border-dashed border-soil-200 px-4 py-10 text-center dark:border-soil-700">
              <p className="text-sm text-soil-500 dark:text-soil-400">暂无已收录的实战经验</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {tip.experiences.map((exp) => (
                <a
                  key={exp.id}
                  href={exp.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-xl border border-soil-200 bg-white p-4 transition-all hover:border-leaf-300 hover:shadow-md sm:p-5 dark:border-soil-700 dark:bg-soil-800 dark:hover:border-leaf-700"
                >
                  <h3 className="mb-2.5 text-sm font-semibold leading-snug text-soil-800 group-hover:text-leaf-600 sm:text-base dark:text-soil-100 dark:group-hover:text-leaf-400">
                    {exp.title}
                  </h3>

                  <div className="mb-3 space-y-1.5 text-xs text-soil-500 dark:text-soil-400">
                    <div className="flex items-start gap-1.5">
                      <User size={12} className="mt-0.5 flex-shrink-0" />
                      <span className="truncate">{exp.author}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0 text-leaf-500" />
                      <span className="truncate">{exp.region}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Cloud size={12} className="mt-0.5 flex-shrink-0 text-blue-400" />
                      <span className="truncate">{exp.climate}</span>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-0.5 rounded-full bg-leaf-50 px-2 py-0.5 text-2xs font-medium text-leaf-700 sm:text-xs dark:bg-leaf-900/30 dark:text-leaf-300"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-soil-100 pt-2.5 text-2xs text-soil-400 sm:text-xs dark:border-soil-700 dark:text-soil-500">
                    <span className="truncate">{exp.source}</span>
                    <ExternalLink size={12} className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {relatedArticles.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h2 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-soil-800 sm:mb-4 sm:text-lg dark:text-soil-100">
              <Search size={16} className="text-leaf-500" />
              相关种植文章
              <span className="ml-1 rounded-full bg-soil-100 px-2 py-0.5 text-2xs font-medium text-soil-500 sm:ml-2 sm:text-xs dark:bg-soil-700 dark:text-soil-300">
                {relatedArticles.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {relatedArticles.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => navigate(`/article/${article.id}`)}
                  className="group flex items-center gap-3 rounded-xl border border-soil-200 bg-white p-3 text-left transition-all hover:border-leaf-300 hover:shadow-sm sm:p-3.5 dark:border-soil-700 dark:bg-soil-800 dark:hover:border-leaf-700"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-leaf-100 text-lg dark:bg-leaf-900/40">
                    {article.cropIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-soil-800 group-hover:text-leaf-600 dark:text-soil-100 dark:group-hover:text-leaf-400">
                      {article.title}
                    </p>
                    <p className="mt-0.5 truncate text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
                      {article.authorName} · {article.region}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl bg-soil-50 p-3 text-2xs text-soil-500 sm:p-4 sm:text-xs dark:bg-soil-800/50 dark:text-soil-400">
          <p className="break-words">
            <strong>数据来源：</strong>
            <a
              href={tip.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="source-link ml-1"
            >
              {tip.source}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
