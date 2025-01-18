import React, { useEffect, useState } from 'react'
import { Post } from '../../models/post.model'
import { RenderMedia } from '../../utils/renderImage'
import { motion } from 'framer-motion'
import { likePost, unSavePost, savePost, getPostLike, getSavePost } from '../../apis/postService'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { BsBookmark, BsBookmarkFill, BsChat, BsSend } from 'react-icons/bs'
import { PiDotsThreeBold } from 'react-icons/pi'
import { isLike } from '../../utils/sharedFunctions'
import TinySharePopup from '../TinySharePopup/TinySharePopup'

interface ReelItemProps {
  post: Post
  isLiked: boolean
  handleCommentOpen: () => void
  numberOfComment: number
  showPopupShare: () => void
}

const ReelItem = React.memo(({ post, isLiked, handleCommentOpen, numberOfComment, showPopupShare }: ReelItemProps) => {
  const MAX_LENGTH = 50
  const [isExpanded, setIsExpanded] = useState(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [numberOfLike, setNumberOfLike] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)

  useEffect(() => {
    setNumberOfLike(post?.numberOfLike)
    const userId = JSON.parse(sessionStorage.getItem('user') || '{}')?.userId || ''
    getSavePost(userId)
      .then((savedPost) => {
        if (savedPost.length > 0) {
          const isSaved = savedPost.find((postData) => postData.postId === post?.postId)
          setSaved(isSaved ? true : false)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {})
    getPostLike(post?.postId)
      .then((userLikeList) => {
        setLiked(isLike(userLikeList, userId))
      })
      .catch((err) => console.log(err))
  }, [post, isLiked])

  const handleError = () => {
    console.log('error')
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  const handleSave = async () => {
    const userId = JSON.parse(sessionStorage.getItem('user') as string)?.userId
    if (saved) {
      const response = await unSavePost(userId, post?.postId)
      console.log(response)
    } else {
      const response = await savePost(userId, post?.postId)
      console.log(response)
    }
    setSaved(!saved)
  }

  const handleCommentClick = () => {
    handleCommentOpen()
  }

  const handleLike = () => {
    const userId = JSON.parse(sessionStorage.getItem('user') as string)?.userId

    likePost(userId, post?.postId)
    setNumberOfLike((pre) => (liked ? pre - 1 : pre + 1))
    setLiked(!liked)
  }
  return (
    <div className='flex gap-4 justify-center items-end max-w-[420px] w-full'>
      <div className={'h-[calc(100vh)]  py-8 rounded-lg min-h-[calc(100vh)] w-full relative snap-start'}>
        <video
          onError={handleError}
          autoPlay={true}
          loop={true}
          className={' h-full w-full object-cover rounded-lg border bg-grey-color3'}
          src={post?.imageAndVideo[0]}
        />

        <div className={'absolute py-12 bottom-0 px-4 flex flex-col gap-4 text-white'}>
          <div className={'flex items-center gap-2'}>
            <RenderMedia mediaUrl={post.avatar} cssOverride={'w-10 h-10 rounded-full object-cover'} />
            <span className={'text-base font-semibold text-white'}>{post.nickName}</span>
          </div>
          <div className='font-normal text-white'>
            <p className='font-normal text-white inline'>
              {isExpanded || post?.postTitle?.length <= MAX_LENGTH
                ? post?.postTitle
                : `${post?.postTitle?.slice(0, MAX_LENGTH)}...`}
              {post?.postTitle?.length > MAX_LENGTH && (
                <span className='text-blue-500 cursor-pointer font-normal' onClick={handleToggle}>
                  {isExpanded ? ' Show less' : ' Show more'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className='py-8 h-full justify-end bottom-0 right-0 p-2 flex flex-col gap-4 text-white'>
        <div className={'flex flex-col justify-center items-center gap-3'}>
          <div className='flex items-center flex-col justify-center'>
            <motion.div
              className='cursor-pointer hover:opacity-40'
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: liked ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {liked ? (
                <IoMdHeart size={30} style={{ color: 'red' }} fill='red' className='text-red-500' />
              ) : (
                <IoMdHeartEmpty size={30} className='text-gray-500' />
              )}
            </motion.div>
            <span className='text-sm font-normal text-black'>{numberOfLike}</span>
          </div>
          <div className='flex items-center flex-col justify-center'>
            <BsChat className='cursor-pointer hover:opacity-40' size={24} onClick={handleCommentClick} />
            <span className='text-sm font-normal text-black'>{numberOfComment}</span>
          </div>
          <BsSend size={24} className='cursor-pointer hover:opacity-40' onClick={showPopupShare} />
          <motion.div
            className='cursor-pointer hover:opacity-40 mt-6'
            onClick={handleSave}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: saved ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {saved ? (
              <BsBookmarkFill size={24} className='cursor-pointer hover:opacity-40 text-black' />
            ) : (
              <BsBookmark size={24} className='text-gray-500' />
            )}
          </motion.div>
          <div className='flex items-center flex-col justify-center cursor-pointer hover:opacity-40 transition-all duration-300'>
            <PiDotsThreeBold size={28} />{' '}
          </div>
        </div>
      </div>
    </div>
  )
})

export default ReelItem
