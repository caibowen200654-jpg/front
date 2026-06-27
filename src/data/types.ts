export interface Article {
  id: string
  crop: string
  cropIcon?: string
  authorName: string
  authorId: string
  authorAvatar: string
  title: string
  subtitle: string
  content: string
  coverImage: string
  tags: string[]
  region: string
  climate?: string
  climateDesc?: string
  likes: number
  comments: number
  createdAt: string
}

export interface User {
  id: string
  name: string
  avatar: string
  region: string
  bio: string
  joinedAt: string
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'reply' | 'approve' | 'system'
  message: string
  articleId?: string
  read: boolean
  createdAt: string
}

export interface Comment {
  id: string
  articleId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
}

export interface Feedback {
  id: string
  userName: string
  content: string
  contact?: string
  createdAt: string
}
