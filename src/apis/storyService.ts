import { StoryFeed, StoryShort } from '../models/story.model'
import { storyClient } from './api'

interface StoryResponse {
  storyId: string
}
export const createStory = async (userId: string, image: string, sound = 'none'): Promise<StoryResponse> => {
  try {
    const response = await storyClient.post(`/stories`, { userId, image, sound })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getAllStoriesFeed = async (userId: string): Promise<Array<StoryFeed>> => {
  try {
    const response = await storyClient.get(`/stories/user/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || 'Error'
  }
}

export const getSelfStory = async (userId: string): Promise<StoryFeed> => {
  try {
    const response = await storyClient.get(`/stories/self/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const deleteStory = async (storyId: string): Promise<string> => {
  try {
    const response = await storyClient.delete(`/stories/${storyId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const markSaveStory = async (userId: string, storyId: string): Promise<string> => {
  try {
    const response = await storyClient.post(`/stories/markSaved`, { userId, storyId })
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const getStoryById = async (storyId: string): Promise<StoryFeed> => {
  try {
    const response = await storyClient.get(`/stories/${storyId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}

export const getSavedStoryByUserId = async (userId: string): Promise<StoryFeed> => {
  try {
    const response = await storyClient.get(`/stories/user/savedStories/${userId}`)
    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response || 'Error'
  }
}
