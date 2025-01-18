import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoMdClose } from 'react-icons/io'
import StoryCard from '../../components/StoryCard/StoryCard'
import { StoryFeed } from '../../models/story.model'
import { getAllStoriesFeed, getSavedStoryByUserId, getSelfStory, getStoryById } from '../../apis/storyService'
import { calculateTime, randomImage } from '../../utils/sharedFunctions'
import { motion } from 'framer-motion'
import { slides } from '../../fake-data/slides-image.fake'
import { RenderMedia } from '../../utils/renderImage'

const Story = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [stories, setStories] = useState<Array<StoryFeed>>([])
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const [isFromArchive, setIsFromArchive] = useState<boolean>(false)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await getAllStoriesFeed(userId)
        const selfStory = await getSelfStory(userId)
        const savedStory = await getSavedStoryByUserId(userId)

        if (selfStory?.listStory?.length > 0) {
          if (savedStory?.listStory?.length > 0) {
            selfStory.listStory = selfStory.listStory.filter(
              (self) => !savedStory.listStory.some((saved) => saved.storyId === self.storyId)
            )
          }
          if (selfStory.listStory.length > 0) {
            fetchedStories.unshift(selfStory)
          }
        }
        setStories(Array.isArray(fetchedStories) ? fetchedStories : [fetchedStories])

        // Set initial story index based on URL param
        const userIdStory = location.state?.userId
        const initialIndex = fetchedStories.findIndex((story) => story.userId === userIdStory)
        setCurrentUserIndex(initialIndex >= 0 ? initialIndex : 0)
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    }

    const fetchStoriesFromArchive = async () => {
      try {
        const saveStory = await getSavedStoryByUserId(userId)
        const fetchedStories: Array<StoryFeed> = []
        for (const story of saveStory.listStory) {
          const res = await getStoryById(story.storyId)
          fetchedStories.push(res)
        }
        console.log(fetchedStories)
        setStories(Array.isArray(fetchedStories) ? fetchedStories : [fetchedStories])
        setIsFromArchive(true)
        // Set initial story index based on URL param
        const storyId = location.state?.storyId
        const initialIndex = fetchedStories.findIndex((story) => story.listStory[0].storyId === storyId)
        setCurrentUserIndex(initialIndex >= 0 ? initialIndex : 0)
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    }

    if (location.state.from === '/stories/archive') {
      fetchStoriesFromArchive()
    } else {
      fetchStories()
    }
  }, [location.state])

  const navigateBack = () => {
    navigate(-1)
  }

  const handleStoryComplete = () => {
    console.log('Complete')
    if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1)
      if (isFromArchive) {
        navigate(`/stories/${stories[currentUserIndex + 1].userId}`, {
          replace: true,
          state: { from: '/stories/archive', storyId: stories[currentUserIndex + 1].listStory[0].storyId }
        })
      } else {
        navigate(`/stories/${stories[currentUserIndex + 1].userId}`, {
          replace: true,
          state: { userId: stories[currentUserIndex + 1].userId }
        })
      }
    }
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentUserIndex > 0) {
        setCurrentUserIndex((prev) => prev - 1)
        if (isFromArchive) {
          navigate(`/stories/${stories[currentUserIndex - 1].userId}`, {
            replace: true,
            state: { from: '/stories/archive', storyId: stories[currentUserIndex - 1].listStory[0].storyId }
          })
        } else {
          navigate(`/stories/${stories[currentUserIndex - 1].userId}`, {
            replace: true,
            state: { userId: stories[currentUserIndex - 1].userId }
          })
        }
      }
    } else {
      if (currentUserIndex < stories.length - 1) {
        setCurrentUserIndex((prev) => prev + 1)
        if (isFromArchive) {
          navigate(`/stories/${stories[currentUserIndex + 1].userId}`, {
            replace: true,
            state: { from: '/stories/archive', storyId: stories[currentUserIndex + 1].listStory[0].storyId }
          })
        } else {
          navigate(`/stories/${stories[currentUserIndex + 1].userId}`, {
            replace: true,
            state: { userId: stories[currentUserIndex + 1].userId }
          })
        }
      }
    }
  }

  return (
    <div className='flex relative justify-center items-center h-screen bg-[#1a1a1a]'>
      {/* Story Preview Bar */}
      <div className='fixed top-0 left-1 cursor-pointer z-10' onClick={() => navigate('/')}>
        <h1 className='text-white logo'>Instacloud</h1>
      </div>
      <div className='fixed top-4 right-4 z-10'>
        <IoMdClose onClick={navigateBack} fill='white' size={32} className='cursor-pointer text-white' />
      </div>
      <div className='w-full min-w-[400px] h-full gap-10 flex justify-center items-center '>
        <div className='relative w-[180px] h-[320px] rounded-xl overflow-hidden'>
          {currentUserIndex > 1 && (
            <>
              <RenderMedia
                mediaUrl={
                  stories[currentUserIndex - 2]?.listStory[0]?.image
                    ? stories[currentUserIndex - 2]?.listStory[0]?.image
                    : randomImage()
                }
                cssOverride='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center'>
                <div className='p-1 rounded-full border-2 border-pink-600'>
                  <img
                    src={stories[currentUserIndex - 2]?.avatar}
                    className='w-16 h-16 rounded-full object-cover'
                    alt='User avatar'
                  />
                </div>
                <span className='text-white mt-2'>{stories[currentUserIndex - 2]?.name}</span>
                <span className='text-grey-color2'>
                  {calculateTime(stories[currentUserIndex - 2]?.listStory[0]?.createdDate)}
                </span>
              </div>
            </>
          )}
        </div>
        <div className='relative w-[180px] h-[320px] rounded-xl overflow-hidden'>
          {currentUserIndex > 0 && (
            <>
              <RenderMedia
                mediaUrl={
                  stories[currentUserIndex - 1]?.listStory[0]?.image
                    ? stories[currentUserIndex - 1]?.listStory[0]?.image
                    : randomImage()
                }
                cssOverride='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center'>
                <div className='p-1 rounded-full border-2 border-pink-600'>
                  <img
                    src={stories[currentUserIndex - 1]?.avatar}
                    className='w-16 h-16 rounded-full object-cover'
                    alt='User avatar'
                  />
                </div>
                <span className='text-white mt-2'>{stories[currentUserIndex - 1]?.name}</span>
                <span className='text-grey-color2'>
                  {calculateTime(stories[currentUserIndex - 1]?.listStory[0]?.createdDate)}
                </span>
              </div>
            </>
          )}
        </div>
        {/* Story View */}
        {stories[currentUserIndex] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='max-w-[400px] min-w-[400px] h-full py-4 relative'
          >
            <StoryCard
              isActive={true}
              isNavigateLeft={currentUserIndex > 0}
              isNavigateRight={currentUserIndex < stories?.length - 1}
              avatar={stories[currentUserIndex].avatar}
              name={stories[currentUserIndex].name}
              storyList={stories[currentUserIndex].listStory}
              onComplete={handleStoryComplete}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}
        <div className='relative w-[180px] h-[320px] rounded-xl overflow-hidden'>
          {stories?.length > 1 && currentUserIndex < stories.length - 1 && (
            <>
              <RenderMedia
                mediaUrl={
                  stories[currentUserIndex + 1]?.listStory[0]?.image
                    ? stories[currentUserIndex + 1]?.listStory[0]?.image
                    : randomImage()
                }
                cssOverride='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center'>
                <div className='p-1 rounded-full border-2 border-pink-600'>
                  <img
                    src={stories[currentUserIndex + 1]?.avatar}
                    className='w-16 h-16 rounded-full object-cover'
                    alt='User avatar'
                  />
                </div>
                <span className='text-white mt-2'>{stories[currentUserIndex + 1]?.name}</span>
                <span className='text-grey-color2'>
                  {calculateTime(stories[currentUserIndex + 1]?.listStory[0]?.createdDate)}
                </span>
              </div>
            </>
          )}
        </div>
        <div className='relative w-[180px] h-[320px] rounded-xl overflow-hidden'>
          {stories?.length > 2 && currentUserIndex < stories.length - 2 && (
            <>
              <RenderMedia
                mediaUrl={
                  stories[currentUserIndex + 2]?.listStory[0]?.image
                    ? stories[currentUserIndex + 2]?.listStory[0]?.image
                    : slides[currentUserIndex + 1]
                }
                cssOverride='absolute inset-0 w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center'>
                <div className='p-1 rounded-full border-2 border-pink-600'>
                  <img
                    src={
                      stories[currentUserIndex + 2]?.avatar
                        ? stories[currentUserIndex + 2]?.avatar
                        : slides[currentUserIndex + 2]
                    }
                    className='w-16 h-16 rounded-full object-cover'
                    alt='User avatar'
                  />
                </div>
                <span className='text-white mt-2'>{stories[currentUserIndex + 2]?.name}</span>
                <span className='text-grey-color2'>
                  {calculateTime(stories[currentUserIndex + 2]?.listStory[0]?.createdDate)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Story
