import Avatar from '../Avatar/Avatar'
import ProgressBar from '../ProgressBar/ProgressBar'
import avatar from './../../assets/avatar.png'

const StoryCard = () => {
  const handleComplete = () => {
    console.log('Story completed!')
  }

  return (
    <div className='relative w-[400px] h-[95%] rounded-2xl overflow-hidden'>
      {/* Progress Bar */}
      <div className='absolute top-4 px-2 left-0 w-full z-10 flex items-start flex-col gap-2'>
        <ProgressBar duration={5000} onComplete={handleComplete} />
        <div className='flex justify-start items-center gap-2'>
          <Avatar avatar={avatar} isHaveStory={false} isSeen={false} />
          <span className='text-white font-normal'>hoaiisreals</span>
          <span className='text-grey-color1 font-normal'>8h</span>
        </div>
      </div>

      {/* Background Image */}
      <img src={avatar} alt='Story Background' className='w-full h-full object-cover' />
    </div>
  )
}

export default StoryCard
