import PostGrid from '../../components/PostGrid/PostGrid'
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader'
import Tabs from '../../components/Tabs/Tabs'

const Personal = (): React.JSX.Element => {
  return (
    <div className='w-full min-h-screen bg-gray-100'>
      <div className='max-w-4xl mx-auto pt-8'>
        <ProfileHeader />
        <Tabs />
        <PostGrid />
      </div>
    </div>
  )
}

export default Personal
