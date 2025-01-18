import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getMessageSpecificChatRoom, sendMediaFileMessage, sendTextMessage } from '../../apis/chatService'
import { RenderMedia } from '../../utils/renderImage'
import { Chat, Message } from '../../models/chat.model'
import { uploadImage } from '../../utils/uploadImage'
import { useDispatch } from 'react-redux'
import { disconnectSignalR, initializeSignalR } from '../../redux/signalRSlice'
import { FiImage } from 'react-icons/fi'
import { BsSend } from 'react-icons/bs'
import { getUserById } from '../../apis/userService'
import { IoMdClose } from 'react-icons/io'
import { ClipLoader } from 'react-spinners'
import { Post } from '../../models/post.model'
import { getPostById } from '../../apis/postService'

interface Props {
  selectedChat?: Chat
}
const ChatDetail = ({ selectedChat }: Props): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const myId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).userId : ''
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const signalRState = useSelector((state: RootState) => state.signalR)
  const { connection } = signalRState
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([])
  const [isSending, setIsSending] = useState(false)
  const [posts, setPosts] = useState<{ [key: string]: Post }>({})

  useEffect(() => {
    // Initialize SignalR
    dispatch(initializeSignalR('http://localhost:32681/notificationHub'))

    return () => {
      dispatch(disconnectSignalR())
    }
  }, [dispatch])

  useEffect(() => {
    if (selectedChat?.chatRoomId) {
      fetchMessages(selectedChat?.chatRoomId)
    }
  }, [selectedChat])

  useEffect(() => {
    if (connection && selectedChat) {
      connection.on('ReceiveNotification', () => {
        // Fetch messages and chat rooms when a notification is received
        fetchMessages(selectedChat.chatRoomId)
        // getAllChatRooms(myId).then(setChatRooms)
      })
    }
  }, [connection, selectedChat])

  const fetchMessages = async (chatRoomId: string) => {
    try {
      const res = await getMessageSpecificChatRoom(chatRoomId)
      setMessages(res)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && previewImages.length === 0) || !selectedChat) return

    try {
      setIsSending(true)

      // If there are images, upload them
      if (previewImages.length > 0) {
        const imageFiles = previewImages.map((img) => img.file)
        await uploadImage(imageFiles)
          .then((res) => {
            if (selectedChat?.userId) {
              return sendMediaFileMessage(myId, selectedChat.userId, res)
            }
          })
          .then((data) => {
            console.log(data)
            fetchMessages(selectedChat.chatRoomId)
          })
          .catch((err) => console.log(err))

        // Clear previews and revoke URLs
        previewImages.forEach((img) => URL.revokeObjectURL(img.preview))
        setPreviewImages([])
      }

      // If there's text, send it
      if (newMessage.trim()) {
        await sendTextMessage(myId, selectedChat.userId, newMessage)
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      const isUserNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      if (isUserNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList)

    // Create preview for new images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setPreviewImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev]
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleViewProfile = async () => {
    if (!selectedChat?.userId) return
    const user = await getUserById(selectedChat?.userId)
    if (user) {
      navigate(`/${user.nickName}`)
    }
  }

  useEffect(() => {
    const fetchPostsForMessages = async () => {
      for (const message of messages) {
        if (message.message?.includes('/')) {
          const postId = message.message.split('/').pop()
          if (postId && !posts[postId]) {
            try {
              const post = await getPostById(postId)
              setPosts((prev) => ({
                ...prev,
                [postId]: post
              }))
            } catch (err) {
              console.log(err)
            }
          }
        }
      }
    }

    fetchPostsForMessages()
  }, [messages])

  const handleNavigateToPersonal = (nickName: string) => {
    navigate(`/${nickName}`)
  }

  const handleToLinkPost = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  return (
    <div className='bg-white flex flex-col h-screen overflow-y-hidden'>
      {selectedChat && (
        <>
          <div className='flex items-center p-4 border-b'>
            <RenderMedia mediaUrl={selectedChat?.avatar} cssOverride='w-10 h-10 rounded-full mr-3' />
            <div>
              <div className='font-semibold text-lg'>{selectedChat?.name ? selectedChat?.name : 'User Instacloud'}</div>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto overflow-x-hidden'>
            <div className='flex justify-center items-center flex-col gap-4 mb-20'>
              <RenderMedia mediaUrl={selectedChat?.avatar} cssOverride='w-20 h-20 rounded-full' />
              <span className='font-semibold text-2xl'>{selectedChat?.name}</span>
              <button
                onClick={handleViewProfile}
                className='outline-none text-black font-semibold text-base px-4 py-2 bg-grey-color4 rounded-xl transition-all hover:bg-grey-color1'
              >
                View Profile
              </button>
            </div>

            <div className='flex-1 customScrollbar p-4 space-y-2'>
              {messages.map((message, index) => {
                if (index === 0 && message?.message === '@@@@@@') {
                  return null
                }
                const isSentByMe = message.userSendId === myId

                if (message.message?.includes('/')) {
                  const postId = message.message.split('/').pop()
                  const post = posts[postId || '']
                  console.log(isSentByMe)
                  return (
                    <div
                      key={message.chatMessageId}
                      className={`w-full cursor-pointer flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}
                    >
                      {post && (
                        <div
                          onClick={() => handleToLinkPost(post?.postId)}
                          className={`h-full bg-grey-color4 rounded-3xl w-full max-w-[320px] gap-4 py-4 `}
                        >
                          <div className='flex pb-2 justify-start gap-2 items-center px-2'>
                            <img className='w-10 h-10 rounded-full' src={post?.imageAndVideo[0]} />
                            <span onClick={() => handleNavigateToPersonal(post?.nickName)} className='font-semibold'>
                              {post?.nickName}
                            </span>
                          </div>
                          <div className={`w-[320px] h-[320px] mb-2`}>
                            <RenderMedia
                              cssOverride='w-full h-full object-cover rounded-sm'
                              mediaUrl={post?.imageAndVideo[0]}
                            />
                          </div>
                          <span className='px-2 mt-2 font-semibold duration-200 transition-all'>{post?.postTitle}</span>
                        </div>
                      )}
                    </div>
                  )
                }

                if (message.type === 'Media') {
                  return (
                    <div
                      key={message.chatMessageId}
                      className={`w-full  flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`w-72 h-72 `}>
                        <img className='w-full h-full object-cover rounded-sm' src={message?.mediaLink} />
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={message.chatMessageId} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 break-words
                        ${isSentByMe ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}
                      `}
                    >
                      {message.message}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className='px-4'>
            {previewImages.length > 0 && (
              <div className='flex flex-wrap gap-2 py-3 border-t relative'>
                {isSending && (
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10'>
                    <div className='text-center'>
                      <ClipLoader color='#ffffff' size={30} />
                      <div className='text-white mt-2'>Sending...</div>
                    </div>
                  </div>
                )}

                {previewImages.map((img, index) => (
                  <div key={index} className='relative group'>
                    <img src={img.preview} alt='Preview' className='w-20 h-20 object-cover rounded-lg' />
                    <button
                      onClick={() => removeImage(index)}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1
                               opacity-0 group-hover:opacity-100 transition-opacity'
                      disabled={isSending}
                    >
                      <IoMdClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='p-4 flex items-center border-t'>
            <div className='rounded-3xl border w-full border-grey-color3 flex items-center p-2'>
              <label className='flex items-center cursor-pointer'>
                <FiImage size={28} className={isSending ? 'opacity-50' : ''} />
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                  multiple
                  disabled={isSending}
                />
              </label>

              <input
                type='text'
                placeholder='Type a message...'
                className='flex-1 p-2 outline-none border-none rounded-full ml-2'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSending) {
                    handleSendMessage()
                  }
                }}
                disabled={isSending}
              />
              <button
                className='ml-2'
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && previewImages.length === 0) || isSending}
              >
                {isSending ? (
                  <ClipLoader size={20} color='#3B82F6' />
                ) : (
                  <BsSend
                    size={24}
                    className={`${!newMessage.trim() && previewImages.length === 0 ? 'text-gray-400' : ''}`}
                  />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatDetail
