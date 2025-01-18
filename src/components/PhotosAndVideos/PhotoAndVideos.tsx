import React, { useEffect, useState } from 'react'
import TinyPopupConfirm from '../TinyPopupConfirm/TinyPopupConfim'
import { IoMdClose, IoMdHeartEmpty } from 'react-icons/io'
import { FadeLoader } from 'react-spinners'
import { Post } from '../../models/post.model'
import { getPersonalPagePost, getPersonalPageReels, getPostsLikeByUser, likePost } from '../../apis/postService'
import { useNavigate } from 'react-router-dom'
import { CiYoutube } from 'react-icons/ci'
import { HiOutlineViewfinderCircle } from 'react-icons/hi2'
import PostItem from '../PostItem/PostItem'
import { sortPostDate } from '../../utils/uploadImage'
import ReelItemTiny from '../ReelItemTiny/ReelItemTiny'

const PhotoAndVideos = () => {
  const [postLikes, setPostLikes] = useState<Array<Post>>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts')
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [newOrOld, setNewOrOld] = useState<'new' | 'old'>('new')
  const [isPopupConfirmVisible, setIsPopupConfirmVisible] = useState<boolean>(false)
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [displayReels, setDisplayReels] = useState<Post[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [listPost, setListPost] = useState<Array<Post>>([])

  useEffect(() => {
    setLoading(true)
    fetchPosts()
    fetchReels()
    setLoading(false)
  }, [])

  const handleNavigateToPost = (postId: string) => {
    navigate(`/post/${postId}`)
  }
  const fetchPosts = () => {
    getPersonalPagePost(userId)
      .then((posts) => {
        setDisplayedPosts(sortPostDate(posts))
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }

  const fetchReels = () => {
    getPersonalPageReels(userId)
      .then((posts) => {
        setDisplayReels(sortPostDate(posts))
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }

  const isPostSelected = (post: Post) => {
    return listPost?.some((_post) => _post.postId === post.postId)
  }

  const handleAddOrRemovePost = (post: Post) => {
    if (isPostSelected(post)) {
      setListPost((pre) => pre.filter((_post) => _post?.postId !== post?.postId))
    } else {
      setListPost((pre) => [...pre, post])
    }
  }
  const handleDelete = async () => {
    try {
      for (const post of listPost) {
        const response = await likePost(userId, post?.postId)
        console.log(response)
      }
    } catch (err) {
      console.log(err)
    }
    fetchPosts()
    fetchReels()
    setIsSelected(false)
    setListPost([])
    handleChangePopupAction()
  }
  const handleChangePopupAction = () => {
    setIsPopupConfirmVisible(!isPopupConfirmVisible)
  }
  const handleSortPost = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value

    const sortedPosts =
      // Không thay đổi vì mảng đã mặc định là từ mới nhất -> cũ nhất
      [...postLikes].reverse() // Đảo ngược mảng nếu chọn "Oldest to newest"

    setPostLikes(sortedPosts)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className={`grid grid-cols-4 gap-1 mt-6 w-full`} style={{ gridAutoRows: '11rem' }}>
            {displayedPosts.map((post) => (
              <PostItem
                isTiny={true}
                key={post.postId}
                postData={post}
                onClick={() => handleNavigateToPost(post?.postId)}
              />
            ))}
          </div>
        )

      case 'reels':
        return (
          <div className={`grid grid-cols-4 gap-1 mt-6 w-full`} style={{ gridAutoRows: '11rem' }}>
            {displayReels.map((post) => (
              <ReelItemTiny
                isTiny={true}
                key={post.postId}
                postData={post}
                onClick={() => handleNavigateToPost(post?.postId)}
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className='w-full h-full '>
      <div className='mx-4 flex relative items-center justify-center gap-12 mt-7 border-b w-[calc(100% - 40px)] max-w-[935px]'>
        <button
          onClick={() => setActiveTab('posts')}
          className={`-mb-[1px] px-4 py-2 ${activeTab === 'posts' && 'border-b-[2px] border-grey-color2'} font-medium text-sm ${activeTab === 'posts' ? 'text-black' : 'text-grey-color2'} flex gap-2 items-center`}
        >
          <HiOutlineViewfinderCircle size={16} fill={activeTab === 'posts' ? 'black' : 'grey'} />
          POSTS
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`-mb-[1px] px-4 py-2 ${activeTab === 'reels' && 'border-b-[2px] border-grey-color2'} font-medium text-sm ${activeTab === 'reels' ? 'text-black' : 'text-grey-color2'} flex gap-2 items-center`}
        >
          <CiYoutube size={16} fill={activeTab === 'reels' ? 'black' : 'grey'} />
          REELS
        </button>
      </div>
      <div className='my-2 w-full py-2 px-4 flex justify-between items-center'>
        <select onChange={handleSortPost} className='border p-2 rounded-lg font-bold'>
          <option value={'new'}>Newest to oldest</option>
          <option value={'old'}>Oldest to newest</option>
        </select>
        <button
          onClick={() => setIsSelected(!isSelected)}
          className={`${isSelected ? 'text-grey-color2 ' : 'text-blue-500 hover:text-blue-700'} text-base cursor-pointer`}
        >
          {isSelected ? 'Cancel' : 'Select'}
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center'>
          <FadeLoader height={15} width={2} radius={1} margin={1} />
        </div>
      ) : (
        <>
          <div
            className={` px-4 ${postLikes?.length > 0 && ' grid-cols-5 grid'} gap-1  mt-2 w-full h-full overflow-y-auto`}
            style={{ gridAutoRows: '9rem' }}
          >
            {/* {postLikes?.length === 0 && (
              <div className='w-full h-full flex justify-start flex-col gap-4 items-center'>
                <h1 className='text-bold text-3xl'>You haven't had any posts</h1>
                <span className='text-sm font-normal text-grey-color2'>
                  When you create any posts, it will show up here
                </span>
              </div>
            )} */}

            {renderContent()}
          </div>
          {isSelected && (
            <div className='w-full px-4 h-20 bottom-0 bg-white absolute flex justify-between items-center'>
              <span>
                <IoMdClose size={12} fill='#dbdbdb' />
                {listPost?.length} selected
              </span>
              <button onClick={handleChangePopupAction} className='font-bold text-red-500 hover:opacity-50'>
                Delete
              </button>
            </div>
          )}
        </>
      )}
      <TinyPopupConfirm isVisible={isPopupConfirmVisible} onClose={handleChangePopupAction} onDelete={handleDelete} />
    </div>
  )
}

export default PhotoAndVideos
