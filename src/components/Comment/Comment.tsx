import { useState } from 'react'
import avatar2 from '../../assets/avatar2.webp'
import { motion } from 'framer-motion'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import Avatar from '../Avatar/Avatar'

const Comment = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(false)

  const comment =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."

  const MAX_LENGTH = 100

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  return (
    <div className='flex gap-2 px-4 py-2 items-start'>
      <Avatar avatar={avatar2} isHaveStory={false} isSeen={false} />
      <div className='w-full  flex flex-col gap-2'>
        <div>
          <span className='font-medium text-black'>dannyparrow</span>
          <span> </span>
          <p className='font-light text-grey-color2 inline'>
            {isExpanded || comment.length <= MAX_LENGTH ? comment : `${comment.slice(0, MAX_LENGTH)}...`}
            {comment.length > MAX_LENGTH && (
              <span className='text-blue-500 cursor-pointer font-medium' onClick={handleToggle}>
                {isExpanded ? ' Show less' : ' Show more'}
              </span>
            )}
          </p>
        </div>
        <div className='flex gap-3'>
          <span className='font-light text-grey-color2 cursor-pointer'>6d</span>
          <span className='font-normal text-grey-color2 cursor-pointer'>139 likes</span>
          <span className='font-normal text-grey-color2 cursor-pointer'>Reply</span>
        </div>
      </div>
      <motion.div
        className='p-1 cursor-pointer'
        onClick={handleLike}
        whileTap={{ scale: 0.8 }}
        animate={{ scale: liked ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {liked ? (
          <FaHeart size={16} style={{ color: 'red' }} className='text-red-500' />
        ) : (
          <FaRegHeart size={16} className='text-gray-500' />
        )}
      </motion.div>
    </div>
  )
}

export default Comment
