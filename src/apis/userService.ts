import { UserResponse } from '../models/User/User.model'
import appClient from './api'

// ** Search global user
// ********************************************
export const searchGlobalUserService = async (searchKey: string): Promise<UserResponse[]> => {
  try {
    const response = await appClient.get(`/users/search/${searchKey}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

// ** Get user followers
// ********************************************
export const getUserFollow = async (userId: string): Promise<UserResponse[]> => {
  try {
    const response = await appClient.get(`/users/followers/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

// ** Get user followers
// ********************************************
export const getUserFollowing = async (userId: string): Promise<UserResponse[]> => {
  try {
    const response = await appClient.get(`/users/following/${userId}`)
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
    const response = await appClient.get(`/users/${userId}`)
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
    const response = await appClient.get(`/users/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const getUserByNickName = async (nickName: string): Promise<UserResponse> => {
  try {
    const response = await appClient.get(`/users/nickName/${nickName}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const searchFriendByFullName = async (userId: string, fullName: string): Promise<UserResponse> => {
  try {
    const response = await appClient.get(`/users/friends/${userId}/${fullName}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const followUserSerice = async (selfId: string, userFollowId: string): Promise<string> => {
  try {
    const response = await appClient.post('/users/follow', { selfId, userFollowId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const unFollowUserSerice = async (selfId: string, userFollowId: string): Promise<string> => {
  try {
    const response = await appClient.post('/users/unfollow', { selfId, userFollowId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
