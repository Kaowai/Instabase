import appClient from './api'

interface LoginResponse {
  userId: string
  nickName: string
  fullName: string
  avatar: string
}

export const loginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await appClient.post('/users/login', { email, password })
    return response.data
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
