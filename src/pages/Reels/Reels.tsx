import React, { useEffect, useRef, useState } from 'react'
import { Post } from '../../models/post.model'
import ReelItem from '../../components/ReelItem/ReelItem'
import { commentPost, getPostComment, getRandomPosts, getReels, replyComnent } from '../../apis/postService'
import CommentComponent from '../../components/Comment/Comment'
import { BsEmojiSmile } from 'react-icons/bs'
import { User } from '../../models/User/User.model'
import { Comment } from '../../models/comment.model'
import FadeLoader from 'react-spinners/FadeLoader'
import { IoMdClose } from 'react-icons/io'
import TinySharePopup from '../../components/TinySharePopup/TinySharePopup'

const ReelLoadingSkeleton = () => (
  <div className='animate-pulse flex gap-4 justify-center items-end max-w-[420px] w-full'>
    <div className='h-[calc(100vh)] py-8 rounded-lg min-h-[calc(100vh)] w-full relative'>
      {/* Video placeholder */}
      <div className='h-full w-full bg-gray-200 rounded-lg'></div>

      {/* User info and caption placeholder */}
      <div className='absolute py-12 bottom-0 px-4 flex flex-col gap-4 w-full'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-full bg-gray-300'></div>
          <div className='w-32 h-4 bg-gray-300 rounded'></div>
        </div>
        <div className='space-y-2'>
          <div className='w-3/4 h-4 bg-gray-300 rounded'></div>
          <div className='w-1/2 h-4 bg-gray-300 rounded'></div>
        </div>
      </div>
    </div>

    {/* Action buttons placeholder */}
    <div className='py-8 h-full justify-end bottom-0 right-0 p-2 flex flex-col gap-4'>
      <div className='flex flex-col justify-center items-center gap-6'>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className='w-8 h-8 rounded-full bg-gray-300'></div>
        ))}
      </div>
    </div>
  </div>
)

const Reels = () => {
  const [reels, setReels] = useState<Post[]>([])
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const currentPost = reels[currentReelIndex]
  const [inputValue, setInputValue] = useState('')
  const commentInputRef = useRef<HTMLInputElement>(null)
  const [comment, setComment] = useState<Comment[]>([])
  const [postData, setPostData] = useState<Post>()
  const [isReply, setIsReply] = useState<boolean>(false)
  const [commentId, setCommentId] = useState<string>('')
  const [loadingComment, setLoadingComment] = useState<boolean>(false)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}')?.userId || ''
  const [isLoading, setIsLoading] = useState(true)
  const [isShowActionPopup, setIsShowPopupAction] = useState<boolean>(false)

  useEffect(() => {
    const fetchReels = async () => {
      setIsLoading(true)
      try {
        const user = JSON.parse(sessionStorage.getItem('user') as string)
        const response = await getRandomPosts(user?.userId)
        setReels(response)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReels()
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      if (!reels.length || currentReelIndex < 0) return

      setLoadingComment(true)
      try {
        const postData = reels[currentReelIndex]
        setPostData(postData)
        const commentList = await getPostComment(postData.postId)
        setComment(commentList)
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingComment(false)
      }
    }

    fetchComments()
  }, [currentReelIndex, reels])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }
  const handleShowPopupAction = () => {
    setIsShowPopupAction(!isShowActionPopup)
  }
  const handleScroll = async (e: React.WheelEvent) => {
    try {
      if (currentReelIndex === reels?.length - 1) {
        const response = await getRandomPosts(userId)
        setReels((prev) => [...prev, ...response])
      } else {
        if (e.deltaY > 0 && currentReelIndex < reels.length - 1) {
          setCurrentReelIndex((prev) => prev + 1)
        } else if (e.deltaY < 0 && currentReelIndex > 0) {
          setCurrentReelIndex((prev) => prev - 1)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleCommentOpen = () => {
    setIsCommentOpen(!isCommentOpen)
  }

  const handleSubmitCommentClick = async () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}') as User
    if (isReply) {
      // Handle reply comment here
      replyComnent(userId, currentPost?.postId, commentId, inputValue)
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
    } else {
      commentPost(userId, currentPost?.postId, inputValue)
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
  const handleReplyCommentClick = (nickName: string, commentId: string) => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
      commentInputRef.current.value = `@${nickName} `
      setIsReply(true)
      setCommentId(commentId)
    }
  }

  const handleEditCommentClick = () => {}
  const refreshData = () => {}
  return (
    <div className='min-h-screen ml-[17rem] overflow-x-hidden'>
      <div className='flex transition-all duration-500 ease-in-out'>
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isCommentOpen ? 'w-[60%] scale-95' : 'w-[420px] mx-auto scale-100'
          }`}
        >
          <div className='h-[calc(100vh)] overflow-hidden relative rounded-lg' onWheel={handleScroll}>
            {isLoading ? (
              <ReelLoadingSkeleton />
            ) : (
              <div
                className={`h-full transition-all duration-500 items-center
                  ease-out flex flex-col 
                  ${currentReelIndex > 0 ? 'transition-transform duration-700 ease-out' : ''}`}
                style={{ transform: `translateY(-${currentReelIndex * 100}%)` }}
              >
                {reels.map((reel) => (
                  <ReelItem
                    key={reel.postId}
                    post={reel}
                    numberOfComment={comment?.length}
                    isLiked={false}
                    handleCommentOpen={handleCommentOpen}
                    showPopupShare={handleShowPopupAction}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-10 ease-in-out transform fixed h-screen right-0 p-12 ${
            isCommentOpen ? 'w-[40%] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
          }`}
        >
          <div className='h-full bg-white rounded-lg border flex flex-col relative'>
            <div className='sticky top-0 h-20 w-full border-b bg-white flex justify-between gap-2 items-center px-4'>
              <div className='flex justify-start gap-2 items-center'>
                <p className='text-black font-semibold text-lg text-start'>Comments</p>
                <span className='text-grey-color2 text-lg font-normal'>{comment?.length}</span>
              </div>
              <div onClick={handleCommentOpen} className='cursor-pointer hover:bg-gray-200 rounded-full p-2'>
                <IoMdClose size={24} />
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto px-4 customScrollbar`}>
              {loadingComment ? (
                <div className='p-4 w-full h-full flex justify-center items-center'>
                  <FadeLoader height={15} width={2} radius={1} margin={1} />
                </div>
              ) : (
                <div className='flex flex-col gap-4 py-4'>
                  {(!comment || comment?.length === 0) && (
                    <div className='flex justify-center items-center flex-col h-full w-full'>
                      <span className='text-black font-semibold text-2xl'>No comments yet.</span>
                      <span className='text-black font-normal'>Try to be the first one to comment.</span>
                    </div>
                  )}

                  {comment?.map((comment) => (
                    <CommentComponent
                      key={comment?.commentId}
                      commentData={comment}
                      onReply={handleReplyCommentClick}
                      onEdit={handleEditCommentClick}
                      onRefreshData={refreshData}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className='sticky bottom-0 h-16 w-full border-t bg-white flex justify-between items-center px-4 py-2 gap-3'>
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
        </div>
      </div>
      <TinySharePopup postData={postData} isVisible={isShowActionPopup} onClose={handleShowPopupAction} />
    </div>
  )
}

export default Reels
