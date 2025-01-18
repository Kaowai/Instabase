import { Comment } from '../models/comment.model'
import { Post, PostInput, PostUpdate, ReelInput, UserLike } from '../models/post.model'
import { postClient } from './api'

export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await postClient.get(`/posts/${postId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getPersonalPage = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/personalPage/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getPersonalPagePost = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/personalPage/posts/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getPersonalPageReels = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/personalPage/reels/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getPostComment = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await postClient.get(`/posts/${postId}/comments`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getPostsLikeByUser = async (userId: string): Promise<Array<Post>> => {
  try {
    const response = await postClient.get(`/posts/likePosts/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}


export const getPostLike = async (postId: string): Promise<UserLike[]> => {
  try {
    const response = await postClient.get(`/posts/${postId}/likes`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const createPost = async (post: PostInput): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/create`, post)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const likePost = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/likePost`, { postId, userId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const commentPost = async (userId: string, postId: string, message: string): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/commentPost`, { postId, userId, message })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const replyComnent = async (
  userId: string,
  postId: string,
  commentId: string,
  message: string
): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/replyComment`, { postId, userId, message, commentId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const likeComment = async (commentId: string): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/likeComment`, { commentId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const markPostViewed = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/markViewed`, { userId, postId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getFeeds = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/user/${userId}/feeds`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getRandomPosts = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/explore/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getReels = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/reels/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const savePost = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/savePost`, { userId, postId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const unSavePost = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await postClient.delete(`/posts/unSavePost`, {
      data: { userId, postId }
    })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const getSavePost = async (userId: string): Promise<Post[]> => {
  try {
    const response = await postClient.get(`/posts/savePost/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const updatePost = async (post: PostUpdate): Promise<string> => {
  try {
    const response = await postClient.put(`/posts`, post)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const deletePost = async (postId: string): Promise<string> => {
  try {
    const response = await postClient.delete(`/posts/${postId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const deleteComment = async (commentId: string): Promise<string> => {
  try {
    const response = await postClient.delete(`/posts/deleteComment/${commentId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const upateComment = async (commentId: string, message: string): Promise<any> => {
  try {
    const response = await postClient.put(`/posts/updateComment`, { commentId, message })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const createReel = async (reel: ReelInput): Promise<string> => {
  try {
    const response = await postClient.post(`/posts/create/reel`, reel)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error when uploading new reel'
  }
}
