import styles from './PostLayout.module.css'
import { FaHeart, FaBookmark, FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa'
import { TbSend } from 'react-icons/tb'
import { Post } from '../../models/post.model'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { calculateTime, isLike } from '../../utils/sharedFunctions'
import Carousel from '../Carousel/Carousel'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { commentPost, getPostLike, getSavePost, likePost, savePost, unSavePost } from '../../apis/postService'
import PostPopup from '../Modal/PostCardModal/PostPopup'
import TinySharePopup from '../TinySharePopup/TinySharePopup'

interface PostLayoutProps {
  post: Post
}

const PostLayout = ({ post }: PostLayoutProps) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [numberOfComment, setNumberOfComement] = useState<number>(0)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}')?.userId || ''
  const [numberOfLike, setNumberOfLike] = useState(0)
  const commentInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false)

  useEffect(() => {
    setNumberOfLike(post?.numberOfLike)
    setNumberOfComement(post?.numberOfComment)

    getSavePost(userId)
      .then((savedPost) => {
        if (savedPost.length > 0) {
          const isSaved = savedPost.find((_post) => _post.postId === post.postId)
          setSaved(isSaved ? true : false)
        }
      })
      .catch((err) => console.log(err))

    getPostLike(post.postId)
      .then((userLikeList) => {
        const user = sessionStorage.getItem('user')
        if (user) {
          const userID = JSON.parse(user)?.userId
          setLiked(isLike(userLikeList, userID))
        }
      })
      .catch((err) => console.log(err))
  }, [])

  const handleLike = () => {
    likePost(userId, post?.postId)
    setNumberOfLike((pre) => (liked ? pre - 1 : pre + 1))
    setLiked(!liked)
  }
  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }

  const handleSave = async () => {
    if (saved) {
      const response = await unSavePost(userId, post?.postId)
      console.log(response)
    } else {
      const response = await savePost(userId, post?.postId)
      console.log(response)
    }
    setSaved(!saved)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmitComment = async () => {
    if (inputValue.trim().length > 0) {
      try {
        await commentPost(userId, post?.postId, inputValue)
        setNumberOfComement((pre) => pre + 1)
        setInputValue('')
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className='w-full  flex justify-between items-center'>
          <div className='flex items-center justify-start gap-2'>
            <img className='w-10 h-10 rounded-full' src={post?.avatar} alt='avatar' />
            <span className='text-base font-semibold'>{post?.nickName}</span>
            <span className='text-sm text-gray-500'> • {calculateTime(post?.createdDate)}</span>
          </div>
          <div className='flex transition-all duration-300 cursor-pointer h-full items-center justify-end rounded-full hover:bg-gray-200'>
            <HiOutlineDotsHorizontal size={24} />
          </div>
        </div>
      </div>
      <div className='border my-3'>
        <Carousel imageAndVideo={post?.imageAndVideo} isCreate={true} />
      </div>

      <div className={styles.action}>
        <div className={styles.icon}>
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
            <TbSend
              size={24}
              className='cursor-pointer hover:opacity-40'
              onClick={() => setIsSharePopupVisible(true)}
            />
          </div>
        </div>
        <div className={styles.save}>
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
      </div>

      <div className={styles.footer}>
        <div className={styles.likeamount}>
          <span>{numberOfLike} likes</span>
        </div>
        <div className={styles.caption}>
          <p>
            <span className={styles.nameAccount}>{post?.nickName} </span>
            {post?.postTitle}
          </p>
        </div>
        <div className={styles.commentAmount} onClick={() => setIsVisible(true)}>
          <span>View {numberOfComment} comments</span>
        </div>
        <div className={styles.comment}>
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitComment()
              }
            }}
            ref={commentInputRef}
            onChange={handleInputChange}
            value={inputValue}
            placeholder='Add a comment'
          />
        </div>
        <div className={styles.divideVertical}></div>
      </div>
      <PostPopup isVisible={isVisible} postData={post} onClose={() => setIsVisible(false)} />
      <TinySharePopup isVisible={isSharePopupVisible} onClose={() => setIsSharePopupVisible(false)} postData={post} />
    </div>
  )
}

export default PostLayout
