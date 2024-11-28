import React from 'react'

const Signup = () => {
  return (
    <div className='w-screen flex flex-col gap-6 justify-center mt-4 items-center'>
      <div className='w-[350px] h-[410px] border-[1px] border-grey-color3 flex items-center flex-col gap-2 px-8'>
        {/* Logo */}
        <div className=' flex h-20 mt-8 justify-center items-center w-full'>
          <span className='logo'>Instacloud</span>
        </div>

        {/* Title */}
        <div className='flex justify-center items-center w-full'>
          <span className='text-base font-medium text-grey-color2 text-center '>
            Sign up to see photos and videos from your friends.
          </span>
        </div>

        {/* Form */}
        <form action='' className='py-4 flex w-full justify-center items-center flex-col gap-2'>
          <div className='w-full'>
            <input
              type='email'
              placeholder='Email'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
          </div>
          <div className='w-full'>
            <input
              type='password'
              placeholder='Password'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
          </div>
          <div className='w-full'>
            <input
              type='password'
              placeholder='Confirm password'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
          </div>
          <div className='w-full justify-start flex items-start gap-2 mt-1'>
            <input type='checkbox' name='term' className='mt-1' />

            <label htmlFor='term' className='font-light text-sm text-gray-600'>
              By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
            </label>
          </div>
          <button
            type='submit'
            disabled
            className='text-white font-bold text-sm disabled:bg-blue-300 w-full bg-blue-500 rounded-md outline-none p-2 mt-3'
          >
            Log in
          </button>
        </form>
      </div>
      <div className='w-[350px] border-[1px] border-grey-color3 flex items-center justify-center gap-2 p-8'>
        <span className='text-grey-color2'>Already have an account?</span>
        <span className='text-blue-600 hover:text-blue-800 font-semibold cursor-pointer'>Log in</span>
      </div>
    </div>
  )
}

export default Signup
