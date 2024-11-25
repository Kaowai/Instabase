import Comment from '../Comment/Comment'
import styles from './PopupComment.module.css'
import avatar2 from '../../assets/avatar2.webp'
import Avatar from '../Avatar/Avatar'
import { FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa'
import { TbSend } from 'react-icons/tb'
import { BsEmojiSmile } from 'react-icons/bs'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PopupComment = () => {
  const [liked, setLiked] = useState(false)
  const [save, setSave] = useState(false)
  const handleLike = () => {
    setLiked(!liked)
  }
  const handleSave = () => {
    setSave((pre) => !pre)
  }
  return (
    <div className='w-full h-full flex flex-col relative'>
      {/* Header */}
      <div className='h-[70px] flex gap-2 items-center px-4 py-2 z-10 bg-white border-b-[1px] border-gray-300 fixed w-[500px]'>
        <Avatar avatar={avatar2} isHaveStory={true} isSeen={false} />
        <div className='w-full  flex items-center gap-2'>
          <span className='font-medium text-black'>dannyparrow</span>
          <span className='rounded-full bg-black h-1 w-1'></span>
          <span className='text-blue-500 font-semibold cursor-pointer hover:text-blue-300'>Follow</span>
        </div>
      </div>

      {/* Comment List */}
      <div className={`flex-1 overflow-y-auto pt-[70px] pb-[160px] flex flex-col gap-1 ${styles.noScrollbar}`}>
        <div className='flex gap-2 px-4 py-2 items-start'>
          <Avatar avatar={avatar2} isHaveStory={true} isSeen={false} />
          <div className='w-full  flex flex-col gap-2'>
            <div>
              <span className='font-medium text-black'>dannyparrow</span>
              <span> </span>
              <p className='font-light text-black inline'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut hic dolorem quibusdam minus? Numquam ratione
                error veritatis placeat sequi beatae itaque dolore sapiente ipsa iusto ducimus, dignissimos reiciendis
                corrupti aperiam. <br /> <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut hic dolorem quibusdam minus? Numquam ratione
                error veritatis placeat sequi beatae itaque dolore sapiente ipsa iusto ducimus, dignissimos reiciendis
                corrupti aperiam. <br />
                <br />
              </p>
              {/* hagtag */}
              <p className='text-blue-500 font-light'>
                #legday #legworkout #gym #gymmotivation #fitness #fitnessmotivation #fitnesslifestyle #aesthetic
                #shredded #bodybuilding #abs #shredded #workout #workoutmotivation #workoutlife
              </p>
            </div>
            <div className='flex gap-3'>
              <span className='font-light text-grey-color2 cursor-pointer'>6d</span>
            </div>
          </div>
        </div>
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </div>

      {/* Footer */}
      <div className='h-[160px] flex gap-2 justify-start flex-col items-start w-full bg-white border-t-[1px] border-gray-300 absolute bottom-0 left-0'>
        <div className={`flex px-4 pt-4 justify-between items-center w-full`}>
          <div className={`flex justify-between items-center gap-4`}>
            <motion.div
              className='p-1 cursor-pointer hover:opacity-40'
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: liked ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {liked ? (
                <FaHeart size={24} style={{ color: 'red' }} fill='red' className='text-red-500' />
              ) : (
                <FaRegHeart size={24} className='text-gray-500' />
              )}
            </motion.div>
            <FaRegComment className='cursor-pointer hover:opacity-40' size={24} />
            <TbSend className='cursor-pointer hover:opacity-40' size={24} />
          </div>
          <motion.div
            className='p-1 cursor-pointer hover:opacity-40'
            onClick={handleSave}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: liked ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {save ? (
              <FaRegBookmark
                size={24}
                style={{ color: 'red' }}
                fill='black'
                className='cursor-pointer hover:opacity-40 text-black'
              />
            ) : (
              <FaRegBookmark size={24} className='text-gray-500' />
            )}
          </motion.div>
        </div>
        <div className='flex px-4 justify-start items-start flex-col '>
          <span className='text-black font-semibold'>13,890 likes</span>
          <span className='text-grey-color2 font-normal'>November 11 </span>
        </div>
        <div className='border-t-[1px] h-16 gap-3 px-4 py-2 border-gray-300 w-full flex justify-center items-center absolute bottom-0 left-0'>
          <BsEmojiSmile size={24} />
          <div className={`w-full`}>
            <input className='outline-none border-none w-full' placeholder='Add a comment' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupComment
