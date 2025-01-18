import React, { useEffect, useState } from 'react'
import { User } from '../../models/User/User.model'
import { IoMdClose } from 'react-icons/io'
import FadeLoader from 'react-spinners/FadeLoader'
import { RenderMedia } from '../../utils/renderImage'
import { followUserSerice, getUserFollow, getUserFollowing, unFollowUserSerice } from '../../apis/userService'

interface Props {
  isVisible: boolean
  onClose: () => void
  user: User
  action: string
}
const TinyPopupData = ({ isVisible, onClose, user, action }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const selfUserId = JSON.parse(sessionStorage.getItem('user') as string)?.userId
  const [userInfo, setUserInfo] = useState<User[]>([])
  const [selfUserFollowing, setSelfUserFollowing] = useState<User[]>([])

  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      await getSelfUserFollowing()
      if (action === 'following') {
        await getFollowing(user?.userId)
      } else {
        await getFollowers(user?.userId)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [isVisible])

  const getSelfUserFollowing = async () => {
    try {
      const following = await getUserFollowing(selfUserId)
      setSelfUserFollowing(following)
    } catch (error) {
      console.error('Error fetching following:', error)
    }
  }

  const getFollowing = async (userId: string) => {
    try {
      const following = await getUserFollowing(userId)
      setUserInfo(following)
    } catch (error) {
      console.error('Error fetching following:', error)
    }
  }

  const getFollowers = async (userId: string) => {
    try {
      const followers = await getUserFollow(userId)
      setUserInfo(followers)
    } catch (error) {
      console.error('Error fetching followers:', error)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      await followUserSerice(selfUserId, userId)
      await getSelfUserFollowing()
    } catch (error) {
      console.error('Error following:', error)
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await unFollowUserSerice(selfUserId, userId)
      await getSelfUserFollowing()
    } catch (error) {
      console.error('Error unfollowing:', error)
    }
  }

  if (!isVisible) return null
  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-20 flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Popup */}
      <div className={` relative rounded-xl bg-white shadow-lg  w-[400px] max-w-[400px] h-1/2 z-[20] overflow-hidden`}>
        {/* Header */}

        <div className='absolute flex justify-between px-2 items-center h-12 border-b-[1px] border-grey-color3 w-full '>
          <div className='w-full text-center'>
            <span className='font-bold text-base'>{action === 'followers' ? 'Followers' : 'Following'}</span>
          </div>
          <div className=' top-1 right-1 cursor-pointer' onClick={onClose}>
            <IoMdClose size={24} fill='black' />
          </div>
        </div>

        {/* Content display user like */}
        <div className={`w-full h-full flex justify-center items-center`}>
          {isLoading ? (
            <FadeLoader height={15} margin={2} radius={2} width={4} />
          ) : (
            <div className='w-full p-4 h-full mt-24 flex flex-col gap-2 items-start overflow-y-auto'>
              {userInfo.map((user: User) => (
                <div key={user.userId} className='flex gap-2 items-center justify-between w-full'>
                  <div className='flex gap-4 items-center w-full'>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                      <RenderMedia key={user.userId} mediaUrl={user.avatar} />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold text-black'>{user?.nickName ? user?.nickName : 'userinstagram'}</span>
                      <span className='font-light text-gray-500'>
                        {user?.fullName ? user?.fullName : 'User Instagram'}
                      </span>
                    </div>
                  </div>
                  {user?.userId !== selfUserId ? (
                    selfUserFollowing.some((selfUser) => selfUser?.userId === user?.userId) ? (
                      <button
                        onClick={() => handleUnfollow(user?.userId)}
                        className='border-none transition-all font-semibold outline-none bg-grey-color3 hover:bg-grey-color2 text-black rounded-md px-4 py-2'
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user?.userId)}
                        className='border-none transition-all font-semibold outline-none bg-blue-500 hover:bg-blue-800 text-white rounded-md px-4 py-2'
                      >
                        Follow
                      </button>
                    )
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TinyPopupData
