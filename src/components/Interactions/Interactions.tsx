import { useEffect, useState } from 'react'
import { IoMdClose, IoMdHeartEmpty } from 'react-icons/io'
import { Post } from '../../models/post.model'
import { getPostsLikeByUser, likePost } from '../../apis/postService'
import { useNavigate } from 'react-router-dom'
import FadeLoader from 'react-spinners/FadeLoader'
import TinyPopupConfirm from '../TinyPopupConfirm/TinyPopupConfim'

const Interactions = () => {
  const [postLikes, setPostLikes] = useState<Array<Post>>([])
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [newOrOld, setNewOrOld] = useState<'new' | 'old'>('new')
  const [isPopupConfirmVisible, setIsPopupConfirmVisible] = useState<boolean>(false)
  const [listPost, setListPost] = useState<Array<Post>>([])
  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    setLoading(true)
    getPostsLikeByUser(userId)
      .then((posts) => {
        console.log(posts)
        setPostLikes(posts)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }
  const handleNavigateToPost = (postId: string) => {
    navigate(`/post/${postId}`)
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
  const handleUnlike = async () => {
    try {
      for (const post of listPost) {
        const response = await likePost(userId, post?.postId)
        console.log(response)
      }
    } catch (err) {
      console.log(err)
    }
    fetchPost()
    setIsSelected(false)
    setListPost([])
    handleChangePopupAction()
  }

  const handleSortPost = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value

    const sortedPosts =
      // Không thay đổi vì mảng đã mặc định là từ mới nhất -> cũ nhất
      [...postLikes].reverse() // Đảo ngược mảng nếu chọn "Oldest to newest"

    setPostLikes(sortedPosts)
  }

  const handleChangePopupAction = () => {
    setIsPopupConfirmVisible(!isPopupConfirmVisible)
  }

  return (
    <div className='w-full h-full '>
      <div className='mx-4 flex relative items-center justify-center gap-12 mt-7 border-b w-[calc(100% - 40px)] max-w-[935px]'>
        <button
          className={`-mb-[1px] px-4 py-2 border-b-[2px] border-grey-color2 font-medium text-sm text-black flex gap-2 items-center`}
        >
          <IoMdHeartEmpty size={16} />
          LIKES
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
            {postLikes?.length === 0 && (
              <div className='w-full h-full flex justify-start flex-col gap-4 items-center'>
                <h1 className='text-bold text-3xl'>You haven't like any posts</h1>
                <span className='text-sm font-normal text-grey-color2'>
                  When you like any posts, it will show up here
                </span>
              </div>
            )}

            {postLikes?.map((post) => (
              <div className='w-full h-full relative cursor-pointer'>
                <img
                  src={post.imageAndVideo[0]}
                  className='w-full h-full object-cover cursor-pointer'
                  onClick={() => {
                    if (!isSelected) {
                      handleNavigateToPost(post?.postId)
                    }
                  }}
                />
                {isSelected && (
                  <label className={'customRadio left-0 absolute bottom-6'}>
                    <input
                      type='checkbox'
                      name='selectedUser'
                      className='hidden'
                      checked={isPostSelected(post)}
                      onChange={() => handleAddOrRemovePost(post)}
                    />
                    <span className={'checkmark'}></span>
                  </label>
                )}
              </div>
            ))}
          </div>
          {isSelected && (
            <div className='w-full px-4 h-20 bottom-0 bg-white absolute flex justify-between items-center'>
              <span>
                <IoMdClose size={12} fill='#dbdbdb' />
                {listPost?.length} selected
              </span>
              <button onClick={handleChangePopupAction} className='font-bold text-red-500 hover:opacity-50'>
                Unlike
              </button>
            </div>
          )}
        </>
      )}
      <TinyPopupConfirm isVisible={isPopupConfirmVisible} onClose={handleChangePopupAction} onDelete={handleUnlike} />
    </div>
  )
}

export default Interactions
