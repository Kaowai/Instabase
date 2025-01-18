export interface Story {
  storyId: string
  userId: string
  image: string
  sound: string
  isSaved: boolean
  createdDate: string
  userAlreadySeenStories: Array<string>
}

export interface StoryFeed {
  userId: string
  name: string
  avatar: string
  index: number
  listStory: StoryShort[]
}

export interface StoryShort {
  storyId: string
  image: string
  sound: string
  createdDate: string
}
