import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { signUpService } from '../../apis/authService'

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/^[a-zA-Z0-9]{6,20}$/, 'Password must be alphanumeric with no special characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Confirm password must match')
})

interface SignupInput {
  email: string
  password: string
  confirmPassword: string
}
const Signup = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true) // Trạng thái kiểm tra
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      navigate('/', { replace: true })
    } else {
      setIsCheckingAuth(false) // Cho phép hiển thị form login
    }
  }, [])

  const onSubmit = async (data: SignupInput): Promise<void> => {
    setLoading(true)
    try {
      const response = await signUpService(data.email, data.password)
      localStorage.setItem('userId', response.userId)
      navigate('/', { replace: true }) // Điều hướng sau khi đăng nhập thành công
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
      </div>
    )
  }
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
        <form onSubmit={handleSubmit(onSubmit)} className='py-4 flex w-full justify-center items-center flex-col gap-2'>
          <div className='w-full'>
            <input
              type='email'
              {...register('email')}
              placeholder='Email'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.email && <p className='errors'>{errors.email.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='password'
              placeholder='Password'
              {...register('password')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.password && <p className='errors'>{errors.password.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='password'
              placeholder='Confirm password'
              {...register('confirmPassword')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.confirmPassword && <p className='errors'>{errors.confirmPassword.message}</p>}
          </div>
          <div className='w-full justify-start flex items-start gap-2 mt-1'>
            <input type='checkbox' name='term' className='mt-1' />

            <label htmlFor='term' className='font-light text-sm text-gray-600'>
              By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
            </label>
          </div>
          <button
            type='submit'
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
