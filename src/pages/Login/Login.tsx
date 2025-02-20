import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { loginService } from '../../apis/authService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
interface LoginInput {
  email: string
  password: string
}

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required('Email is required').trim(),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .matches(/^[a-zA-Z0-9]{6,20}$/, 'Password must be alphanumeric with no special characters')
  })
  .required()

const Login = () => {
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
    const user = sessionStorage.getItem('user')
    if (JSON.parse(user)) {
      navigate('/', { replace: true }) // Chuyển hướng nếu đã xác thực
    } else {
      setIsCheckingAuth(false) // Cho phép hiển thị form login
    }
  }, [])

  const onSubmit = async (data: LoginInput): Promise<void> => {
    setLoading(true)
    try {
      const response = await loginService(data.email, data.password)
      sessionStorage.setItem('user', JSON.stringify(response))
      navigate('/', { replace: true }) // Điều hướng sau khi đăng nhập thành công
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Hiển thị màn hình tải trong khi kiểm tra xác thực
  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
      </div>
    )
  }

  // Form đăng nhập
  return (
    <div className='w-screen flex flex-col gap-6 justify-center mt-4 items-center border border-red-500'>
      <div className='w-[350px] h-[410px] border-[1px] border-grey-color3 flex items-center flex-col gap-2 px-8'>
        {/* Logo */}
        <div className='flex h-32 justify-center items-center w-full'>
          <span className='logo'>Instacloud</span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='py-4 flex w-full justify-center items-center flex-col gap-2'
          noValidate
        >
          <div className='w-full'>
            <input
              type='email'
              autoFocus
              autoComplete='off'
              {...register('email')}
              placeholder='Email'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.email && <p className='errors'>{errors.email.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='password'
              autoComplete='off'
              {...register('password')}
              placeholder='Password'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.password && <p className='errors'>{errors.password.message}</p>}
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
        <span className='text-grey-color2'>Don't have any account?</span>
        <span
          onClick={() => navigate('/signup')}
          className='text-blue-600 hover:text-blue-800 font-semibold cursor-pointer'
        >
          Sign Up
        </span>
      </div>
    </div>
  )
}

export default Login
