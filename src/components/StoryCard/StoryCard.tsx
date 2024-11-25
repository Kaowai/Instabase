import { useEffect, useState } from 'react'
import ProgressBar from '../ProgressBar/ProgressBar'
import { FaPlay } from 'react-icons/fa6'
import { FaPause } from 'react-icons/fa6'

interface Props {
  avatar: string
  name: string
  time: string
  image: string
}

const StoryCard = ({ avatar, name, time, image }: Props) => {
  const [isPaused, setIsPaused] = useState(false)

  const handleComplete = () => {
    console.log('Story completed!')
  }

  useEffect(() => {
    console.log(isPaused)
  }, [])
  const togglePlayPause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <div className='relative w-[400px] h-[95%] rounded-2xl overflow-hidden'>
      {/* Progress Bar */}
      <div className='absolute top-4 px-2 left-0 w-full z-10 flex items-start flex-col gap-2'>
        <ProgressBar duration={5000} onComplete={handleComplete} isPaused={isPaused} />
        <div className='flex justify-between items-center w-full'>
          <div className='flex justify-start items-center gap-2'>
            <img className={`w-10 h-10 rounded-[90px] object-cover cursor-pointer`} src={avatar} alt='' />
            <span className='text-white font-normal cursor-pointer'>{name}</span>
            <span className='text-grey-color1 font-normal'>{time}</span>
          </div>
          <div>
            <button onClick={togglePlayPause}>
              {isPaused ? (
                <FaPlay size={20} style={{ color: 'white' }} fill='white' />
              ) : (
                <FaPause size={20} style={{ color: 'white' }} fill='white' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <img src={image} alt='Story Background' className='w-full h-full object-cover' />

      {/* Comment */}
    </div>
  )
}

export default StoryCard
