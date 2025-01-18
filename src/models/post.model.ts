export interface Post {
  postId: string
  userId: string
  nickName: string
  avatar: string
  postTitle: string
  createdDate: string
  imageAndVideo: Array<string>
  listHagtags: Array<string>
  numberOfLike: number
  numberOfComment: number
  numberOfShare: number
}

export interface PostInput {
  userId: string
  postTitle: string
  imageAndVideo: Array<string>
  listHagtag: Array<string>
}

export interface PostUpdate {
  postId: string
  userId: string
  postTitle: string
  imageAndVideo: Array<string>
  listHagTag: Array<string>
}
export interface UserLike {
  userId: string
  name: string
  avatar: string
}

export interface ReelInput {
  userId: string
  postTitle: string
  video: string
  listHagTag: Array<string>
}
