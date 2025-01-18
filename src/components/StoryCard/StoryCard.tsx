import { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { FaPlay, FaPause } from 'react-icons/fa6'
import ProgressBar from '../ProgressBar/ProgressBar'
import { calculateTime } from '../../utils/sharedFunctions'
import { StoryShort } from '../../models/story.model'
import { BsThreeDots } from 'react-icons/bs'
import TinyPopupConfirm from '../TinyPopupConfirm/TinyPopupConfim'
import { deleteStory, getSavedStoryByUserId, getStoryById, markSaveStory } from '../../apis/storyService'
import { useNavigate } from 'react-router-dom'

interface Props {
  avatar: string
  name: string
  isActive: boolean
  isNavigateLeft: boolean
  isNavigateRight: boolean
  storyList: Array<StoryShort>
  onComplete: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}

const StoryCard = ({
  avatar,
  name,
  isActive,
  isNavigateLeft,
  isNavigateRight,
  storyList,
  onComplete,
  onNavigate
}: Props) => {
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isError, setIsError] = useState(false)
  const nickName = JSON.parse(sessionStorage.getItem('user') || '{}').nickName
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const [isSave, setIsSave] = useState<boolean>()
  const navigate = useNavigate()
  useEffect(() => {
    setCurrentIndex(0)
    setIsPaused(false)
  }, [window.location.pathname])

  useEffect(() => {
    if (storyList[currentIndex]?.storyId) {
      getStoryById(storyList[currentIndex]?.storyId)
        .then((story) => {
          setIsError(false)
        })
        .catch((err) => {
          setIsError(true)
        })
        .finally(() => {
          setIsError(false)
        })
    }
  }, [currentIndex])

  useEffect(() => {
    getSavedStoryByUserId(userId).then((res) => {
      const some = res.listStory.some((story) => story.storyId === storyList[currentIndex]?.storyId)
      setIsSave(some)
    })
  })

  useEffect(() => {
    if (isActive && !isPaused) {
      setIsPaused(false) // Reset trạng thái khi `isActive` thay đổi
    }
  }, [isActive])

  const handleComplete = () => {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePopupAction = () => {
    setIsVisible(!isVisible)
    setIsPaused(!isPaused)
  }

  const handlePrevStory = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      onNavigate('prev')
    }
  }

  const handleDelete = async () => {
    deleteStory(storyList[currentIndex]?.storyId)
      .then((res) => {
        console.log(res)
        if (currentIndex < storyList.length - 1) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          onNavigate('next')
        }
      })
      .catch((error) => console.log(error))
    handlePopupAction()
  }

  const handleSave = async () => {
    markSaveStory(userId, storyList[currentIndex]?.storyId)
      .then((res) => {
        console.log(res)
        if (currentIndex < storyList.length - 1) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          onNavigate('next')
        }
      })
      .catch((err) => console.log(err))
    handlePopupAction()
  }

  const handleNextStory = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      onNavigate('next')
    }
  }

  const togglePlayPause = () => {
    setIsPaused(!isPaused)
  }

  if (!storyList || storyList.length === 0) {
    if (currentIndex < storyList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      onNavigate('next')
    }
    return <div className='text-white text-center'>No stories available</div>
  }

  return (
    <div className='relative w-full h-full rounded-2xl overflow-hidden'>
      {/* Progress Bars */}
      <div className='absolute top-0 left-0 w-full bg-gradient-to-b from-black/50 to-transparent pt-4 pb-20 px-4'>
        <div className='flex gap-1 w-full mb-4'>
          {storyList.map((story, index) => (
            <ProgressBar
              key={story.storyId}
              duration={4000}
              onComplete={handleComplete}
              isPaused={isPaused}
              isActive={index === currentIndex}
              isCompleted={index < currentIndex}
            />
          ))}
        </div>

        <div className='flex justify-between items-center w-full'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full border border-white/20 overflow-hidden'>
              <img className='w-full h-full object-cover' src={avatar} alt='' />
            </div>
            <div onClick={() => navigate(`/${name}`)} className='flex justify-center z-[10] items-center gap-2'>
              <span className='text-white z-[10] text-base font-normal cursor-pointer'>{name}</span>
              <span className='text-white/60 text-base'>{calculateTime(storyList[currentIndex]?.createdDate)}</span>
            </div>
          </div>
          <div className='absolute right-0 px-2 z-[10] flex justify-center items-center'>
            <button
              onClick={togglePlayPause}
              className='cursor-pointer p-1 rounded-full hover:bg-white/10 transition-all'
            >
              {isPaused ? <FaPlay size={20} fill='white' /> : <FaPause size={20} fill='white' />}
            </button>
            {nickName === name && (
              <button
                onClick={handlePopupAction}
                className='cursor-pointer p-1 rounded-full hover:bg-white/10 transition-all'
              >
                <BsThreeDots size={24} fill='white' className='text-white' />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className='fixed w-full inset-0 flex items-center justify-between px-[calc(35%)]'>
        <button
          onClick={handlePrevStory}
          aria-label='Previous Story'
          className={`w-6 h-6 rounded-full  bg-grey-color2 backdrop-blur-sm ${isNavigateLeft && 'opacity-100'} flex items-center justify-center hover:bg-grey-color4 transition-all duration-200`}
        >
          <BiChevronLeft size={24} fill='black' />
        </button>
        <button
          aria-label='Next Story'
          onClick={handleNextStory}
          className={`w-6 h-6 rounded-full bg-grey-color2 backdrop-blur-sm ${isNavigateRight && ' opacity-100'} flex items-center justify-center hover:bg-grey-color4 transition-all duration-200`}
        >
          <BiChevronRight size={24} fill='black' />
        </button>
      </div>

      {/* Story Content */}
      <div className='w-full h-full flex items-center justify-center bg-black transition-all duration-500'>
        {isError ? (
          <div className='font-bold text-lg'>This story has been deleted</div>
        ) : (
          <img src={storyList[currentIndex]?.image} className='w-full h-full object-contain bg-grey-color4' />
        )}
      </div>
      <TinyPopupConfirm
        isStoryCard={true}
        isVisible={isVisible}
        onClose={handlePopupAction}
        onDelete={handleDelete}
        onSave={handleSave}
        isSave={isSave}
      />
    </div>
  )
}

export default StoryCard
