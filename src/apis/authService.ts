import { LoginResponse } from '../models/Authentication/LoginResponse'
import { SignupResponse } from '../models/Authentication/SignupResponse'
import { authClient } from './api'

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await authClient.post('/users/login', { email, password })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}
export const signUpService = async (email: string, password: string): Promise<SignupResponse> => {
  try {
    const response = await authClient.post('/users/signUp', { email, password })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const setNameAndAvatarService = async (userId: string, name: string, avatar: string): Promise<string> => {
  try {
    const response = await authClient.post('/users/setNameAndAvatar', { userId, name, avatar })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.response)
    throw error.response?.data || 'Error'
  }
}

export const setNickNameUserService = async (userId: string, nickname: string): Promise<string> => {
  try {
    const response = await authClient.post('/users/setNickName', { userId, nickname })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.response)
    throw error.response?.data || 'Error'
  }
}

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<string> => {
  try {
    const response = await authClient.post('/users/changePassword', { userId, oldPassword, newPassword })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}
