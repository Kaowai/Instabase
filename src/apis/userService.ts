import { Post } from '../models/post.model'
import { User, UserResponse } from '../models/User/User.model'
import { authClient } from './api'
// ** Search global user
// ********************************************
export const searchGlobalUserService = async (searchKey: string): Promise<UserResponse[]> => {
  try {
    const response = await authClient.get(`/users/search/${searchKey}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

// ** Get user followers
// ********************************************
export const getUserFollow = async (userId: string): Promise<User[]> => {
  try {
    const response = await authClient.get(`/users/followers/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

// ** Get user followers
// ********************************************
export const getUserFollowing = async (userId: string): Promise<User[]> => {
  try {
    const response = await authClient.get(`/users/following/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

// ** Get user by id
// ********************************************
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await authClient.get(`/users/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

// ** Get user recommend
// ********************************************
export const getUsersRecommend = async (userId: string): Promise<UserResponse[]> => {
  try {
    const response = await authClient.get(`/users/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const getUserByNickName = async (nickName: string): Promise<User> => {
  try {
    const response = await authClient.get(`/users/nickName/${nickName}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const searchFriendByFullName = async (userId: string, fullName: string): Promise<UserResponse> => {
  try {
    const response = await authClient.get(`/users/friends/${userId}/${fullName}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const followUserSerice = async (selfId: string, userFollowId: string): Promise<string> => {
  try {
    const response = await authClient.post('/users/follow', { selfId, userFollowId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const unFollowUserSerice = async (selfId: string, userFollowId: string): Promise<string> => {
  try {
    const response = await authClient.post('/users/unfollow', { selfId, userFollowId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const getRecommnedUser = async (userId: string): Promise<User[]> => {
  try {
    const response = await authClient.get(`/users/recommend/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const updateUserInfo = async (user: Partial<User>): Promise<User> => {
  try {
    const response = await authClient.put(`/users/${user.userId}`, user)
    return response.data
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    await authClient.put(`/users/${userId}/password`, { newPassword })
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}
