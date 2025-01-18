import { Chat, Message } from '../models/chat.model'
import { chatClient } from './api'

export const getAllChatRooms = async (userId: string): Promise<Chat[]> => {
  try {
    const response = await chatClient.get(`/chat/users/${userId}/chatRooms`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const getMessageSpecificChatRoom = async (chatRoomId: string): Promise<Message[]> => {
  try {
    const response = await chatClient.get(`/chat/chatRooms/${chatRoomId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error when get user'
  }
}

export const sendTextMessage = async (userSendId: string, userReceiveId: string, message: string): Promise<string> => {
  try {
    const response = await chatClient.post(`/chat/sendText`, { userSendId, userReceiveId, message })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || 'Error when get user'
  }
}

export const sendMediaFileMessage = async (
  userSendId: string,
  userReceiveId: string,
  Images: string[]
): Promise<string> => {
  try {
    const response = await chatClient.post(`/chat/sendMedia`, { userSendId, userReceiveId, Images })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    throw error.response?.data || 'Error when get user'
  }
}
