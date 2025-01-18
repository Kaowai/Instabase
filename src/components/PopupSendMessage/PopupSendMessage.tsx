import React, { useState, useCallback, useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { User } from '../../models/User/User.model'
import { searchGlobalUserService } from '../../apis/userService'
import { RenderMedia } from '../../utils/renderImage'
import styles from './PopupSendMessage.module.css'
import { debounce } from 'lodash'
import { getAllChatRooms, sendTextMessage } from '../../apis/chatService'

type Props = {
  isVisible: boolean
  onClose: () => void
}

const LoadingSkeleton = () => (
  <div className='animate-pulse'>
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className='w-full py-3 px-4 flex items-center gap-2 justify-between border-b'>
        <div className='flex items-center gap-2'>
          <div className='w-12 h-12 rounded-full bg-gray-200'></div>
          <div className='flex flex-col gap-2'>
            <div className='w-32 h-4 bg-gray-200 rounded'></div>
            <div className='w-24 h-3 bg-gray-100 rounded'></div>
          </div>
        </div>
        <div className='w-5 h-5 rounded-full bg-gray-200'></div>
      </div>
    ))}
  </div>
)

const PopupSendMessage = ({ isVisible, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [listUser, setListUser] = useState<User[]>([])
  const [listUserSearch, setListUserSearch] = useState<User[]>([])
  const [inputSearch, setInputSearch] = useState('')

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!isVisible) return

      if (searchTerm.length === 0) {
        setListUserSearch([])
        setIsLoading(false)
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
          setIsLoading(false)
        }
      }
    }, 500),
    [isVisible]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
      setListUserSearch([])
      setIsLoading(false)
      setInputSearch('')
    }
  }, [debouncedSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputSearch(value)
    setIsLoading(true)
    debouncedSearch(value)
  }

  const handleAddOrRemoveUser = (userId: string) => {
    const selectedUser = listUserSearch.find((user) => user.userId === userId)
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
    }
    setInputSearch('')
  }

  const handleRemoveUser = (userId: string) => {
    setListUser((prev) => prev.filter((user) => user.userId !== userId))
  }

  const isUserSelected = (user: User) => {
    return listUser.some((selectedUser) => selectedUser.userId === user.userId)
  }

  const handleSendMessage = async () => {
    const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
    for (const user of listUser) {
      await sendTextMessage(userId, user.userId, '@@@@@@')
      const response = await getAllChatRooms(userId)
      const newChatRoom = response
    }
  }
  if (!isVisible) return null
  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-20 flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Popup */}
      <div className={`relative rounded-xl bg-white shadow-lg  w-[500px] max-w-[500px] h-2/3 z-[20] overflow-hidden`}>
        {/* Header */}

        <div className='absolute flex justify-between px-2 items-center h-12 border-b-[1px] border-grey-color3 w-full '>
          <div className='w-full text-center'>
            <span className='font-bold text-base'>New message</span>
          </div>
          <div className=' top-1 right-1 cursor-pointer' onClick={onClose}>
            <IoMdClose size={24} fill='black' />
          </div>
        </div>

        {/* Content create new post */}
        <div className={`w-full h-full flex justify-center items-center`}>
          <div className='w-full h-full pt-12 flex flex-col items-start justify-between overflow-y-hidden'>
            <div className='w-full py-2 border-b-[1px] border-grey-color3 flex justify-center items-center gap-2'>
              <span className='pl-2 text-base font-semibold'>To:</span>
              <div className='flex items-center gap-2 customScrollbar'>
                {listUser.map((user) => (
                  <div key={user?.userId} className='flex items-center gap-2 bg-[#e0f1ff] rounded-xl px-2 py-1'>
                    <span className='text-base font-normal text-[#0095f6] text-nowrap cursor-pointer transition-all hover:text-blue-800'>
                      {user?.fullName}
                    </span>
                    <IoMdClose size={12} fill='#0095f6' onClick={() => handleRemoveUser(user.userId)} />
                  </div>
                ))}
              </div>
              <input
                type='text'
                value={inputSearch}
                placeholder='Search...'
                onChange={handleSearch}
                className='w-full p-2 border  rounded-md border-none outline-none'
              />
            </div>
            <div className='w-full h-full border overflow-y-auto'>
              {isLoading ? (
                <LoadingSkeleton />
              ) : listUserSearch.length > 0 ? (
                listUserSearch.map((user) => (
                  <div
                    key={user?.userId}
                    className='w-full py-3 px-4 flex items-center gap-2 hover:bg-grey-color4 cursor-pointer justify-between'
                    onClick={() => handleAddOrRemoveUser(user.userId)}
                  >
                    <div className='flex items-center gap-2'>
                      <RenderMedia mediaUrl={user?.avatar} cssOverride='w-12 h-12 rounded-full' />
                      <span>{user?.fullName}</span>
                    </div>
                    <label className={styles.customRadio}>
                      <input
                        type='checkbox'
                        name='selectedUser'
                        className='hidden'
                        checked={isUserSelected(user)}
                        onChange={() => handleAddOrRemoveUser(user.userId)}
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                  </div>
                ))
              ) : (
                <div className='w-full h-full flex justify-center items-center'>
                  <span className='text-base font-semibold'>No user found</span>
                </div>
              )}
            </div>
            <div className='w-full flex justify-center px-4'>
              <button
                onClick={handleSendMessage}
                disabled={listUser.length === 0}
                className='bg-blue-500 text-base font-semibold text-white p-2 rounded-md mb-2 w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-all'
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupSendMessage
