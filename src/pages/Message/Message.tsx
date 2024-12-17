import styles from './Message.module.css'
import avatar2 from '../../assets/avatar2.webp'
import { useState } from 'react'
import { div } from 'framer-motion/client'

interface Chat {
  avatar: string
  nickName: string
  lastMessage: string
  timeStamp: string
}

interface Message {
  userId: string
  text: string
  timeStamp: string
}
const Message = (): React.JSX.Element => {
  const message: Chat[] = [
    {
      avatar: avatar2,
      nickName: 'hoaiisreal',
      lastMessage: 'Oke toi nho ban day nhe',
      timeStamp: '4w'
    },
    {
      avatar: avatar2,
      nickName: 'davis_ngo',
      lastMessage: 'Oke ban ban dep lam',
      timeStamp: '2w'
    },
    {
      avatar: avatar2,
      nickName: 'linda_do',
      lastMessage: 'Toi nay an gi vay',
      timeStamp: '1w'
    },
    {
      avatar: avatar2,
      nickName: 'hugo_nguyen',
      lastMessage: 'Nha toi nay co dam cuoi',
      timeStamp: '2d'
    },
    {
      avatar: avatar2,
      nickName: 'hoaiisreal',
      lastMessage: 'Oke toi nho ban day nhe',
      timeStamp: '4w'
    },
    {
      avatar: avatar2,
      nickName: 'davis_ngo',
      lastMessage: 'Oke ban ban dep lam',
      timeStamp: '2w'
    },
    {
      avatar: avatar2,
      nickName: 'linda_do',
      lastMessage: 'Toi nay an gi vay',
      timeStamp: '1w'
    },
    {
      avatar: avatar2,
      nickName: 'hugo_nguyen',
      lastMessage: 'Nha toi nay co dam cuoi',
      timeStamp: '2d'
    },
    {
      avatar: avatar2,
      nickName: 'hoaiisreal',
      lastMessage: 'Oke toi nho ban day nhe',
      timeStamp: '4w'
    },
    {
      avatar: avatar2,
      nickName: 'davis_ngo',
      lastMessage: 'Oke ban ban dep lam',
      timeStamp: '2w'
    },
    {
      avatar: avatar2,
      nickName: 'linda_do',
      lastMessage: 'Toi nay an gi vay',
      timeStamp: '1w'
    },
    {
      avatar: avatar2,
      nickName: 'hugo_nguyen',
      lastMessage: 'Nha toi nay co dam cuoi',
      timeStamp: '2d'
    }
  ]

  const boxChatMessage: Message[] = [
    {
      userId: 'aaaaa',
      text: 'Hi xin chào',
      timeStamp: '31 Mar 2024, 18:04'
    },
    {
      userId: 'bbbbb',
      text: 'Hi chào nha',
      timeStamp: '31 Mar 2024, 18:04'
    },
    {
      userId: 'aaaaa',
      text: 'Cậu tên là gì',
      timeStamp: '31 Mar 2024, 18:04'
    },
    {
      userId: 'bbbbb',
      text: 'Tôi là bê tô',
      timeStamp: '31 Mar 2024, 18:04'
    },
    {
      userId: 'aaaaa',
      text: 'Nhìn cậu khác',
      timeStamp: '31 Mar 2024, 18:04'
    },
    {
      userId: 'bbbbb',
      text: 'Khác sao',
      timeStamp: '31 Mar 2024, 18:04'
    }
  ]

  const [activeBoxChat, setActiveBoxChat] = useState<string>('')
  return (
    <div className={styles.container}>
      <div className={styles.boxchat}>
        <div className='font-bold w-full absolute bg-white z-10 text-2xl text-black px-4 py-6 flex gap-2 justify-start items-center'>
          <img className={`w-20 h-20 rounded-[90px] object-cover`} src={avatar2} alt='' />
          <span className='text-xl text-black font-semibold cursor-pointer'>hoaiisreal</span>
        </div>
        <div className='flex justify-start h-[calc(100vh-75px)] items-start flex-col mt-20 overflow-y-scroll'>
          <span className='font-bold text-lg px-5 py-2'>Messages</span>
          {message.map((message) => (
            <div
              key={message.nickName}
              onClick={() => setActiveBoxChat(message.nickName)}
              className={`w-full px-5 py-2 flex justify-start items-center gap-3 cursor-pointer hover:bg-hover-color ${message.nickName === activeBoxChat && 'bg-grey-color4'}`}
            >
              <img className={`w-16 h-16 rounded-[90px] object-cover`} src={message.avatar} alt='' />
              <div className='flex justify-center items-start flex-col'>
                <span className='text-sm font-normal '>{message.nickName}</span>
                <span className='text-grey-color-2'>
                  {message.lastMessage} • {message.timeStamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeBoxChat ? (
        <div className='relative'>
          <div className='font-bold border-b-[1px] border-b-grey-color3 w-full absolute bg-white z-10 text-2xl text-black px-4 py-6 flex gap-2 justify-start items-center'>
            <img className={`w-12 h-12 rounded-[90px] object-cover`} src={avatar2} alt='' />
            <span className='text-lg text-black font-medium cursor-pointer'>Nguyễn Cao Hoài</span>{' '}
          </div>
          <div className='flex justify-start mt-24 flex-col gap-2 overflow-y-scroll h-[calc(100vh-100px)] px-8'>
            {boxChatMessage?.map((message) => (
              <div className='w-full text-center'>
                <span className='w-full text-center font-semibold text-base'>{message.timeStamp}</span>
                <div className={`flex flex-col ${message.userId === 'aaaaa' ? 'items-start' : 'items-end'}`}>
                  {message.userId === 'aaaaa' ? (
                    <div className='flex gap-1 items-center'>
                      <img className={`w-8 h-8 rounded-[90px] object-cover`} src={avatar2} alt='' />
                      <span className='p-2 bg-blue-400 w-fit rounded-lg text-white'>{message.text}</span>
                    </div>
                  ) : (
                    <span className='p-2 bg-blue-400 w-fit rounded-lg text-white'>{message.text}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Message
