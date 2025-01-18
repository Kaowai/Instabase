import React, { useEffect, useState } from 'react'
import AccountStory from '../../components/AccountStory/AccountStory'
import styles from './Home.module.css'
import PostLayout from '../../components/PostLayout/PostLayout'
import avatar1 from '../../assets/avatar1.webp'
import avatar2 from '../../assets/avatar2.webp'
import avatar3 from '../../assets/avatar3.jpg'
import avatar4 from '../../assets/avatar4.webp'
import AccountInfo from '../../components/AccountInfo/AccountInfo'
import { Post } from '../../models/post.model'
import { getFeeds, getRandomPosts } from '../../apis/postService'
import { getRecommnedUser } from '../../apis/userService'
import { User } from '../../models/User/User.model'
import { getAllStoriesFeed, getSavedStoryByUserId, getSelfStory } from '../../apis/storyService'
import { Story, StoryFeed } from '../../models/story.model'

const HomeLoadingSkeleton = () => (
  <div className='animate-pulse space-x-6'>
    <div className='animate-pulse space-y-6'>
      {/* Stories Loading */}
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className='flex flex-col items-center gap-1 min-w-[66px]'>
            <div className='w-16 h-16 rounded-full bg-gray-200'></div>
            <div className='w-14 h-3 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>

      {/* Posts Loading */}
      <div className='space-y-6'>
        {[1, 2, 3].map((item) => (
          <div key={item} className='bg-white rounded-lg border border-gray-200 p-4 space-y-4'>
            {/* Header */}
            <div className='flex items-center gap-2'>
              <div className='w-10 h-10 rounded-full bg-gray-200'></div>
              <div className='flex-1'>
                <div className='w-32 h-4 bg-gray-200 rounded'></div>
                <div className='w-24 h-3 bg-gray-100 rounded mt-1'></div>
              </div>
            </div>
            {/* Image */}
            <div className='aspect-square w-full bg-gray-200 rounded'></div>
            {/* Actions */}
            <div className='flex gap-4'>
              <div className='w-8 h-8 rounded-full bg-gray-200'></div>
              <div className='w-8 h-8 rounded-full bg-gray-200'></div>
              <div className='w-8 h-8 rounded-full bg-gray-200'></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Second Column Loading - User Info and Recommendations */}
    <div className={` animate-pulse space-x-5`}>
      {/* User Info Loading */}
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-12 h-12 rounded-full bg-gray-200'></div>
        <div className='flex-1'>
          <div className='w-32 h-4 bg-gray-200 rounded'></div>
          <div className='w-24 h-3 bg-gray-100 rounded mt-1'></div>
        </div>
      </div>

      {/* Suggestions Header */}
      <div className={styles.divide}>
        <div className='w-32 h-4 bg-gray-200 rounded'></div>
        <div className='w-16 h-4 bg-gray-200 rounded'></div>
      </div>

      {/* Recommended Users Loading */}
      <div className='space-y-4 mt-4'>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-full bg-gray-200'></div>
            <div className='flex-1'>
              <div className='w-24 h-3 bg-gray-200 rounded'></div>
              <div className='w-20 h-2 bg-gray-100 rounded mt-1'></div>
            </div>
            <div className='w-16 h-6 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Home = (): React.JSX.Element => {
  const [listPostNewFeeds, setListPostNewFeeds] = useState<Post[]>([])
  const [listUserRecommend, setListUserRecommend] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listStories, setListStories] = useState<Array<StoryFeed>>([])
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  useEffect(() => {
    if (user) {
      const userId = user.userId
      setIsLoading(true)
      Promise.all([
        getRecommnedUser(userId),
        getRandomPosts(userId),
        getAllStoriesFeed(userId),
        getSelfStory(userId),
        getSavedStoryByUserId(userId)
      ])
        .then(([users, posts, stories, selfStory, savedStory]) => {
          setListUserRecommend(users)
          if (selfStory?.listStory?.length > 0) {
            if (savedStory?.listStory?.length > 0) {
              selfStory.listStory = selfStory.listStory.filter(
                (self) => !savedStory.listStory.some((saved) => saved.storyId === self.storyId)
              )
            }
            console.log(selfStory)
            if (selfStory.listStory.length > 0) {
              stories.unshift(selfStory)
            }
          }
          setListStories(stories)
          setListPostNewFeeds(posts)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.grid_column1}></div>
      <div className={styles.grid_column2}>
        {isLoading ? (
          <HomeLoadingSkeleton />
        ) : (
          <>
            <div className={styles.story}>
              {listStories?.map((story) => <AccountStory key={story?.userId} isSeen={false} story={story} />)}
            </div>
            <div className={styles.post}>
              {listPostNewFeeds.map((post) => (
                <PostLayout key={post.postId} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.grid_column3}>
        {isLoading ? (
          // Second Column Loading State
          <div className='animate-pulse'>
            {/* User Info Loading */}
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 rounded-full bg-gray-200'></div>
              <div className='flex-1'>
                <div className='w-32 h-4 bg-gray-200 rounded'></div>
                <div className='w-24 h-3 bg-gray-100 rounded mt-1'></div>
              </div>
            </div>

            {/* Suggestions Header */}
            <div className={styles.divide}>
              <div className='w-32 h-4 bg-gray-200 rounded'></div>
              <div className='w-16 h-4 bg-gray-200 rounded'></div>
            </div>

            {/* Recommended Users Loading */}
            <div className='space-y-4 mt-4'>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-gray-200'></div>
                  <div className='flex-1'>
                    <div className='w-24 h-3 bg-gray-200 rounded'></div>
                    <div className='w-20 h-2 bg-gray-100 rounded mt-1'></div>
                  </div>
                  <div className='w-16 h-6 bg-gray-200 rounded'></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AccountInfo isOwner={true} user={user} />
            <div className={styles.divide}>
              <span>Suggested for you</span>
              <span>See All</span>
            </div>
            <div className={styles.recommendUser}>
              {listUserRecommend.map((user) => (
                <AccountInfo key={user?.userId} user={user} isOwner={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
