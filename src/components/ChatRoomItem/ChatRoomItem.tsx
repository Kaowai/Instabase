import React, { useEffect, useState } from 'react'
import { RenderMedia } from '../../utils/renderImage'
import { Chat, Message } from '../../models/chat.model'
import { getMessageSpecificChatRoom } from '../../apis/chatService'
import { calculateTime } from '../../utils/sharedFunctions'

interface ChatRoomItemProps {
  chat: Chat
  selected: boolean
  onClick: () => void
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ chat, selected, onClick }) => {
  const [lastestMessage, setLatestMessage] = useState<Message>()
  const MAX_LENGTH = 35
  useEffect(() => {
    getMessageSpecificChatRoom(chat?.chatRoomId)
      .then((res) => {
        const message = res[res.length - 1]
        setLatestMessage(message)
      })
      .catch((err) => console.log(err))
  }, [chat])

  const getLatestMessage = (): string => {
    const userId = JSON.parse(sessionStorage.getItem('user') as string)?.userId
    if (chat?.lastMessage === '@@@@@@') {
      return 'Draft'
    }
    // Check if latest message from self user
    const flag = chat?.userId === userId
    if (flag) {
      if (lastestMessage?.type === 'Media') {
        return 'You have sent attach file'
      } else {
        if (chat?.lastMessage?.includes('http://localhost:3000')) {
          return `You have sent an attachment.`
        } else if (chat?.lastMessage?.length > MAX_LENGTH) {
          return `You: ${chat?.lastMessage?.slice(0, MAX_LENGTH)}...`
        } else {
          return `You: ${chat?.lastMessage}`
        }
      }
    } else {
      if (lastestMessage?.type === 'Media') {
        return `${chat?.name}: have sent attach file`
      } else {
        if (chat?.lastMessage?.includes('http://localhost:3000')) {
          return `${chat?.name} have sent an attachment.`
        } else if (chat?.lastMessage?.length > MAX_LENGTH) {
          return `${chat?.lastMessage?.slice(0, MAX_LENGTH)}...`
        } else {
          return `${chat?.lastMessage}`
        }
      }
    }
  }

  return (
    <div
      className={`flex items-center p-4 cursor-pointer ${selected ? 'bg-grey-color4' : 'hover:bg-grey-color4'}`}
      onClick={onClick}
    >
      <RenderMedia mediaUrl={chat?.avatar} cssOverride='w-14 h-14 rounded-full object-cover mr-3' />
      <div className='flex flex-col items-start gap-1'>
        <div className='font-normal text-base text-black'>{chat?.name}</div>
        <div className='flex justify-start items-center gap-4 w-full'>
          <div
            className={`text-xs whitespace-nowrap text-ellipsis ${getLatestMessage() === 'Draft' ? 'text-red-500' : 'text-grey-color2 '}`}
          >
            {getLatestMessage()}
          </div>
          <div className='text-xs text-grey-color2'> • {calculateTime(chat?.lastMessageTime)}</div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoomItem
