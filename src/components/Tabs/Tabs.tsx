import React from 'react'

const Tabs = () => {
  return (
    <div className='flex items-center justify-center gap-4 mt-4 border-t border-gray-300'>
      <button className='flex flex-col items-center px-4 py-2'>
        <span>Posts</span>
      </button>
      <button className='flex flex-col items-center px-4 py-2'>
        <span>Saved</span>
      </button>
      <button className='flex flex-col items-center px-4 py-2'>
        <span>Tagged</span>
      </button>
    </div>
  )
}

export default Tabs
