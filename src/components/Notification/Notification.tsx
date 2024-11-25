import avatar from './../../assets/avatar.png'

const Notification = () => {
  return (
    <div className='w-full h-24 gap-2 flex justify-start items-center'>
      <img src={avatar} alt='' className='w-8 h-8 rounded-full' />
      <div className='w-full'>
        <span className='text-black font-semibold'>huynthien.slays, huynthien.slays</span>
        <span className='text-black font-light'> and others liked your post</span>
        <span className='text-grey-color1 font-light'> 4w</span>
      </div>
      <img src={avatar} alt='' className='h-12 w-12 rounded-xl' />
    </div>
  )
}

export default Notification
