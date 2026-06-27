import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Thermometer, Sprout } from 'lucide-react'
import type { CropTip } from '../data/cropTips'
import { getCropImage } from '../data/cropTips'

interface CropTipCardProps {
  tip: CropTip
  onClick: (tip: CropTip) => void
}

export default function CropTipCard({ tip, onClick }: CropTipCardProps) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = getCropImage(tip.imageSeed, tip.crop, 400, 300)

  const tempShort = tip.bestTemperature.split(' / ')[0]

  return (
    <motion.button
      type="button"
      onClick={() => onClick(tip)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative z-0 flex h-full w-[150px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-soil-200 bg-white text-left shadow-sm transition-shadow hover:z-20 hover:shadow-lg dark:border-soil-700 dark:bg-soil-800 sm:w-[170px] md:w-[180px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-leaf-100 to-soil-100 dark:from-soil-800 dark:to-soil-700">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={tip.crop}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl sm:text-3xl">
            {tip.cropIcon}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-2xs font-semibold text-soil-700 shadow-sm backdrop-blur dark:bg-soil-900/80 dark:text-soil-100">
          <span className="text-xs">{tip.cropIcon}</span>
          <span>{tip.crop}</span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 p-1.5 sm:p-2">
        <div className="flex items-center gap-1 text-2xs text-soil-500 dark:text-soil-400">
          <Calendar size={8} className="flex-shrink-0" />
          <span className="truncate">{tip.season.split('；')[0]}</span>
        </div>
        <div className="flex items-center gap-1 text-2xs text-soil-500 dark:text-soil-400">
          <Thermometer size={8} className="flex-shrink-0" />
          <span className="truncate">{tempShort}</span>
        </div>
        {tip.experiences.length > 0 && (
          <div className="mt-0.5 flex items-center gap-0.5 border-t border-soil-100 pt-0.5 text-2xs text-leaf-600 dark:border-soil-700 dark:text-leaf-400">
            <Sprout size={8} className="flex-shrink-0" />
            <span className="truncate">{tip.experiences.length} 篇文章</span>
          </div>
        )}
      </div>
    </motion.button>
  )
}
