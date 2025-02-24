import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { loginService, setNameAndAvatarService, setNickNameUserService, signUpService } from '../../apis/authService'
import { ClipLoader } from 'react-spinners'

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
    .oneOf([yup.ref('password')], 'Confirm password must match'),
  fullName: yup
    .string()
    .required('Full Name is required')
    .min(6, 'Full Name must be at least 6 characters')
    .max(50, 'Full Name must be at most 50 characters')
    .matches(/^[a-zA-Z0-9 ]{6,50}$/, 'Full Name must not contain special characters'),
  userName: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .max(50, 'Username must be at most 50 characters')
    .matches(
      /^[a-zA-Z0-9._]{6,50}$/,
      'Username must not contain special characters except . and _ and must not contain spaces'
    )
})

interface SignupInput {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  userName: string
}
const Signup = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true) // Trạng thái kiểm tra
  const [error, setError] = useState<string>('')
  const [isSignupError, setIsSignupError] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const userId = sessionStorage.getItem('user')
    if (userId) {
      navigate('/', { replace: true })
    } else {
      setIsCheckingAuth(false) // Cho phép hiển thị form login
    }
  }, [])

  const onSubmit = async (data: SignupInput): Promise<void> => {
    const defaultImage =
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  
    try {
      setLoading(true);
  
      // Đăng ký tài khoản
      const user = await signUpService(data.email, data.password);
  
      // Cập nhật thông tin người dùng (chạy song song)
      await Promise.all([
        setNameAndAvatarService(user.userId, data.fullName, defaultImage),
        setNickNameUserService(user.userId, data.userName),
      ]);
  
      // Đăng nhập và lấy thông tin
      const loginData = await loginService(data.email, data.password);
      sessionStorage.setItem('user', JSON.stringify(loginData))
      
    } catch (err) {
      setError((err?.detail as string) || "Register failed");
      setIsSignupError(true)
    } finally {
      setLoading(false);
    }
  };
  const onFocus = () => {
    setIsSignupError(false)
  }

    if (isCheckingAuth) {
      return (
        <div className='flex items-center justify-center h-screen'>
          <p>Loading...</p>
        </div>
      )
    }
  return (
    <div className='flex flex-col items-center justify-center w-screen gap-6 mt-4'>
      <div className='w-[350px] h-full border-[1px] border-grey-color3 flex items-center flex-col gap-2 px-8'>
        {/* Logo */}
        <div className='flex items-center justify-center w-full h-20 mt-8 '>
          <span className='logo'>Instagram</span>
        </div>

        {/* Title */}
        <div className='flex items-center justify-center w-full'>
          <span className='text-center font-semibold text-grey-color2 text-[1.1rem]'>
            Sign up to see photos and videos from your friends.
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col items-center justify-center w-full gap-2 py-4 '
        >
          <div className='w-full'>
            <input
              type='email'
              onFocus={onFocus}
              {...register('email')}
              autoComplete='new-email'
              placeholder='Email'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.email && <p className='errors'>{errors.email.message}</p>}
          </div>
          <div className='w-full'>
            <input
              onFocus={onFocus}
              type='password'
              autoComplete='new-password'
              placeholder='Password'
              {...register('password')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.password && <p className='errors'>{errors.password.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='password'
              onFocus={onFocus}
              autoComplete='new-confirm-password'
              placeholder='Confirm password'
              {...register('confirmPassword')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.confirmPassword && <p className='errors'>{errors.confirmPassword.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='text'
              autoComplete='new-full-name'
              onFocus={onFocus}
              placeholder='Full Name'
              {...register('fullName')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.fullName && <p className='errors'>{errors.fullName.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='text'
              onFocus={onFocus}
              placeholder='Username'
              autoComplete='new-username'
              {...register('userName')}
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.userName && <p className='errors'>{errors.userName.message}</p>}
          </div>
          {isSignupError && (<p className='w-full errors'>{error}</p>)}
          <div className='flex flex-col items-start justify-start w-full gap-2 mt-1'>
            <div className='flex items-start gap-2'>
              <p className='text-sm font-light text-center text-gray-600'>
                By sign up, you agree to our Terms, Privacy Policy and Cookies Policy .
              </p>
            </div>
          </div>
          
          <button
            type='submit'
            disabled={loading || Object.keys(errors).length > 0}
            className='w-full p-2 mt-3 text-sm font-bold text-white transition-all bg-blue-500 rounded-md outline-none hover:bg-blue-700 disabled:bg-blue-300'
          >
            {
              loading ? <ClipLoader size={12} color='white'/> : 'Sign up'
            }
          </button>
        </form>
      </div>
      <div className='w-[350px] border-[1px] border-grey-color3 flex items-center justify-center gap-2 p-8'>
        <span className='text-grey-color2'>Already have an account?</span>
        <span
          onClick={() => navigate('/login')}
          className='font-semibold text-blue-600 cursor-pointer hover:text-blue-800'
        >
          Log in
        </span>
      </div>
    </div>
  )
}

export default Signup
