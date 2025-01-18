import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'
import { Chat } from '../../models/chat.model'
import { getAllChatRooms, sendTextMessage } from '../../apis/chatService'
import { getUserFollow, searchGlobalUserService } from '../../apis/userService'
import { User } from '../../models/User/User.model'
import { GoLink, GoSearch } from 'react-icons/go'
import { debounce } from 'lodash'
import { MdCancel } from 'react-icons/md'
import { RenderMedia } from '../../utils/renderImage'
import { FaCheckCircle } from 'react-icons/fa'
import { Post } from '../../models/post.model'
interface Props {
  isVisible: boolean
  onClose: () => void
  postData: Post
}

const TinySharePopup = ({ isVisible, onClose, postData }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  // This is list user initialize, and it will render UI
  const [listUserInitialize, setListUserInitialize] = useState<User[]>([])
  const [inputSearch, setInputSearch] = useState<string>('')
  // This is list user to display when search
  const [listUserSearch, setListUserSearch] = useState<User[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  //   This is user will send message which has chosen
  const [listUser, setListUser] = useState<User[]>([])

  const [inputMessage, setInputMessage] = useState<string>('')
  useEffect(() => {
    resetForm()
    fetchUserShare()
  }, [isVisible])

  const resetForm = () => {
    setListUser([])
    setLoading(false)
    setIsLoadingSearch(false)
    setInputMessage('')
    setInputSearch('')
    setIsFocus(false)
  }
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!isVisible) return

      if (searchTerm.length === 0) {
        setListUserSearch([])
        setIsLoadingSearch(false)
        return
      }

      try {
        const results = await searchGlobalUserService(searchTerm)
        if (isVisible) {
          setListUserSearch(results)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        if (isVisible) {
          setIsLoadingSearch(false)
        }
      }
    }, 500),
    [isVisible]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
      setListUserSearch([])
      setIsLoadingSearch(false)
      setInputSearch('')
    }
  }, [debouncedSearch])

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }
  const fetchUserShare = async () => {
    setLoading(true)
    try {
      const listChatRooms = await getAllChatRooms(userId)
      if (listChatRooms?.length === 0) {
        const listUserFollowers = await getUserFollow(userId)
        setListUserInitialize(listUserFollowers)
        setListUserSearch(listUserFollowers)
      } else {
        const mappedUsers: User[] = listChatRooms?.map((chatRoom) => ({
          userId: chatRoom?.userId,
          nickName: '',
          fullName: chatRoom?.name,
          avatar: chatRoom?.avatar
        }))
        setListUserInitialize(mappedUsers)
        setListUserSearch(mappedUsers)
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  const handleChangeInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputMessage(value)
  }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputSearch(value)
    setIsLoadingSearch(true)
    debouncedSearch(value)
  }

  const handleFocusSearch = () => {
    setIsFocus(true)
  }

  const handleAddOrRemoveUser = (userId: string, flag: string) => {
    let selectedUser
    if (flag === 'search') {
      selectedUser = listUserSearch.find((user) => user.userId === userId)
      console.log(selectedUser)
    } else {
      console.log(userId)
      console.log(listUserInitialize)
      selectedUser = listUserInitialize.find((user) => user.userId === userId)
      console.log(selectedUser)
    }

    if (!selectedUser) return

    if (listUser.some((user) => user.userId === userId)) {
      // Remove user
      console.log('remove')
      setListUser((prev) => prev.filter((user) => user.userId !== userId))
    } else {
      // Add user if not already in list
      console.log('add')
      setListUser((prev) => {
        if (prev.some((user) => user.userId === userId)) return prev
        return [...prev, selectedUser]
      })
      console.log('cacwj')
    }
    setInputSearch('')
  }

  const isUserSelected = (user: User) => {
    return listUser.some((selectedUser) => selectedUser.userId === user.userId)
  }

  const handleSharePost = async () => {
    try {
      for (const user of listUser) {
        const currentPage = `http://localhost:3000/post/${postData?.postId}`
        await sendTextMessage(userId, user?.userId, inputMessage)
        await sendTextMessage(userId, user?.userId, currentPage)
      }
    } catch (err) {
      console.log(err)
    }
    onClose()
  }

  if (!isVisible) {
    return
  }
  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Close button */}
      <div className='fixed top-1 right-1 cursor-pointer' onClick={onClose}>
        <IoClose size={28} fill='white' />
      </div>

      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative rounded-2xl bg-white shadow-lg w-[520px] h-[550px] z-10 overflow-hidden'
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute flex justify-center items-center h-12 border-b-[1px] border-grey-color3 w-full px-4'
        >
          <span className='font-semibold text-xl'>{'Share'}</span>
        </motion.div>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute top-12 w-full bg-white flex justify-between items-center gap-2 px-4 py-2'
        >
          <div className='py-1 px-4 bg-grey-color4 rounded-lg flex justify-between items-center gap-2 max-w-[500px] w-full'>
            <GoSearch size={20} fill='#848484' />
            <input
              type='text'
              ref={searchInputRef}
              value={inputSearch}
              placeholder='Search...'
              onChange={handleSearch}
              onFocus={handleFocusSearch}
              className='p-2 bg-transparent rounded-md border-none outline-none w-full'
            />
            {inputSearch?.length > 0 && (
              <button>
                <MdCancel
                  onClick={() => {
                    setInputSearch('')
                    handleSearchClick()
                  }}
                  size={20}
                  className='cursor-pointer hover:opacity-20'
                />
              </button>
            )}
          </div>
          {isFocus && (
            <button className='font-semibold hover:opacity-50 cursor-pointer' onClick={() => setIsFocus(false)}>
              Cancel
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className='h-full w-full flex justify-center items-center'>
            <ClipLoader color='black' loading={loading} size={64} aria-label='Loading Spinner' data-testid='loader' />
          </div>
        ) : (
          <div className='w-full my-32 h-[324px] overflow-y-scroll px-4'>
            {/*  */}
            {isFocus ? (
              <div className='w-full h-full '>
                {isLoadingSearch ? (
                  <ClipLoader
                    color='black'
                    loading={loading}
                    size={64}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                  />
                ) : (
                  <div>
                    {listUserSearch?.length === 0
                      ? 'Not found account'
                      : listUserSearch?.map((user) => (
                          <div
                            key={user?.userId}
                            className='w-full py-3 px-4 flex items-center gap-2 hover:bg-grey-color4 cursor-pointer justify-between'
                            onClick={() => handleAddOrRemoveUser(user.userId, 'search')}
                          >
                            <div className='flex items-center gap-2'>
                              <RenderMedia mediaUrl={user?.avatar} cssOverride='w-12 h-12 rounded-full' />
                              <span>{user?.fullName}</span>
                            </div>
                            <label className={'customRadio'}>
                              <input
                                type='checkbox'
                                name='selectedUser'
                                className='hidden'
                                checked={isUserSelected(user)}
                                onChange={() => handleAddOrRemoveUser(user.userId, 'search')}
                              />
                              <span className={'checkmark'}></span>
                            </label>
                          </div>
                        ))}
                  </div>
                )}
              </div>
            ) : (
              <div className='w-full  grid grid-cols-4 gap-2'>
                {listUserInitialize?.map((user) => (
                  <div
                    key={user?.userId}
                    onClick={() => handleAddOrRemoveUser(user?.userId, 'click')}
                    className='flex cursor-pointer gap-2 relative flex-col justify-between items-center h-32' // Đặt min-height
                  >
                    <div className='relative flex-shrink-0'>
                      <img src={user?.avatar} className='w-20 border h-20 rounded-full object-cover ' />
                      {isUserSelected(user) && (
                        <FaCheckCircle size={16} fill='#0095f6' className='absolute bottom-0 z-1 right-0' />
                      )}
                    </div>
                    <span className='text-sm text-center break-words max-w-[100px] leading-tight flex-1'>
                      {user?.fullName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute flex flex-col py-2 bottom-0 gap-4 bg-white border-t justify-start items-center h-[110px] w-full px-4'
        >
          {listUser.length === 0 ? (
            <div className='flex justify-center w-full h-full items-start flex-col gap-1'>
              <div className='rounded-full w-14 h-14 flex justify-center items-center bg-grey-color4'>
                <GoLink size={24} />
              </div>
              <span className='text-sm'>Copy link</span>
            </div>
          ) : (
            <>
              <input
                value={inputMessage}
                onChange={handleChangeInputMessage}
                className='w-full outline-none bg-none py-2 px-2'
                placeholder='Write a message'
                type='text'
              />
              <button
                onClick={handleSharePost}
                disabled={inputMessage.trim().length === 0}
                className='bg-blue-500 disabled:opacity-70 disabled:cursor-default text-white font-semibold py-2 px-2 w-full rounded-md hover:bg-blue-700 transition-all duration-200'
              >
                Send
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TinySharePopup
