import { Comment } from '../models/comment.model'
import { Post } from '../models/post.model'
import appClient from './api'

export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await appClient.get(`/users/posts/${postId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const getPersonalPage = async (userId: string): Promise<Post[]> => {
  try {
    const response = await appClient.get(`/users/posts/personalPage/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const getPostComment = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await appClient.get(`/users/posts/${postId}/comments`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const getPostLike = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await appClient.get(`/users/posts/${postId}/comments`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const createPost = async (post: Post): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/create`, post)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const likePost = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/likePost`, { postId, userId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const commentPost = async (userId: string, postId: string, message: string): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/commentPost`, { postId, userId, message })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const replyComnent = async (
  userId: string,
  postId: string,
  commentId: string,
  message: string
): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/replyComment`, { postId, userId, message, commentId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const likeComment = async (commentId: string): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/likeComment`, { commentId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const markPostViewed = async (userId: string, postId: string): Promise<string> => {
  try {
    const response = await appClient.post(`/users/posts/markViewed`, { userId, postId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
