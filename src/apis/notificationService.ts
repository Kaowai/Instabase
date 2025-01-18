import { notificationClient } from './api'

export const getNotification = async (userId: string): Promise<Array<Notification>> => {
  try {
    const response = await notificationClient.get(`/notifications/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error when get user'
  }
}
