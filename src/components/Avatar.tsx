import { useState } from 'react'
import { User } from 'lucide-react'

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-10 w-10 sm:h-10 sm:w-10 text-sm',
} as const

type AvatarSize = keyof typeof SIZE_CLASS

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  className?: string
  alt?: string
}

export function Avatar({ src, name, size = 'md', className = '', alt }: AvatarProps) {
  const [error, setError] = useState(false)
  const showFallback = error || !src
  const baseClass = `${SIZE_CLASS[size]} flex-shrink-0 rounded-full ${className}`

  if (showFallback) {
    return (
      <div
        className={`${baseClass} flex items-center justify-center bg-leaf-200 font-medium text-leaf-600 dark:bg-leaf-800 dark:text-leaf-300`}
        aria-label={name}
      >
        {name?.[0] ?? <User size={16} />}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? name}
      onError={() => setError(true)}
      className={`${baseClass} object-cover`}
    />
  )
}
