import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Carousel from '../../components/Carousel/Carousel'
import PopupComment from '../../components/PopupComment/PopupComment'
import { Post } from '../../models/post.model'
import { getPostById, getPostLike } from '../../apis/postService'
import { isLike } from '../../utils/sharedFunctions'

const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [postData, setPostData] = useState<Post | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await getPostById(id)
        setPostData(post)
        const userLikeList = await getPostLike(post.postId)
        const user = sessionStorage.getItem('user')
        if (user) {
          const userID = JSON.parse(user)?.userId
          setIsLiked(isLike(userLikeList, userID))
        }
      } catch (error) {
        console.error('Error fetching post data:', error)
      }
    }

    fetchPostData()
  }, [id])

  if (!postData) return <div>Loading...</div>

  return (
    <div className='ml-[17rem] min-h-screen overflow-y-hidden box-border inset-0 flex items-center justify-center'>
      <div className={` border relative bg-white h-[680px] overflow-hidden grid grid-cols-[550px_350px]`}>
        <div className='border-r-[1px]'>
          <Carousel imageAndVideo={postData?.imageAndVideo} autoSlide={true} autoSlideInterval={3000}></Carousel>
        </div>
        <div className={`overflow-y-hidden rounded-xl w-full`}>
          <PopupComment postData={postData} isLiked={isLiked} onClose={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default PostDetail
