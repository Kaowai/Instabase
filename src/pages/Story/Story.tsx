import { useLocation, useNavigate } from 'react-router-dom'
import StoryCard from '../../components/StoryCard/StoryCard'
import styles from './Story.module.css'
import { IoMdClose } from 'react-icons/io'
import avatar from './../../assets/avatar.png'

const Story = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navigateHome = () => {
    navigate('/')
  }
  const navigateRoute = () => {
    navigate(location.state?.from || '/', { replace: true })
  }
  return (
    <div className='flex justify-center items-center w-screen h-screen overflow-hidden bg-[#1a1a1a]'>
      <div className={styles.logo} onClick={navigateHome}>
        Instacloud
      </div>
      <IoMdClose
        onClick={navigateRoute}
        size={32}
        className=' cursor-pointer top-2 right-2 fixed'
        fill='white'
        style={{ color: 'white' }}
      />
      <StoryCard avatar={avatar} name={'hoaiisreal'} time={'8h'} image={avatar} />
    </div>
  )
}

export default Story
