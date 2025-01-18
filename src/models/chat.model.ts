export interface Chat {
  chatRoomId: string
  userId: string
  name: string
  avatar: string
  isOnline: string
  lastMessage: string
  lastMessageTime: string
}

export interface Message {
  chatMessageId: string
  userSendId: string
  nickName: string
  avatar: string
  message: string | null
  mediaLink: string | null
  sendDate: string
  type: 'Text' | 'Media'
}
