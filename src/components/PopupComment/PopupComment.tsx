import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa'
import { BsEmojiSmile } from 'react-icons/bs'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6'
import { Post } from '../../models/post.model'
import { calculateTime, formatDate } from '../../utils/sharedFunctions'
import styles from './PopupComment.module.css'
import type { Comment } from '../../models/comment.model'
import {
  commentPost,
  deletePost,
  getPostById,
  getPostComment,
  getSavePost,
  likePost,
  replyComnent,
  savePost,
  unSavePost
} from '../../apis/postService'
import CommentComponent from '../Comment/Comment'
import defaultImage from '../../assets/post.jpg' // Import a default image
import TinyPopup from '../TinyPopup/TinyPopup'
import FadeLoader from 'react-spinners/FadeLoader'
import { User } from '../../models/User/User.model'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import TinyPopupAction from '../TinyPopupAction/TinyPopupAction'
import PostCreateCard from '../Modal/PostCreateCard/PostCreateCard'
import { useNavigate } from 'react-router-dom'

interface Props {
  postData: Post
  isLiked: boolean
  onClose: () => void
}

const PopupComment = ({ postData, isLiked, onClose }: Props) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [comment, setComment] = useState<Comment[]>([])
  const [isImageError, setIsImageError] = useState(false)
  const [isShowPopupUserLike, setIsShowPopupUserLike] = useState(false)
  const [loadingComment, setLoadingComment] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const commentInputRef = useRef<HTMLInputElement>(null)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}')?.userId || ''
  const [isReply, setIsReply] = useState<boolean>(false)
  const [commentId, setCommentId] = useState<string>('')
  const [savedPost, setSavedPost] = useState<Post[]>([])
  const [numberOfLike, setNumberOfLike] = useState(0)
  const [isShowPopupAction, setIsShowPopupAction] = useState(false)
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false)
  const [commendEdit, setCommentEdit] = useState('')
  const [post, setPost] = useState<Post>()
  const navigate = useNavigate()
  // Fetch comments when the post data changes
  useEffect(() => {
    setLoadingComment(true)
    setPost(postData)
    getSavePost(userId)
      .then((savedPost) => {
        if (savedPost.length > 0) {
          const isSaved = savedPost.find((post) => post.postId === postData.postId)
          setSaved(isSaved ? true : false)
        }
        setSavedPost(savedPost)
      })
      .catch((err) => console.log(err))
      .finally(() => {})
    getPostComment(postData.postId)
      .then((commentList) => {
        setComment(commentList)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingComment(false))
    setLiked(isLiked)
    setNumberOfLike(postData?.numberOfLike)
  }, [postData, isLiked, savePost])

  const handleLike = () => {
    likePost(userId, postData?.postId)
    setNumberOfLike((pre) => (liked ? pre - 1 : pre + 1))
    setLiked(!liked)
  }

  const handleClosePopup = () => {
    setIsEditPopupVisible(!isEditPopupVisible)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSave = async () => {
    if (saved) {
      const response = await unSavePost(userId, postData?.postId)
      console.log(response)
    } else {
      const response = await savePost(userId, postData?.postId)
      console.log(response)
    }
    setSaved(!saved)
  }

  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }

  const handleImageError = () => {
    setIsImageError(true)
  }

  const handleReplyCommentClick = (nickName: string, commentId: string) => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
      commentInputRef.current.value = `@${nickName} `
      setIsReply(true)
      setCommentId(commentId)
    }
  }

  const handleShowUserLike = () => {
    if (numberOfLike === 0) {
      setNumberOfLike(1)
    }
    setIsShowPopupUserLike(!isShowPopupUserLike)
  }

  const handleSubmitCommentClick = async () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}') as User
    if (isReply) {
      // Handle reply comment here
      replyComnent(userId, postData?.postId, commentId, inputValue)
        .then((res) => {
          console.log(res)
          setComment((prevComments) => [
            ...prevComments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  replyComment: [
                    ...comment.replyComment,
                    {
                      commentId: new Date().getTime().toString(),
                      userId,
                      createdDate: new Date().toISOString(),
                      nickName: user?.nickName || 'user cloud',
                      avatar: user?.avatar || '',
                      name: user?.fullName || 'User name',
                      message: inputValue,
                      numberOfLike: 0,
                      replyComment: []
                    }
                  ]
                }
              }
              return comment
            })
          ])
        })
        .catch((err) => console.log(err))
        .finally(() => setInputValue(''))
    } else if (commendEdit) {
      // Update the comment
      // updateComment(commendEdit, inputValue)
      //   .then((res) => {
      //     console.log('Comment updated:', res)
      //     setComment((prevComments) =>
      //       prevComments.map((comment) =>
      //         comment.commentId === commendEdit ? { ...comment, message: inputValue } : comment
      //       )
      //     )
      //   })
      //   .catch((err) => console.log(err))
      //   .finally(() => {
      //     setInputValue('')
      //     setCommentEdit('')
      //   })
    } else {
      commentPost(userId, postData?.postId, inputValue)
        .then((res) => {
          console.log(res)

          console.log(user)
          setComment((prevComments) => [
            {
              commentId: new Date().getTime().toString(),
              userId,
              createdDate: new Date().toISOString(),
              nickName: user?.nickName || 'user cloud', // Replace with actual nickname if available
              avatar: user?.avatar || '', // Replace with actual avatar URL if available
              name: user?.fullName || 'User name', // Replace with actual name if available
              message: inputValue,
              numberOfLike: 0,
              replyComment: []
            },
            ...prevComments
          ])
        })
        .catch((err) => console.log(err))
        .finally(() => setInputValue(''))
    }
    setIsReply(false)
  }
  const handleShowPopupAction = () => {
    setIsShowPopupAction(!isShowPopupAction)
  }
  const handleRefreshAfterEdit = async () => {
    setLoadingComment(true)
    getPostById(postData?.postId)
      .then((_post) => setPost(_post))
      .catch((err) => console.log(err))
      .finally(() => {})

    getSavePost(userId)
      .then((savedPost) => {
        if (savedPost.length > 0) {
          const isSaved = savedPost.find((post) => post.postId === postData.postId)
          setSaved(isSaved ? true : false)
        }
        setSavedPost(savedPost)
      })
      .catch((err) => console.log(err))
      .finally(() => {})

    getPostComment(postData.postId)
      .then((commentList) => {
        setComment(commentList)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingComment(false))
    setLiked(isLiked)
    setNumberOfLike(postData?.numberOfLike)
  }
  const handleEdit = () => {
    console.log('edit')
    setIsEditPopupVisible(true)
    handleShowPopupAction()

    // onClose()
  }
  const handleDelete = async () => {
    try {
      const response = await deletePost(postData?.postId)
      alert(response)
    } catch (err) {
      console.log(err)
    }
    console.log('delete')
    onClose()
    handleShowPopupAction()
  }
  const handleGoToPost = () => {
    navigate(`/post/${postData?.postId}`)
    console.log('go to post')
  }
  const handleGotoPersonal = (nickName: string) => {
    navigate(`/${nickName}`)
    onClose()
  }
  const handleEditComment = (commentId: string, messsage: string) => {
    console.log('wtf')
    setCommentEdit(commentId)
    console.log(commentId)
    setInputValue(messsage)
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }
  const highlightTags = (text: string) => {
    const parts = text.split(/(@[^@]+@)/g) // Tách chuỗi thành các phần, giữ lại các từ giữa dấu @
    return parts.map((part, index) => {
      if (part.startsWith('@') && part.endsWith('@')) {
        // Phần nằm giữa dấu @
        const tag = part.slice(1, -1) // Loại bỏ dấu @
        return (
          <span
            onClick={() => handleGotoPersonal(tag)}
            key={index}
            className='font-semibold cursor-pointer hover:underline transition-all '
          >
            {tag}
          </span>
        )
      }
      return <span key={index}>{part}</span> // Phần văn bản bình thường
    })
  }

  return (
    <div className='w-full h-full flex flex-col relative'>
      {/* Header */}
      <div className='h-[70px] flex gap-2 justify-between items-center px-4 py-2 z-10 bg-white rounded-tr-xl border-b-[1px] border-gray-300 absolute w-full'>
        <div className='w-full flex items-center gap-2'>
          <img
            onError={handleImageError}
            className={`w-10 h-10 rounded-[90px] object-cover`}
            src={isImageError ? defaultImage : post?.avatar}
            alt=''
          />
          <div className='w-full flex items-center gap-2'>
            <span className='font-medium text-black'>{post?.nickName}</span>
            {userId !== post?.userId && (
              <>
                <span className='rounded-full bg-black h-1 w-1'></span>
                <span className='text-blue-500 font-semibold cursor-pointer hover:text-blue-300'>Follow</span>
              </>
            )}
          </div>
        </div>
        <div
          onClick={handleShowPopupAction}
          className='w-full flex justify-end items-center cursor-pointer hover:opacity-40'
        >
          <HiOutlineDotsHorizontal size={24} />
        </div>
      </div>

      {/* Comment List */}
      {loadingComment ? (
        <div className='p-4 w-full h-full flex justify-center items-center'>
          <FadeLoader height={15} width={2} radius={1} margin={1} />
        </div>
      ) : (
        <div className={`flex-1 overflow-y-auto pt-[70px] pb-[160px] flex flex-col gap-4 ${styles.noScrollbar}`}>
          {/* Title author */}
          {postData?.postTitle && (
            <div className='flex gap-4 px-4 py-2 items-start'>
              <img
                onError={handleImageError}
                className={`w-10 h-10 rounded-[90px] object-cover`}
                src={isImageError ? defaultImage : postData?.avatar}
                alt=''
              />
              <div className='w-full flex flex-col gap-1'>
                <div className='w-full flex flex-col gap-1'>
                  <div className='flex gap-1 items-center w-full'>
                    <p className='font-semibold text-black inline'>
                      {' ' + postData?.nickName} <br />
                      <span className='font-normal text-black inline'>{highlightTags(postData?.postTitle || '')}</span>
                      <br />
                      {postData?.listHagtags.map((hagtag: string, index: number) => (
                        <p key={index} className='text-blue-500 font-light inline'>
                          #{hagtag}
                          <br />
                        </p>
                      ))}
                      <span className='font-normal text-grey-color2 cursor-pointer'>
                        • {calculateTime(postData?.createdDate)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content if not have comments */}
          {comment?.length === 0 && postData?.postTitle === '' && (
            <div className='flex justify-center items-center flex-col h-full w-full'>
              <span className='text-black font-semibold text-2xl'>No comments yet.</span>
              <span className='text-black font-normal'>Start the conversation.</span>
            </div>
          )}

          {/* Content if have comments */}
          {/* Comment list */}
          {comment?.map((comment) => (
            <CommentComponent
              onRefreshData={handleRefreshAfterEdit}
              onEdit={handleEditComment}
              key={comment.commentId}
              commentData={comment}
              onReply={handleReplyCommentClick}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className='h-[160px] flex gap-2 justify-start flex-col items-start w-full bg-white border-t-[1px] border-gray-300 absolute bottom-0 left-0'>
        <div className={`flex pl-4 pr-2 pt-4 justify-between items-center w-full`}>
          <div className={`flex justify-between items-center gap-2`}>
            <motion.div
              className='p-1 cursor-pointer hover:opacity-40'
              onClick={handleLike}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: liked ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {liked ? (
                <FaHeart size={24} style={{ color: 'red' }} fill='red' className='text-red-500' />
              ) : (
                <FaRegHeart size={24} className='text-gray-500' />
              )}
            </motion.div>
            <FaRegComment className='cursor-pointer hover:opacity-40' size={24} onClick={handleCommentClick} />
          </div>
          <motion.div
            className='p-1 cursor-pointer hover:opacity-40'
            onClick={handleSave}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: saved ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {saved ? (
              <FaBookmark size={20} className='cursor-pointer hover:opacity-40 text-black' />
            ) : (
              <FaRegBookmark size={20} className='text-gray-500' />
            )}
          </motion.div>
        </div>
        <div className='flex px-4 justify-start items-start flex-col w-full'>
          <div>
            {numberOfLike === 0 && <span className='text-black'>Be the first to </span>}
            <button
              onClick={handleShowUserLike}
              className='text-black inline font-semibold outline-none border-none hover:opacity-70'
            >
              {numberOfLike > 0 ? numberOfLike + ' likes' : 'like this'}
            </button>
          </div>
          <span className='text-grey-color2 '>{formatDate(postData?.createdDate)} </span>
        </div>
        <div className='border-t-[1px] h-16 gap-3 px-4 py-2 border-gray-300 w-full flex justify-between items-center absolute bottom-0 left-0'>
          <BsEmojiSmile size={24} />
          <div className='w-full'>
            <input
              ref={commentInputRef}
              value={inputValue}
              onChange={handleInputChange}
              className='outline-none border-none w-full'
              placeholder='Add a comment'
            />
          </div>
          <button
            disabled={!inputValue.trim()}
            onClick={handleSubmitCommentClick}
            className={`font-semibold text-blue-600 flex items-center gap-1 ${
              !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className='w-2 h-2 rounded-full bg-blue-600'></div>Post
          </button>
        </div>
      </div>
      <TinyPopup isVisible={isShowPopupUserLike} postId={postData?.postId} onClose={handleShowUserLike} />
      <TinyPopupAction
        isVisible={isShowPopupAction}
        onClose={handleShowPopupAction}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGotoPost={handleGoToPost}
        isSelf={userId === postData?.userId}
        onGotoPersonal={handleGotoPersonal}
      />
      <PostCreateCard
        isVisible={isEditPopupVisible}
        onClose={handleClosePopup}
        postData={postData}
        isEdit={true}
        refreshAfterEdit={handleRefreshAfterEdit}
      />
    </div>
  )
}

export default PopupComment
