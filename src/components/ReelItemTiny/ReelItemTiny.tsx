import { BsChatFill } from 'react-icons/bs'
import { IoMdHeart } from 'react-icons/io'
import { Post } from '../../models/post.model'
import defaultImage from '../../assets/default-avatar.jpg'
import styles from './ReelItemTiny.module.css'
import { useState } from 'react'

type Props = {
  postData: Post
  onClick: () => void
  isTiny?: boolean
}

const ReelItemTiny = ({ postData, onClick, isTiny = false }: Props) => {
  const [isImageError, setIsImageError] = useState(false)

  const handleImageError = () => {
    setIsImageError(true)
  }

  const renderMedia = () => {
    const mediaUrl = postData?.imageAndVideo[0]
    const isVideo = mediaUrl?.endsWith('.mp4') || mediaUrl?.endsWith('.webm') || mediaUrl?.endsWith('.ogg')

    if (isVideo) {
      return (
        <video className={styles.imageItem}>
          <source src={mediaUrl} type='video/mp4' />
          <source src={mediaUrl} type='video/webm' />
          <source src={mediaUrl} type='video/ogg' />
          Your browser does not support the video tag.
        </video>
      )
    } else {
      return (
        <img
          src={isImageError ? defaultImage : mediaUrl}
          alt='Media'
          loading='lazy'
          className={styles.imageItem}
          onError={handleImageError}
        />
      )
    }
  }
  return (
    <div className={`${styles.containerItem} ${isTiny ? 'max-h-[200px]' : 'min-h-[320px]'}`} onClick={onClick}>
      <video
        autoPlay={false}
        loop={true}
        className={` h-full w-full  object-cover rounded-lg border bg-grey-color3`}
        src={postData?.imageAndVideo[0]}
      />
      <div className={styles.react}>
        <div className={styles.comment}>
          <IoMdHeart fill='white' size={20} />
          <span>{postData.numberOfLike}</span>
        </div>
        <div className={styles.comment}>
          <BsChatFill fill='white' size={18} />
          <span>{postData.numberOfComment}</span>
        </div>
      </div>
    </div>
  )
}

export default ReelItemTiny
