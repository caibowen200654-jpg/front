import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, MapPin } from 'lucide-react'
import type { Article } from '../data/types'

export default function ArticleCard({ article }: { article: Article }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [imgError, setImgError] = useState(false)

  const handleClick = () => {
    navigate(`/article/${article.id}`, {
      state: { from: location.pathname + location.search },
    })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      layout
      className="group relative z-0 flex h-full w-[200px] flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-soil-200/80 bg-white shadow-sm transition-shadow hover:z-20 hover:shadow-lg sm:w-[240px] md:w-[280px] dark:border-soil-700/80 dark:bg-soil-800"
      onClick={handleClick}
    >
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-soil-200 to-soil-100 sm:h-40 md:h-44 dark:from-soil-700 dark:to-soil-600">
        {!imgError && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-soil-800 sm:text-sm dark:text-soil-100">
          {article.title}
        </h3>

        <p className="line-clamp-1 text-2xs leading-relaxed text-soil-500 sm:text-xs dark:text-soil-400">
          {article.subtitle}
        </p>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-2xs text-soil-400 dark:text-soil-500">
              <Heart size={10} className="text-soil-300 dark:text-soil-600" />
              {article.likes > 999 ? `${(article.likes / 1000).toFixed(1)}k` : article.likes}
            </span>
            <span className="inline-flex items-center gap-1 text-2xs text-soil-400 dark:text-soil-500">
              <MessageCircle size={10} className="text-soil-300 dark:text-soil-600" />
              {article.comments}
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-2xs text-soil-400 dark:text-soil-500">
            <MapPin size={10} className="text-soil-300 dark:text-soil-600" />
            {article.region.length > 3 ? article.region.slice(0, 3) : article.region}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
