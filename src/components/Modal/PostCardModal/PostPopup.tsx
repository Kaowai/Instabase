import { useEffect, useState } from 'react'
import Carousel from '../../Carousel/Carousel'
import styles from './PostPopup.module.css'
import PopupComment from '../../PopupComment/PopupComment'
import { Post } from '../../../models/post.model'
import { getPostLike } from '../../../apis/postService'
import { isLike } from '../../../utils/sharedFunctions'
import PostCreateCard from '../PostCreateCard/PostCreateCard'

type Props = {
  isVisible: boolean
  onClose: () => void
  postData: Post
}

const PostPopup = ({ isVisible, onClose, postData }: Props) => {
  const [isLiked, setIsLiked] = useState(false)
  
  useEffect(() => {
    getPostLike(postData.postId)
      .then((userLikeList) => {
        const user = sessionStorage.getItem('user')
        if (user) {
          const userID = JSON.parse(user)?.userId
          setIsLiked(isLike(userLikeList, userID))
        }
      })
      .catch((err) => console.log(err))
  }, [postData])
  useEffect(() => {
    const originalOverflowY = document.body.style.overflowY
    const originalPaddingRight = document.body.style.paddingRight

    if (isVisible) {
      // Chặn cuộn của trang ngoài khi popup mở
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth // Độ rộng thanh cuộn
      document.body.style.paddingRight = `${scrollBarWidth}px` // Để không bị mất không gian do thanh cuộn
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = originalOverflowY
      document.body.style.paddingRight = originalPaddingRight
    }

    return () => {
      // Cleanup
      document.body.style.overflowY = originalOverflowY
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Popup */}
      <div
        className={`${styles.popup} relative bg-white shadow-lg h-[680px] z-10 overflow-hidden grid grid-cols-[500px_500px] rounded-xl`}
      >
        <div className='border-r-[1px]'>
          <Carousel imageAndVideo={postData?.imageAndVideo} autoSlide={true} autoSlideInterval={3000}></Carousel>
        </div>
        <div className={`overflow-y-scroll ${styles.noScrollbar} rounded-xl`}>
          <PopupComment postData={postData} isLiked={isLiked} onClose={onClose}/>
        </div>
      </div>
    </div>
  )
}

export default PostPopup
