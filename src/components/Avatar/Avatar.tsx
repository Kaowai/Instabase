import React from 'react'
interface Props {
  avatar: string
  isHaveStory: boolean
  isSeen: boolean
}
const Avatar = ({ avatar, isHaveStory, isSeen }: Props): React.JSX.Element => {
  return (
    <div
      className={`flex flex-col h-14 w-14 ${isHaveStory ? 'justify-center' : 'justify-start'}  items-center cursor-pointer`}
    >
      {isHaveStory === true ? (
        <div
          className={`h-12 w-12 rounded-full flex justify-center items-center ${isSeen ? 'bg-[#dbdbdb]' : 'bg-custom-gradient'}`}
        >
          <div className={`bg-white w-11 h-11 flex justify-center items-center rounded-full`}>
            <img className={`w-10 h-10 rounded-[90px] object-cover`} src={avatar} alt='' />
          </div>
        </div>
      ) : (
        <img className={`w-10 h-10 rounded-[90px] object-cover`} src={avatar} alt='' />
      )}
    </div>
  )
}

export default Avatar
