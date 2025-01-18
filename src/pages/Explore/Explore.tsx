import React, { useState, useEffect } from 'react'
import InfiniteScroll, { Props } from 'react-infinite-scroll-component'
import PostItem from '../../components/PostItem/PostItem'
import PostPopup from '../../components/Modal/PostCardModal/PostPopup'
import { getRandomPosts, getSavePost } from '../../apis/postService'
import { Post } from '../../models/post.model'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiArrowNarrowLeft } from 'react-icons/hi'
import { MdKeyboardArrowLeft } from 'react-icons/md'

const ExploreLoadingSkeleton = () => (
  <div className='grid grid-cols-3 gap-1 mt-6 animate-pulse'>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} className='aspect-square relative group cursor-pointer bg-gray-200 rounded-sm'>
        <div className='w-full h-full bg-gray-200'></div>
        <div className='absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center gap-8'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300'></div>
            <div className='w-16 h-4 bg-gray-300 rounded'></div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300'></div>
            <div className='w-16 h-4 bg-gray-300 rounded'></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const Explore = (): React.JSX.Element => {
  const [postList, setPostList] = useState<Post[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const location = useLocation()
  const { isSavedPost, userIdSave } = location.state || {}
  const postsPerPage = 6
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    setIsLoading(true)
    if (isSavedPost && userIdSave) {
      getSavePost(userIdSave)
        .then((posts) => {
          setPostList(posts)
          setDisplayedPosts(posts.slice(0, postsPerPage))
        })
        .catch((error) => {
          console.error('Error fetching posts:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      getRandomPosts(userId)
        .then((posts) => {
          setPostList(posts)
          setDisplayedPosts(posts.slice(0, postsPerPage))
        })
        .catch((error) => {
          console.error('Error fetching posts:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const fetchMoreData = () => {
    const nextPage = page + 1
    const nextPosts = postList.slice(nextPage * postsPerPage, (nextPage + 1) * postsPerPage)
    setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts])
    setPage(nextPage)
    if (nextPosts.length < postsPerPage) {
      setHasMore(false)
    }
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setIsPopupOpen(true)
  }
  const onClose = () => {
    setIsPopupOpen(false)
    setSelectedPost(null)
  }

  return (
    <section className='min-h-screen ml-[17rem]'>
      <div className={`w-[calc(100% - 40px)] max-w-[935px] mx-auto pt-4 pb-20`}>
        {isSavedPost && (
          <div className='flex flex-col items-start gap-2'>
            <button
              onClick={() => navigate(-1)}
              className='outline-none  text-lg flex items-center justify-start border-none text-grey-color2 hover:underline cursor-pointer'
            >
              <MdKeyboardArrowLeft size={24} fill='#848484' /> Back
            </button>
            <h1 className='font-normal text-2xl '>All Posts</h1>
          </div>
        )}
        {isLoading ? (
          <ExploreLoadingSkeleton />
        ) : (
          <InfiniteScroll
            dataLength={displayedPosts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<ExploreLoadingSkeleton />}
            endMessage={<p style={{ textAlign: 'center' }}></p>}
          >
            <div className={`grid grid-cols-3 gap-1 mt-6`}>
              {displayedPosts.map((post) => (
                <PostItem key={post.postId} postData={post} onClick={() => handlePostClick(post)} />
              ))}
            </div>
          </InfiniteScroll>
        )}
        {selectedPost && <PostPopup isVisible={isPopupOpen} onClose={onClose} postData={selectedPost} />}
      </div>
    </section>
  )
}

export default Explore
