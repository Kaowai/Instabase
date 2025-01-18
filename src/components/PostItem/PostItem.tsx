import React, { useState } from 'react'
import styles from './PostItem.module.css'
import { BsChatFill } from 'react-icons/bs'
import { IoMdHeart } from 'react-icons/io'
import { Post } from '../../models/post.model'
import defaultImage from '../../assets/post.jpg' // Import a default image

type Props = {
  postData: Post
  onClick: () => void
  isTiny?: boolean
}

const PostItem = ({ postData, onClick, isTiny = false }: Props): React.JSX.Element => {
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
    <div className={styles.containerItem} onClick={onClick}>
      {renderMedia()}
      <div className={`${styles.react} ${isTiny ? 'max-h-[200px]' : 'max-h-[320px]'}`}>
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

export default PostItem
