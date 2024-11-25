import avatar from './../../assets/avatar.png'

const ProfileHeader = () => {
  return (
    <div className='flex flex-col justify-start items-center gap-4'>
      {/* Avatar */}
      <div className='relative'>
        <img className='w-44 h-44 rounded-full object-cover border-2 border-gray-300' src={avatar} alt='Avatar' />
        <div className='absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full shadow-md cursor-pointer'>
          <span>+</span>
        </div>
      </div>

      {/* User Information */}
      <div className='text-center'>
        <h1 className='text-lg font-semibold'>hoaiisreal</h1>
        <p className='text-gray-600'>Nguyễn Cao Hoài</p>
      </div>

      {/* Stats */}
      <div className='flex items-center justify-center gap-6'>
        <div className='text-center'>
          <span className='font-bold text-base'>1</span>
          <p>post</p>
        </div>
        <div className='text-center'>
          <span className='font-bold text-base'>26</span>
          <p>followers</p>
        </div>
        <div className='text-center'>
          <span className='font-bold text-base'>194</span>
          <p>following</p>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex items-center gap-4'>
        <button className='bg-gray-200 px-4 py-1 rounded-md'>Edit profile</button>
        <button className='bg-gray-200 px-4 py-1 rounded-md'>View archive</button>
      </div>
    </div>
  )
}

export default ProfileHeader
