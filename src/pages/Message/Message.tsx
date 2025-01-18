'use client'
import { useState, useEffect } from 'react'
import ChatRoomItem from '../../components/ChatRoomItem/ChatRoomItem'
import { getAllChatRooms } from '../../apis/chatService'
import { Chat } from '../../models/chat.model'
import { FiEdit } from 'react-icons/fi'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ChatDetail from '../../components/ChatRoomDetails/ChatRoomDetail'
import { PiMessengerLogoLight } from 'react-icons/pi'
import PopupSendMessage from '../../components/PopupSendMessage/PopupSendMessage'

// Define a type for the message objects

const MessageLoadingSkeleton = () => (
  <div className='h-full max-h-screen ml-20 grid grid-cols-[400px_1fr] overflow-y-hidden animate-pulse'>
    {/* Left Column - Chat List Loading */}
    <div className='py-4 border-r-[1px] bg-white overflow-y-hidden'>
      {/* Header Loading */}
      <div className='w-full flex justify-between items-center p-4 mb-4'>
        <div className='w-32 h-6 bg-gray-200 rounded'></div>
        <div className='w-6 h-6 bg-gray-200 rounded'></div>
      </div>

      {/* Search Bar Loading */}
      <div className='relative mb-4 px-4'>
        <div className='w-full h-10 bg-gray-200 rounded-lg'></div>
      </div>

      {/* Messages Header Loading */}
      <div className='w-24 h-6 mx-4 mb-4 bg-gray-200 rounded'></div>

      {/* Chat Items Loading */}
      <div className='space-y-2'>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className='flex items-center gap-3 px-4 py-2'>
            <div className='w-12 h-12 rounded-full bg-gray-200'></div>
            <div className='flex-1'>
              <div className='w-32 h-4 bg-gray-200 rounded mb-2'></div>
              <div className='w-48 h-3 bg-gray-100 rounded'></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Column - Chat Detail Loading */}
    <div className='bg-white flex flex-col h-full p-4'>
      <div className='flex items-center gap-3 p-4 border-b'>
        <div className='w-10 h-10 rounded-full bg-gray-200'></div>
        <div className='w-32 h-5 bg-gray-200 rounded'></div>
      </div>
      <div className='flex-1 p-4 space-y-4'>
        {[1, 2, 3].map((item) => (
          <div key={item} className='flex gap-2'>
            <div className='w-8 h-8 rounded-full bg-gray-200'></div>
            <div className='w-64 h-10 bg-gray-200 rounded-lg'></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Message = () => {
  const myId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).userId : ''
  const [chatRooms, setChatRooms] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat>()
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(sessionStorage.getItem('user') as string)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Initial load of chat rooms and selected chat
  useEffect(() => {
    const chatRoomId = location.pathname.split('/').pop()

    const loadChatRooms = async () => {
      setIsLoading(true)
      try {
        const res = await getAllChatRooms(myId)
        if (res?.length) {
          setChatRooms(res)
          if (chatRoomId && chatRoomId !== 'messages') {
            const matchingChat = res.find((chat) => chat.chatRoomId === chatRoomId)
            if (matchingChat) {
              setSelectedChat(matchingChat)
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat rooms:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChatRooms()
  }, [myId]) // Remove location.pathname dependency

  // Update chat rooms and reorder them
  const updateChatRooms = async () => {
    try {
      const res = await getAllChatRooms(myId)
      if (res?.length) {
        // Sort chat rooms by latest message timestamp
        const sortedChatRooms = res.sort((a, b) => {
          const aTime = new Date(a.lastMessage?.createdDate || 0).getTime()
          const bTime = new Date(b.lastMessage?.createdDate || 0).getTime()
          return bTime - aTime
        })

        setChatRooms(sortedChatRooms)

        // Update selected chat with latest data
        if (selectedChat) {
          const updatedSelectedChat = sortedChatRooms.find((chat) => chat.chatRoomId === selectedChat.chatRoomId)
          if (updatedSelectedChat) {
            setSelectedChat(updatedSelectedChat)
          }
        }
      }
    } catch (error) {
      console.error('Error updating chat rooms:', error)
    }
  }

  // Add effect to periodically update chat rooms
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedChat) {
        updateChatRooms()
      }
    }, 500) // Update every 5 seconds

    return () => clearInterval(intervalId)
  }, [selectedChat, myId])

  const handleChatSelection = (chatRoom: Chat) => {
    setSelectedChat(chatRoom)
    navigate(`/messages/${chatRoom.chatRoomId}`)
  }
  // Filter chat rooms based on search input
  const handleOpenChatSearch = () => {
    setIsVisible(true)
  }
  const handleCloseChatSearch = () => {
    setIsVisible(false)
  }

  if (isLoading) {
    return <MessageLoadingSkeleton />
  }

  return (
    <div className='h-full max-h-screen ml-20 grid grid-cols-[400px_1fr] overflow-y-hidden'>
      <div className='py-4 border-r-[1px] bg-white overflow-y-hidden'>
        <div className='w-full flex justify-between items-center p-4 mb-4'>
          <h1 className=' text-2xl font-bold '>{user?.nickName}</h1>
          <div className='cursor-pointer'>
            <FiEdit size={24} />
          </div>
        </div>
        <div className='relative mb-4 px-4'>
          <input
            type='text'
            placeholder='Search...'
            className='w-full p-2 border rounded-lg bg-grey-color4 outline-none focus:ring-1 focus:ring-blue-500'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z'
            />
          </svg>
        </div>
        <div className='w-full text-lg px-4 py-2 font-semibold'>Messages</div>
        {chatRooms?.map((chatRoom) => (
          <ChatRoomItem
            key={`${chatRoom?.chatRoomId}-${chatRoom?.lastMessage?.messageId}`}
            chat={chatRoom}
            selected={selectedChat?.chatRoomId === chatRoom.chatRoomId}
            onClick={() => handleChatSelection(chatRoom)}
          />
        ))}
      </div>
      <div className='bg-white flex flex-col h-full'>
        <Routes>
          <Route
            path='/'
            element={
              <div className='flex flex-col gap-4 justify-center items-center  w-full h-screen'>
                <div className='rounded-full p-4 border-2 border-black'>
                  <PiMessengerLogoLight size={56} />
                </div>
                <div className='text-2xl font-bold'>Your messages</div>
                <div className='text-lg font-normal'>Send a message to start a conversation</div>
                <button
                  onClick={handleOpenChatSearch}
                  className='bg-blue-500 text-white p-2 rounded-md transition-all hover:bg-blue-700'
                >
                  Send message
                </button>
                <PopupSendMessage isVisible={isVisible} onClose={handleCloseChatSearch} />
              </div>
            }
          />
          <Route
            path='/:chatRoomId'
            element={
              <ChatDetail key={selectedChat?.chatRoomId} selectedChat={selectedChat} onMessageSent={updateChatRooms} />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default Message
