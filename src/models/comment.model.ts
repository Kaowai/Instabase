export interface Comment {
  commentId: string
  userId: string
  name: string
  avatar: string
  message: string
  numberOfLike: number
  replyComment: Comment[]
}
