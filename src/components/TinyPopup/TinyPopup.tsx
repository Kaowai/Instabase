import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import FadeLoader from 'react-spinners/FadeLoader'
import { getPostLike } from '../../apis/postService'
import { RenderMedia } from '../../utils/renderImage'

interface Props {
  isVisible: boolean
  postId: string
  onClose: () => void
}

interface UserLike {
  userId: string
  name: string
  avatar: string
}
const TinyPopup = ({ isVisible, postId, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [userLikeList, setUserLikeList] = useState<UserLike[]>([])
  const userId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).userId : ''

  useEffect(() => {
    setIsLoading(true)
    getPostLike(postId)
      .then((userLikeList) => {
        setUserLikeList(userLikeList)
        setIsLoading(false)
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [postId, isVisible])
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
            <span className='font-bold text-base'>Likes</span>
          </div>
          <div className=' top-1 right-1 cursor-pointer' onClick={onClose}>
            <IoMdClose size={24} fill='black' />
          </div>
        </div>

        {/* Content create new post */}
        <div className={`w-full h-full flex justify-center items-center`}>
          {isLoading ? (
            <FadeLoader height={15} margin={2} radius={2} width={4} />
          ) : (
            <div className='w-full p-4 h-full mt-24 flex flex-col gap-2 items-start overflow-y-auto'>
              {userLikeList.map((user: UserLike) => (
                <div className='flex gap-2 items-center justify-between w-full'>
                  <div className='flex gap-4 items-center w-full'>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                      <RenderMedia key={user.userId} mediaUrl={user.avatar} />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold text-black'>{user?.name ? user?.name : 'userinstagram'}</span>
                      <span className='font-light text-gray-500'>{user?.name ? user?.name : 'User Instagram'}</span>
                    </div>
                  </div>
                  {user?.userId !== userId && (
                    <button className='border-none transition-all font-semibold outline-none bg-blue-500 hover:bg-blue-800 text-white rounded-md px-4 py-2'>
                      Follow
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TinyPopup
