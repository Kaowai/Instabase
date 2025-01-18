export interface UserResponse {
  userId: string
  email: string
  password: string
  nickName: string
  fullName: string
  avatar: string
  fbId: string
}

export interface User {
  userId: string
  nickName: string
  fullName: string
  avatar: string
  isFollowing?: boolean
}
