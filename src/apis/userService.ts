import { UserResponse } from '../models/User/User.model'
import appClient from './api'

export const searchGlobalUserService = async (searchKey: string): Promise<UserResponse[]> => {
  try {
    const response = await appClient.get(`/users/search/${searchKey}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error'
  }
}
