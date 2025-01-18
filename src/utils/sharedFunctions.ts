import { slides } from '../fake-data/slides-image.fake'
import { UserLike } from '../models/post.model'

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export const calculateTime = (date: string): string => {
  const now = new Date()
  console.log(date)
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - (past.getTime() + 7 * 60 * 60 * 1000)) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)

  if (diffInSeconds < 60) {
    return 'Now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  } else if (diffInHours < 24) {
    return `${diffInHours}h`
  } else if (diffInDays < 7) {
    return `${diffInDays}d`
  } else if (diffInDays < 30) {
    return `${diffInWeeks}w`
  } else {
    return new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })
  }
}

export const isLike = (postLike: UserLike[], userId: string): boolean => {
  return postLike.some((like) => like.userId === userId)
}

export const randomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * slides.length) // Lấy chỉ số ngẫu nhiên
  return slides[randomIndex] // Trả về ảnh ngẫu nhiên
}

export function formatDateString(input: string): string {
  const date = new Date(input)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string')
  }

  const day = date.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${day}, ${month} ${year}`
}
