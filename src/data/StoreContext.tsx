import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Article, Comment, Notification } from './types'
import { mockArticles as defaultArticles, mockComments as defaultComments, mockNotifications as defaultNotifications } from './mockData'

const AVATAR_POOL = [
  'https://aka.doubaocdn.com/s/4ZBj1wfzxq',
  'https://aka.doubaocdn.com/s/PldO1wfzxw',
  'https://aka.doubaocdn.com/s/UtkU1wfzy2',
  'https://aka.doubaocdn.com/s/Hz9Z1wfzy9',
  'https://aka.doubaocdn.com/s/plRx1wfzyF',
  'https://aka.doubaocdn.com/s/VH811wfzyK',
  'https://aka.doubaocdn.com/s/9MQh1wfzyQ',
  'https://aka.doubaocdn.com/s/ETiq1wfzyW',
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function migrateAvatarUrl(url: string, key: string): string {
  if (url && !url.includes('pravatar.cc')) return url
  return `${AVATAR_POOL[hashString(key) % AVATAR_POOL.length]}?imageView2/1/w/200/h/200`
}

const CROP_IMAGE_MAP: Record<string, string> = {
  '玉米': 'https://aka.doubaocdn.com/s/YNXQ1wfziE',
  '水稻': 'https://aka.doubaocdn.com/s/z4vV1wfziP',
  '小麦': 'https://aka.doubaocdn.com/s/jjG21wfziV',
  '花生': 'https://aka.doubaocdn.com/s/YKvF1wfziz',
  '辣椒': 'https://aka.doubaocdn.com/s/9Kum1wfzin',
  '大豆': 'https://aka.doubaocdn.com/s/tQt71wfzs4',
  '番茄': 'https://aka.doubaocdn.com/s/xpiI1wfzia',
  '黄瓜': 'https://aka.doubaocdn.com/s/MyNe1wfzig',
  '马铃薯': 'https://aka.doubaocdn.com/s/nvep1wfzis',
  '大白菜': 'https://aka.doubaocdn.com/s/bzqw1wfzuq',
  '萝卜': 'https://aka.doubaocdn.com/s/JQW51wfzrh',
  '油菜': 'https://aka.doubaocdn.com/s/HZUd1wfzj5',
  '棉花': 'https://aka.doubaocdn.com/s/kc8z1wfzjB',
  '甘蔗': 'https://aka.doubaocdn.com/s/fwwZ1wfzqS',
  '甜菜': 'https://aka.doubaocdn.com/s/Puot1wfzqU',
  '向日葵': 'https://aka.doubaocdn.com/s/aj1d1wfzqa',
  '枸杞': 'https://aka.doubaocdn.com/s/Lchx1wfzqf',
  '草莓': 'https://aka.doubaocdn.com/s/IiYI1wfzql',
  '蓝莓': 'https://aka.doubaocdn.com/s/3RDa1wfzqr',
  '葡萄': 'https://aka.doubaocdn.com/s/N0Oh1wfzqF',
  '李杏': 'https://aka.doubaocdn.com/s/mVyC1wfzqx',
  '红枣': 'https://aka.doubaocdn.com/s/uRf11wfzr2',
  '核桃': 'https://aka.doubaocdn.com/s/uweM1wfzr8',
  '豇豆': 'https://aka.doubaocdn.com/s/34gF1wfzrE',
  '茄子': 'https://aka.doubaocdn.com/s/bS9P1wfzrJ',
  '花椰菜': 'https://aka.doubaocdn.com/s/psJg1wfzrP',
  '芹菜': 'https://aka.doubaocdn.com/s/VEa81wfzrV',
  '韭菜': 'https://aka.doubaocdn.com/s/1XN21wfzrb',
  '洋葱大蒜': 'https://aka.doubaocdn.com/s/9Izk1wfzrn',
  '西瓜': 'https://aka.doubaocdn.com/s/h0AC1wfzrs',
  '甜瓜': 'https://aka.doubaocdn.com/s/AWM01wfzry',
  '储粮': 'https://aka.doubaocdn.com/s/x3go1wfzte',
  '土壤改良': 'https://aka.doubaocdn.com/s/x6Wf1wfztj',
  '无人机': 'https://aka.doubaocdn.com/s/RVTE1wfztA',
  '设施农业': 'https://aka.doubaocdn.com/s/anQ91wfztG',
  '有机农业': 'https://aka.doubaocdn.com/s/2pJJ1wfztM',
  '绿肥': 'https://aka.doubaocdn.com/s/NU7j1wfztS',
  '鲜食玉米': 'https://aka.doubaocdn.com/s/YNXQ1wfziE',
  '青贮玉米': 'https://aka.doubaocdn.com/s/YNXQ1wfziE',
  '稻田养鸭': 'https://aka.doubaocdn.com/s/Sxk71wfzt4',
  '间套作': 'https://aka.doubaocdn.com/s/Cb1T1wfztY',
  '水旱轮作': 'https://aka.doubaocdn.com/s/Sxk71wfzt4',
  '大豆甘薯': 'https://aka.doubaocdn.com/s/tQt71wfzs4',
  '周年高产': 'https://aka.doubaocdn.com/s/Cb1T1wfztY',
  '苹果': 'https://aka.doubaocdn.com/s/5T4k1wfzpR',
  '柑橘': 'https://aka.doubaocdn.com/s/qrxj1wfzpX',
  '桃': 'https://aka.doubaocdn.com/s/xS4V1wfzpc',
  '梨': 'https://aka.doubaocdn.com/s/f5M41wfzpi',
  '樱桃': 'https://aka.doubaocdn.com/s/FTgd1wfzpn',
  '猕猴桃': 'https://aka.doubaocdn.com/s/ghZe1wfzpt',
  '菠萝': 'https://aka.doubaocdn.com/s/bvDY1wfzpz',
  '大蒜': 'https://aka.doubaocdn.com/s/FfiZ1wfzq5',
  '生姜': 'https://aka.doubaocdn.com/s/9x431wfzqA',
  '茶树': 'https://aka.doubaocdn.com/s/APFC1wfzqL',
  '甘薯': 'https://aka.doubaocdn.com/s/FM901wfztp',
  '肉牛': 'https://aka.doubaocdn.com/s/dCeZ1wfzsF',
  '肉羊': 'https://aka.doubaocdn.com/s/1gLT1wfzsh',
  '蛋鸡': 'https://aka.doubaocdn.com/s/QcRZ1wfzsK',
  '奶牛': 'https://aka.doubaocdn.com/s/ENdc1wfzs9',
  '生猪': 'https://aka.doubaocdn.com/s/0ODG1wfzsQ',
  '肉鸡': 'https://aka.doubaocdn.com/s/zBnt1wfzsV',
  '肉鹅': 'https://aka.doubaocdn.com/s/PCjy1wfzsb',
  '蜜蜂': 'https://aka.doubaocdn.com/s/d7Uq1wfzsn',
  '淡水鱼': 'https://aka.doubaocdn.com/s/416c1wfzst',
  '水产': 'https://aka.doubaocdn.com/s/r4Wc1wfzsy',
  '稻田种养': 'https://aka.doubaocdn.com/s/Sxk71wfzt4',
  '粪污处理': 'https://aka.doubaocdn.com/s/0ODG1wfzsQ',
  '芝麻': 'https://aka.doubaocdn.com/s/akrr1wfztu',
  '香菇': 'https://aka.doubaocdn.com/s/aT4V1wfzu1',
  '平菇': 'https://aka.doubaocdn.com/s/bEEy1wfzu7',
  '紫花苜蓿': 'https://aka.doubaocdn.com/s/vPkc1wfzuC',
  '亚麻': 'https://aka.doubaocdn.com/s/NGrR1wfzuI',
  '绿豆': 'https://aka.doubaocdn.com/s/1y5J1wfzuO',
  '红小豆': 'https://aka.doubaocdn.com/s/kUkr1wfzuT',
  '豌豆': 'https://aka.doubaocdn.com/s/AJUJ1wfzuY',
  '山药': 'https://aka.doubaocdn.com/s/jDN81wfzue',
  '蚕豆': 'https://aka.doubaocdn.com/s/iAgm1wfzuk',
}

const FALLBACK_IMAGE = 'https://aka.doubaocdn.com/s/YNXQ1wfziE'

function getImageForCrop(crop: string): string {
  return CROP_IMAGE_MAP[crop] ?? FALLBACK_IMAGE
}

function migrateImageUrl(url: string, crop?: string): string {
  if (url && !url.includes('picsum.photos') && !url.includes('unsplash.com')) {
    return url
  }
  if (crop) {
    return getImageForCrop(crop)
  }
  return FALLBACK_IMAGE
}

function migrateArticleImages(article: Article): Article {
  return {
    ...article,
    coverImage: migrateImageUrl(article.coverImage, article.crop),
    authorAvatar: migrateAvatarUrl(article.authorAvatar, article.authorId || article.id),
  }
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  region: string
  cropFocus: string
  experienceYears: number
  bio: string
  joinedAt: string
  stats: { articles: number; followers: number; following: number; likes: number }
}

export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large'
  reduceMotion: boolean
  autoTheme: boolean
  showClimate: boolean
  showCropTag: boolean
  notifyComment: boolean
  notifyLike: boolean
  notifyFollow: boolean
  notifyWeekly: boolean
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'current',
  name: '老周',
  avatar: 'https://i.pravatar.cc/200?u=current',
  region: '河南周口',
  cropFocus: '玉米、小麦',
  experienceYears: 30,
  bio: '三十年老农民，专注玉米和小麦种植，乐于分享田间地头的实战经验。',
  joinedAt: '2023-03-15',
  stats: { articles: 12, followers: 1284, following: 56, likes: 9876 },
}

const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 'medium',
  reduceMotion: false,
  autoTheme: true,
  showClimate: true,
  showCropTag: true,
  notifyComment: true,
  notifyLike: true,
  notifyFollow: true,
  notifyWeekly: false,
}

interface StoreContextType {
  articles: Article[]
  comments: Comment[]
  notifications: Notification[]
  likedArticles: Set<string>
  profile: UserProfile
  settings: UserSettings
  updateProfile: (data: Partial<UserProfile>) => void
  updateSettings: (data: Partial<UserSettings>) => void
  addComment: (comment: Comment) => void
  approveComment: (id: string) => void
  rejectComment: (id: string) => void
  toggleLike: (articleId: string) => void
  addArticle: (article: Article) => void
  updateArticle: (id: string, data: Partial<Article>) => void
  deleteArticle: (id: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`zhigeng_${key}`)
    if (raw) return JSON.parse(raw) as T
  } catch { }
  return fallback
}

const DATA_VERSION = 'v5-more-articles'
function checkDataVersion() {
  try {
    const v = localStorage.getItem('zhigeng_data_version')
    if (v !== DATA_VERSION) {
      // 数据版本变更：清除旧缓存，强制使用新数据
      localStorage.setItem('zhigeng_data_version', DATA_VERSION)
      try { localStorage.removeItem('zhigeng_articles') } catch {}
      try { localStorage.removeItem('zhigeng_profile') } catch {}
      try { localStorage.removeItem('zhigeng_comments') } catch {}
    }
  } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  checkDataVersion()
  const [articles, setArticles] = useState<Article[]>(() => {
    const loaded = loadFromStorage<Article[]>('articles', defaultArticles)
    return loaded.map((a) => migrateArticleImages(a))
  })
  const [comments, setComments] = useState<Comment[]>(() => {
    const loaded = loadFromStorage<Comment[]>('comments', defaultComments)
    return loaded.map((c) => ({
      ...c,
      userAvatar: migrateAvatarUrl(c.userAvatar, c.userId || c.id),
    }))
  })
  const [notifications] = useState<Notification[]>(defaultNotifications)
  const [likedArticles, setLikedArticles] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('zhigeng_likes')
      return raw ? new Set(JSON.parse(raw)) : new Set<string>()
    } catch { return new Set<string>() }
  })
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = loadFromStorage<UserProfile>('profile', DEFAULT_PROFILE)
    return { ...loaded, avatar: migrateAvatarUrl(loaded.avatar, loaded.id || 'current') }
  })
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage('settings', DEFAULT_SETTINGS)
  )

  useEffect(() => {
    localStorage.setItem('zhigeng_articles', JSON.stringify(articles))
  }, [articles])

  useEffect(() => {
    localStorage.setItem('zhigeng_comments', JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    localStorage.setItem('zhigeng_likes', JSON.stringify([...likedArticles]))
  }, [likedArticles])

  useEffect(() => {
    localStorage.setItem('zhigeng_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('zhigeng_settings', JSON.stringify(settings))
  }, [settings])

  // 应用字体大小到根元素
  useEffect(() => {
    const root = document.documentElement
    const sizeMap = { small: '14px', medium: '15px', large: '17px' }
    root.style.setProperty('font-size', sizeMap[settings.fontSize])
  }, [settings.fontSize])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }, [])

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }, [])

  const addComment = useCallback((comment: Comment) => {
    setComments((prev) => [comment, ...prev])
  }, [])

  const approveComment = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c))
    )
  }, [])

  const rejectComment = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' as const } : c))
    )
  }, [])

  const toggleLike = useCallback((articleId: string) => {
    setLikedArticles((prevLiked) => {
      const wasLiked = prevLiked.has(articleId)
      const next = new Set(prevLiked)
      if (wasLiked) next.delete(articleId)
      else next.add(articleId)
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.id === articleId
            ? { ...a, likes: a.likes + (wasLiked ? -1 : 1) }
            : a,
        ),
      )
      return next
    })
  }, [])

  const addArticle = useCallback((article: Article) => {
    setArticles((prev) => [article, ...prev])
  }, [])

  const updateArticle = useCallback((id: string, data: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    )
  }, [])

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return (
    <StoreContext.Provider
      value={{
        articles,
        comments,
        notifications,
        likedArticles,
        profile,
        settings,
        updateProfile,
        updateSettings,
        addComment,
        approveComment,
        rejectComment,
        toggleLike,
        addArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
