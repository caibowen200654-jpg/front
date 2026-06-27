import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'zhigeng_darkMode'

function getInitial(): { value: boolean; userSet: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return { value: stored === 'true', userSet: true }
  } catch { }
  if (typeof window !== 'undefined') {
    return { value: window.matchMedia('(prefers-color-scheme: dark)').matches, userSet: false }
  }
  return { value: false, userSet: false }
}

export function useTheme() {
  const [init] = useState(getInitial)
  const [isDark, setIsDark] = useState(init.value)
  const [userSet, setUserSet] = useState(init.userSet)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!userSet) {
        setIsDark(e.matches)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [userSet])

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch { }
      return next
    })
    setUserSet(true)
  }, [])

  return { isDark, toggle, setUserSet }
}
