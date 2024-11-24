import StoryCard from '../../components/StoryCard/StoryCard'
import styles from './Story.module.css'
import { IoMdClose } from 'react-icons/io'

const Story = () => {
  return (
    <div className='flex justify-center items-center w-screen h-screen overflow-hidden bg-[#1a1a1a]'>
      <div className={styles.logo}>Instacloud</div>
      <IoMdClose size={32} className=' cursor-pointer top-2 right-2 fixed' fill='white' style={{ color: 'white' }} />
      <StoryCard />
    </div>
  )
}

export default Story
