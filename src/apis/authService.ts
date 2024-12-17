import { LoginResponse } from '../models/Authentication/LoginResponse'
import { SignupResponse } from '../models/Authentication/SignupResponse'
import appClient from './api'

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await appClient.post('/users/login', { email, password })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
export const signUpService = async (email: string, password: string): Promise<SignupResponse> => {
  try {
    const response = await appClient.post('/users/signUp', { email, password })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const setNameAndAvatarService = async (userId: string, name: string, avatar: string): Promise<string> => {
  try {
    const response = await appClient.post('/users/setNameAndAvatar', { userId, name, avatar })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const setNickNameUserService = async (userId: string, nickName: string): Promise<string> => {
  try {
    const response = await appClient.post('/users/setNickName', { userId, nickName })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<string> => {
  try {
    const response = await appClient.post('/users/changePassword', { userId, oldPassword, newPassword })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
