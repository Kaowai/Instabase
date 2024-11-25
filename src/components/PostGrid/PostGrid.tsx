import React from 'react'

const PostGrid = () => {
  const posts = [
    {
      id: 1,
      image: 'https://via.placeholder.com/400'
    }
  ]

  return (
    <div className='grid grid-cols-3 gap-4 mt-6'>
      {posts.map((post) => (
        <div key={post.id} className='relative group'>
          <img src={post.image} alt='Post' className='w-full h-full object-cover rounded-md' />
          <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity'></div>
        </div>
      ))}
    </div>
  )
}

export default PostGrid
