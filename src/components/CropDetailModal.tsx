import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
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
} from 'lucide-react'
import type { CropTip, Experience } from '../data/cropTips'
import { getCropImage } from '../data/cropTips'

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="rounded-lg bg-soil-50 p-2.5 sm:p-3 dark:bg-soil-700/40">
      <div className="mb-1 flex items-center gap-1.5 text-2xs text-soil-500 sm:text-xs dark:text-soil-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xs font-medium text-soil-800 sm:text-sm dark:text-soil-100">{value}</p>
    </div>
  )
}

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <a
      href={exp.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-xl border border-soil-200 bg-white p-3 transition-all hover:border-leaf-300 hover:shadow-md sm:p-4 dark:border-soil-700 dark:bg-soil-800 dark:hover:border-leaf-700"
    >
      <h4 className="mb-2 text-sm font-semibold text-soil-800 group-hover:text-leaf-600 sm:text-base dark:text-soil-100 dark:group-hover:text-leaf-400">
        {exp.title}
      </h4>

      <div className="mb-2.5 space-y-1 text-2xs text-soil-500 sm:text-xs dark:text-soil-400">
        <div className="flex items-center gap-1.5">
          <User size={11} className="flex-shrink-0" />
          <span className="truncate">{exp.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="flex-shrink-0 text-leaf-500" />
          <span className="truncate">{exp.region}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cloud size={11} className="flex-shrink-0 text-blue-400" />
          <span className="truncate">{exp.climate}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {exp.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full bg-leaf-50 px-2 py-0.5 text-2xs font-medium text-leaf-700 sm:text-xs dark:bg-leaf-900/30 dark:text-leaf-300"
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 text-2xs text-soil-400 sm:text-xs dark:text-soil-500">
        <span className="break-all">{exp.source}</span>
        <ExternalLink size={11} className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </a>
  )
}

interface CropDetailModalProps {
  tip: CropTip | null
  onClose: () => void
}

export default function CropDetailModal({ tip, onClose }: CropDetailModalProps) {
  useEffect(() => {
    if (!tip) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
  }, [tip, onClose])

  return (
    <AnimatePresence>
      {tip && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-soil-900/50 backdrop-blur-sm dark:bg-soil-950/70"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto fixed inset-x-0 top-1/2 z-50 max-h-[90vh] w-full -translate-y-1/2 overflow-y-auto bg-white shadow-2xl sm:inset-x-4 sm:max-h-[85vh] sm:rounded-2xl md:inset-x-auto md:left-1/2 md:w-[min(900px,calc(100vw-2rem))] md:-translate-x-1/2 dark:bg-soil-900"
            role="dialog"
            aria-label={`${tip.crop}详细信息`}
          >
            <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-leaf-100 to-soil-100 sm:h-40 dark:from-soil-800 dark:to-soil-700">
              <img
                src={getCropImage(tip.imageSeed, 900, 300)}
                alt={tip.crop}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-soil-700 shadow-md backdrop-blur transition-colors hover:bg-white sm:right-4 sm:top-4 dark:bg-soil-900/80 dark:text-soil-200 dark:hover:bg-soil-900"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">{tip.cropIcon}</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-2xs font-medium text-white backdrop-blur sm:text-xs">
                    {tip.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">{tip.crop} · 速查手册</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <section className="mb-5 sm:mb-6">
                <h3 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-soil-800 sm:mb-3 sm:text-base dark:text-soil-100">
                  <Sprout size={14} className="text-leaf-500" />
                  关键种植参数
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <InfoRow icon={<Calendar size={11} />} label="适宜播期" value={tip.season} />
                  <InfoRow icon={<Thermometer size={11} />} label="适宜温度" value={tip.bestTemperature} />
                  <InfoRow icon={<Ruler size={11} />} label="株行距" value={tip.spacing} />
                  <InfoRow icon={<Sprout size={11} />} label="栽培密度" value={tip.density} />
                  <div className="col-span-2">
                    <InfoRow icon={<FlaskConical size={11} />} label="关键施肥" value={tip.fertilization} />
                  </div>
                  <div className="col-span-2">
                    <InfoRow icon={<Bug size={11} />} label="主要病虫害" value={tip.keyPest} />
                  </div>
                  <div className="col-span-2">
                    <InfoRow icon={<Wheat size={11} />} label="收获期/产量" value={tip.harvest} />
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-2.5 flex items-center justify-between sm:mb-3">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-soil-800 sm:text-base dark:text-soil-100">
                    <FileText size={14} className="text-leaf-500" />
                    公开权威经验分享
                    <span className="ml-1 rounded-full bg-leaf-50 px-1.5 py-0.5 text-2xs font-medium text-leaf-700 sm:ml-2 sm:text-xs dark:bg-leaf-900/40 dark:text-leaf-300">
                      {tip.experiences.length}
                    </span>
                  </h3>
                </div>
                {tip.experiences.length === 0 ? (
                  <p className="rounded-lg bg-soil-50 px-4 py-6 text-center text-xs text-soil-500 sm:text-sm dark:bg-soil-800 dark:text-soil-400">
                    暂无已收录的实战经验
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                    {tip.experiences.map((exp) => (
                      <ExperienceCard key={exp.id} exp={exp} />
                    ))}
                  </div>
                )}
              </section>

              <div className="mt-5 flex flex-col gap-2 border-t border-soil-100 pt-4 text-2xs text-soil-400 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:text-xs dark:border-soil-700 dark:text-soil-500">
                <span className="break-all">数据来源：{tip.source}</span>
                <a
                  href={tip.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="source-link inline-flex w-fit items-center gap-1 break-all"
                >
                  查看原始来源
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
