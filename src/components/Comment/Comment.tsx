import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import type { Comment as CommentModel } from '../../models/comment.model'
import defaultImage from '../../assets/post.jpg' // Import a default image
import { deleteComment, likeComment } from '../../apis/postService'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { userInfo } from 'os'
import TinyPopupComment from '../TinyPopupComment/TinyPopupComment'
import { useNavigate } from 'react-router-dom'

interface Props {
  commentData: CommentModel
  onReply: (nickName: string, commentId: string) => void
  onEdit: (commentId: string, message: string) => void
  onRefreshData: () => void
}

const CommentComponent = React.memo(({ commentData, onReply, onEdit, onRefreshData }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [isImageError, setIsImageError] = useState(false)
  const [currentLike, setCurrentLike] = useState<number>(0)
  const [isExpandedReplyComment, setIsExpandedReplyComment] = useState(false)
  const [isShowAction, setIsShowAction] = useState(false)
  const MAX_LENGTH = 100
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}')?.userId || ''
  const [isShowActionPopup, setShowActionPopup] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentLike(commentData?.numberOfLike)
  }, [commentData])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleImageError = () => {
    setIsImageError(true)
  }

  const handleLike = () => {
    try {
      if (liked) {
        setCurrentLike((pre) => pre - 1)
      } else {
        setCurrentLike((pre) => pre + 1)
        const response = likeComment(commentData?.commentId)
        console.log(response)
      }
    } catch (err) {
      console.log(err)
    }

    setLiked(!liked)
  }

  const handleReplyComment = () => {
    onReply(commentData?.name, commentData?.commentId)
  }

  const handleExpandCollapseReplyComment = () => {
    setIsExpandedReplyComment(!isExpandedReplyComment)
  }

  const handleDeleteComment = async () => {
    try {
      const response = await deleteComment(commentData?.commentId)
      handleShowPopupAction()
      onRefreshData()
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditComment = async () => {
    console.log('Edit function called')
    onEdit(commentData?.commentId, commentData?.message)
    handleShowPopupAction()
  }

  const handleShowPopupAction = () => {
    setShowActionPopup(!isShowActionPopup)
  }

  return (
    <div className='flex w-full gap-5 pl-4 py-2 items-start'>
      <img
        onError={handleImageError}
        className={`w-9 h-9 rounded-full object-cover`}
        src={isImageError ? defaultImage : commentData?.avatar}
        alt=''
      />
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full justify-start'>
          <div className='w-full flex flex-col gap-1 items-start justify-center'>
            <div className='flex gap-1'>
              <span className='font-medium text-black'>{commentData?.name}</span>
              <p className='font-normal text-black inline'>
                {isExpanded || commentData?.message?.length <= MAX_LENGTH
                  ? commentData?.message
                  : `${commentData?.message?.slice(0, MAX_LENGTH)}...`}
                {commentData?.message?.length > MAX_LENGTH && (
                  <span className='text-blue-500 cursor-pointer font-normal' onClick={handleToggle}>
                    {isExpanded ? ' Show less' : ' Show more'}
                  </span>
                )}
              </p>
            </div>
            <div
              className='flex gap-2 w-full items-center'
              onMouseEnter={() => setIsShowAction(true)}
              onMouseLeave={() => setIsShowAction(false)}
            >
              <span className='font-light text-xs text-grey-color2 cursor-pointer'>{'Now'}</span>

              {currentLike > 0 && (
                <span className='font-normal text-xs text-grey-color2 cursor-pointer'>{currentLike} likes</span>
              )}

              <span onClick={handleReplyComment} className='font-normal text-xs text-grey-color2 cursor-pointer'>
                Reply
              </span>
              {isShowAction && commentData?.userId === userId && (
                <div
                  onClick={handleShowPopupAction}
                  className='hover:bg-slate-100 cursor-pointer transition-all duration-200'
                >
                  <HiOutlineDotsHorizontal size={14} />
                </div>
              )}
            </div>
          </div>
          <motion.div
            className='p-1 px-4 cursor-pointer'
            onClick={handleLike}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: liked ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {liked ? (
              <FaHeart size={12} style={{ color: 'red' }} fill='red' className='text-red-500' />
            ) : (
              <FaRegHeart size={12} className='text-gray-500' />
            )}
          </motion.div>
        </div>
        {commentData?.replyComment?.length > 0 && (
          <div className='flex gap-2 justify-start items-center'>
            <div className='border-b-[1px] border-grey-color2 w-8'></div>
            <button
              className='border-none outline-none text-xs font-normal text-grey-color2'
              onClick={handleExpandCollapseReplyComment}
            >
              {isExpandedReplyComment ? 'Hide replies' : 'View replies'} ({commentData?.replyComment?.length})
            </button>
          </div>
        )}
        {isExpandedReplyComment &&
          commentData?.replyComment?.length > 0 &&
          commentData?.replyComment?.map((reply) => (
            <CommentComponent key={reply.commentId} commentData={reply} onReply={onReply} />
          ))}
        <TinyPopupComment
          isSelf={true}
          isVisible={isShowActionPopup}
          onClose={() => setShowActionPopup(false)}
          onDelete={handleDeleteComment}
          onEdit={handleEditComment}
        />
      </div>
    </div>
  )
})

export default CommentComponent
