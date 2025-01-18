import avatar1 from '../../assets/avatar1.webp'
import { CSSProperties, useEffect, useState } from 'react'
import { GoPlus } from 'react-icons/go'
import FadeLoader from 'react-spinners/FadeLoader'

import { Route, Router, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  followUserSerice,
  getUserByNickName,
  getUserFollow,
  getUserFollowing,
  unFollowUserSerice
} from '../../apis/userService'
import HighlightStory from '../../components/HighlightStory/HighlightStory'
import PulseLoader from 'react-spinners/PulseLoader'
import PostItem from '../../components/PostItem/PostItem'
import PostPopup from '../../components/Modal/PostCardModal/PostPopup'
import { getPersonalPage, getPersonalPageReels, getPersonalPagePost, getSavePost } from '../../apis/postService'
import { Post } from '../../models/post.model'
import InfiniteScroll from 'react-infinite-scroll-component'
import { sortPostDate } from '../../utils/uploadImage'
import { RenderMedia } from '../../utils/renderImage'
import { User } from '../../models/User/User.model'
import TinyPopupData from '../../components/TinyPopupData/TinyPopupData'
import { getAllChatRooms, sendTextMessage } from '../../apis/chatService'
import Story from '../Story/Story'
import ReelItemTiny from '../../components/ReelItemTiny/ReelItemTiny'

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'black'
}

const Personal = (): React.JSX.Element => {
  const [isSelfPersonal, setIsSelfPersonal] = useState<boolean>(false)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [currentNickName, setCurrentNickName] = useState<string>('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [userFollowingList, setUserFollowingList] = useState<User[]>([])
  const [userFollowersList, setUserFollowersList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPopupData, setIsPopupData] = useState<boolean>(false)
  const navigate = useNavigate()
  const [user, setUser] = useState<User>()
  const location = useLocation()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [avatar, setAvatar] = useState<string>('')
  const [postList, setPostList] = useState<Post[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [displayReels, setDisplayReels] = useState<Post[]>([])
  const [savedPost, setSavedPost] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 20
  const [action, setAction] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts')

  const highlightsStory = [
    {
      id: 1,
      imageHighLight: avatar1,
      title: 'Cap 3 o PTG'
    },
    {
      id: 2,
      imageHighLight: avatar1,
      title: 'Nam nhat dai hoc'
    },
    {
      id: 3,
      imageHighLight: avatar1,
      title: 'Nam 2 dai hoc'
    }
  ]

  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      const nickName = location.pathname.split('/')[1]
      const user = await getUserByNickName(nickName)
      setUser(user)
      setAvatar(user?.avatar || '')

      setCurrentNickName(nickName)
      const currentUserNickName = JSON.parse(sessionStorage.getItem('user') || '{}').nickName
      const currentUserId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
      setCurrentUserId(currentUserId)

      // Check if current user is viewing their own personal page
      if (nickName && user && nickName === currentUserNickName) {
        setIsSelfPersonal(true)
      } else {
        setIsSelfPersonal(false)
      }

      await fetchPosts(user?.userId)
      await fetchReels(user?.userId)
      await fetchSavedPost(user?.userId)
      // Call API to check if current user is following this user
      getUserFollowing(user?.userId)
        .then((followingList) => {
          setUserFollowingList(followingList)
        })
        .catch((error) => {
          console.log(error)
        })

      getUserFollow(user?.userId)
        .then((followers) => {
          setUserFollowersList(followers)
          if (followers.some((user) => user?.nickName === currentUserNickName)) {
            console.log('true')
            setIsFollowing(true)
          } else {
            setIsFollowing(false)
          }
        })
        .catch((error) => {
          console.log(error)
        })
      setIsLoading(false)
    }
    fetchData()
  }, [location.pathname, isPopupData])

  const fetchPosts = (userID: string) => {
    getPersonalPagePost(userID)
      .then((posts) => {
        setPostList(sortPostDate(posts))
        setDisplayedPosts(posts.slice(0, postsPerPage))
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }

  const fetchReels = (userID: string) => {
    getPersonalPageReels(userID)
      .then((posts) => {
        setDisplayReels(sortPostDate(posts))
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }

  const fetchSavedPost = (userID: string) => {
    getSavePost(userID)
      .then((posts) => {
        setSavedPost(posts)
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }

  const fetchUserFollowers = (userID: string) => {
    getUserFollow(userID)
      .then((followers) => {
        setUserFollowersList(followers)
      })
      .catch((error) => {
        console.error('Error fetching followers:', error)
      })
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

  const handleFollowUserOrUnfollow = async () => {
    setLoadingFollow(true)
    try {
      if (isFollowing) {
        // API call to unfollow the user
        unFollowUserSerice(currentUserId, user?.userId)
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            setIsFollowing(false)
            fetchUserFollowers(user?.userId)
          })
      } else {
        // API call to follow the user
        followUserSerice(currentUserId, user?.userId)
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            setIsFollowing(true)
            fetchUserFollowers(user?.userId)
          })
      }

      setLoadingFollow(false)
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setLoadingFollow(false)
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

  const onClosePopupData = () => {
    setIsPopupData(false)
  }

  const handleShowPopupFollowers = () => {
    setAction('followers')
    setIsPopupData(true)
  }

  const handleShowPopupFollowing = () => {
    setAction('following')
    setIsPopupData(true)
  }

  const handleNavigateToChatRoom = async () => {
    try {
      // Get all chat rooms for current user
      const chatRooms = await getAllChatRooms(currentUserId)

      // Find existing chat room with selected user
      const existingChatRoom = chatRooms.find((room) => room?.userId === user?.userId)

      if (existingChatRoom) {
        // Navigate to existing chat room
        navigate(`/messages/${existingChatRoom.chatRoomId}`)
      } else {
        // Create new chat room by sending initial message
        await sendTextMessage(currentUserId, user?.userId, '@@@@@@')
        // Note: Navigation to new chat room should happen in response to WebSocket event
        // or through the response from sendTextMessage
        const response = await getAllChatRooms(currentUserId)
        const newChatRoom = response.find((room) => room?.userId === user?.userId)
        if (newChatRoom) {
          navigate(`/messages/${newChatRoom.chatRoomId}`)
        }
      }
    } catch (error) {
      console.error('Failed to handle chat room navigation:', error)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className={`grid grid-cols-3 gap-1 mt-6 w-full`}>
            {displayedPosts.length === 0 && <div className='text-xl w-full flex justify-center'>No posts yet</div>}

            {displayedPosts.map((post) => (
              <PostItem key={post.postId} postData={post} onClick={() => handlePostClick(post)} />
            ))}
          </div>
        )

      case 'reels':
        return (
          <div className={`grid grid-cols-4 gap-1 mt-6 w-full`}>
            {displayReels.length === 0 && <div className='text-xl w-full flex justify-center'>No reels yet</div>}
            {displayReels.map((post) => (
              <ReelItemTiny key={post.postId} postData={post} onClick={() => handlePostClick(post)} />
            ))}
          </div>
        )

      case 'saved':
        return (
          <div
            onClick={() => {
              if (savedPost?.length > 0) {
                navigate(`/${currentNickName}/saved`, {
                  state: {
                    isSavedPost: true,
                    userIdSave: user?.userId
                  }
                })
              }
            }}
            className='width-full cursor-pointer relative border h-full grid grid-cols-2 grid-rows-2 min-w-[320px] min-h-[320px] max-w-[320px] max-h-[320px]'
          >
            <div className='absolute box-border inset-0 bg-black bg-opacity-30  hover:bg-transparent'></div>

            {savedPost?.length > 3 &&
              savedPost
                .slice(0, 4)
                .map((posts) => (
                  <RenderMedia mediaUrl={posts?.imageAndVideo[0]} cssOverride='w-full border h-full object-cover' />
                ))}
            <span className='bottom-2 left-2 absolute text-white text-lg  hover:hidden'>
              {savedPost.length === 0 ? 'No post saved' : 'All posts'}
            </span>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <section className='min-h-screen  ml-[17rem]'>
      <InfiniteScroll
        dataLength={displayedPosts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}></p>}
      >
        <main className='w-[calc(100% - 40px)] max-w-[935px] mx-auto pt-8 pt-30px'>
          <header className='pb-20'>
            <div className='grid grid-cols-[1fr_2fr]'>
              {/* Avatar */}
              <div className='relative flex items-center justify-center flex-grow h-full cursor-pointer'>
                {isLoading ? (
                  <FadeLoader height={15} margin={2} radius={2} width={4} />
                ) : (
                  <RenderMedia
                    mediaUrl={avatar}
                    cssOverride='rounded-full object-cover border-2 border-gray-300 h-full max-h-[150px] aspect-square'
                  />
                )}
              </div>
              <div className='flex flex-col items-start gap-8'>
                {/* User Information */}
                <div className='text-center flex justify-start items-center gap-4'>
                  <h1 className='text-xl font-medium'>{user?.nickName}</h1>
                  {/* Buttons */}

                  {isSelfPersonal ? (
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={() => navigate('/your_account/settings')}
                        className='bg-gray-200 hover:bg-gray-500 px-4 py-2 rounded-md font-medium'
                      >
                        Edit profile
                      </button>
                      <button
                        onClick={() => navigate('/stories/archive')}
                        className='bg-gray-200 hover:bg-gray-500 px-4 py-2 rounded-md font-medium'
                      >
                        View archive
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={handleFollowUserOrUnfollow}
                        className={`${isFollowing ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-500 text-black'} px-4 py-2 rounded-md font-medium `}
                      >
                        {loadingFollow ? (
                          <PulseLoader
                            color='white'
                            loading={true}
                            cssOverride={override}
                            size={5}
                            margin={2}
                            aria-label='Loading Spinner'
                            data-testid='loader'
                          />
                        ) : isFollowing ? (
                          'Following'
                        ) : (
                          'Follow'
                        )}
                      </button>
                      <button
                        onClick={handleNavigateToChatRoom}
                        className='bg-gray-200 hover:bg-gray-500 px-4 py-2 rounded-md font-medium'
                      >
                        Message
                      </button>{' '}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className='flex items-center justify-start gap-6'>
                  <button className='text-center flex gap-2 items-center'>
                    <span className='font-bold text-lg'>{postList?.length}</span>
                    <p className='font-normal'>post</p>
                  </button>
                  <button
                    className='text-center flex gap-2 items-center cursor-pointer'
                    onClick={handleShowPopupFollowers}
                  >
                    <span className='font-bold text-lg'>{userFollowersList?.length}</span>
                    <p className='font-normal'>followers</p>
                  </button>
                  <button
                    className='text-center flex gap-2 items-center cursor-pointer'
                    onClick={handleShowPopupFollowing}
                  >
                    <span className='font-bold text-lg'>{userFollowingList?.length}</span>
                    <p className='font-normal'>following</p>
                  </button>
                </div>
                <div className=''>
                  <span className='font-medium text-lg '>{user?.fullName}</span>
                </div>
              </div>
            </div>
          </header>
        </main>
        <div className='flex relative items-center justify-center gap-4 mt-4 border-t border-gray-300 w-[calc(100% - 40px)] max-w-[935px] mx-auto'>
          <button
            onClick={() => setActiveTab('posts')}
            className={`-mt-[1px] px-4 py-1 ${activeTab === 'posts' && 'border-t-[1px] border-grey-color2'}`}
          >
            <span className={`font-medium text-base ${activeTab === 'posts' ? 'text-black' : 'text-grey-color2'}`}>
              Posts
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`-mt-[1px] px-4 py-1 ${activeTab === 'reels' && 'border-t-[1px] border-grey-color2'}`}
          >
            <span className={`font-medium text-base ${activeTab === 'reels' ? 'text-black' : 'text-grey-color2'}`}>
              Reels
            </span>
          </button>

          {isSelfPersonal && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`-mt-[1px] px-4 py-1 ${activeTab === 'saved' && 'border-t-[1px] border-grey-color2'}`}
            >
              <span className={`font-medium text-base ${activeTab === 'saved' ? 'text-black' : 'text-grey-color2'}`}>
                Saved
              </span>
            </button>
          )}
        </div>

        <div className='w-[calc(100% - 40px)] max-w-[935px] mx-auto pb-20'>
          <Routes>
            <Route path='/stories/:storyId' element={<Story />} />
            <Route path='*' element={renderContent()} />
          </Routes>
        </div>

        {selectedPost && <PostPopup isVisible={isPopupOpen} onClose={onClose} postData={selectedPost} />}
      </InfiniteScroll>
      <TinyPopupData isVisible={isPopupData} onClose={onClosePopupData} user={user} action={action} />
    </section>
  )
}

export default Personal
