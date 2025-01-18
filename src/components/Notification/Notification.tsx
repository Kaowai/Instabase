import { useEffect, useState } from 'react'
import { Post } from '../../models/post.model'
import defaultImage from './../../assets/default-avatar.jpg'
import { getUserById } from '../../apis/userService'
import { getPostById } from '../../apis/postService'
import { useNavigate } from 'react-router-dom'
import { NotificationModel } from '../../models/notification.model'
import { RenderMedia } from '../../utils/renderImage'

interface Props {
  noti: NotificationModel
}
const Notification = ({ noti }: Props) => {
  const [avatar, setAvatar] = useState<string>('')
  const navigate = useNavigate()
  const [post, setPost] = useState<Post>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    Promise.all([getUserById(noti?.userId), getPostById(noti?.postId)])
      .then(([user, post]) => {
        setAvatar(user?.avatar)
        console.log(post)
        setPost(post)
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [noti])
  const handleNavigateToPost = () => {
    if (noti.message.includes('post')) {
      navigate(`/post/${noti?.postId}`)
    } else if (noti.message.includes('story')) {
      navigate(`/stories/${noti.userId}`)
    }
  }
  return (
    <div className='w-full h-16 gap-2 flex justify-start items-center hover:bg-grey-color4'>
      <img src={post?.avatar ? post?.avatar : defaultImage} alt='' className='w-8 h-8 rounded-full' />

      <div className='w-full'>
        <span className='text-black font-normal'>{noti?.message}</span>
      </div>

      <img
        onClick={handleNavigateToPost}
        src={post?.imageAndVideo[0] ? post?.imageAndVideo[0] : defaultImage}
        alt=''
        className='h-12 w-12 rounded-xl cursor-pointer'
      />
    </div>
  )
}

export default Notification
