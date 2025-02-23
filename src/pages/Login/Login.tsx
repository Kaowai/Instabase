import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { loginService } from '../../apis/authService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import phone1 from './../../assets/mockuphome.png'
import phone2 from './../../assets/mockupexplore.png'
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
  })
  .required()

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true) // Trạng thái kiểm tra
  const [isLoginError, setIsLoginError] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
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
      setIsLoginError(true);
    } finally {
      setLoading(false)
    }
  }
  const onFocus = () => {
    setIsLoginError(false)
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
    <div className='w-screen h-screen'>
      <div className='grid w-full h-full grid-cols-2 p-8'>
        <div className='relative flex justify-center w-full h-full gap-2'>
          <div className='flex items-center'>
            <img className='object-contain max-h-[500px]  max-w-1/2 pl-20' src={phone1} loading='lazy' alt="home screen" />
          </div>
          <div className='absolute flex items-center justify-end w-1/2 h-full max-w-1/2 right-8 top-2'>
            <img className='object-contain max-h-[500px] max-w-1/2' src={phone2} loading='lazy' alt="explore screen" />
          </div>
        </div>
        <div className='flex flex-col items-start justify-center gap-6 '>
          <div className='w-[350px] h-[410px] border-[1px] border-grey-color3 flex items-center flex-col gap-2 px-8'>
            {/* Logo */}
            <div className='flex items-center justify-center w-full h-28'>
              <span className='logo'>Instagram</span>
            </div>
            <div>
              <p className='text-center font-semibold text-grey-color2 text-[1.1rem]'>Login to see photos and new post from your friends.</p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col items-center justify-center w-full gap-2 py-4'
              noValidate
              autoComplete="off"
            >
              <div className='w-full'>
                <input
                  type='email'
                  autoFocus
                  onFocus={onFocus}
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
                  onFocus={onFocus}
                  autoComplete='off'
                  {...register('password')}
                  placeholder='Password'
                  className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
                />
                {errors.password && <p className='errors'>{errors.password.message}</p>}
              </div>
              {
                isLoginError && (
                  <div className='w-full'><p className='text-xs font-semibold text-red-500'>*Your password or email was incorrect. Please check your password.</p></div>
                )
              }
              <button
                type='submit'
                disabled={isLoginError}
                className={`text-white font-semibold disabled:bg-blue-300 w-full bg-blue-500 rounded-md outline-none p-2 mt-3 disabled:cursor-default`}
              >
                Log in
              </button>
              <div className='flex items-center justify-center w-full my-4'>
                <hr  className='h-1 bg-grey-color1'/>
                <span className='text-sm font-semibold text-grey-color2'>OR</span>
                <hr  className='h-1 bg-grey-color1'/>
              </div>
            </form>
          </div>
          <div className='w-[350px] border-[1px] border-grey-color3 flex items-center justify-center gap-2 p-8'>
            <span className='text-grey-color2'>Don't have any account?</span>
            <span
              onClick={() => navigate('/signup')}
              className='font-semibold text-blue-600 cursor-pointer hover:text-blue-800'
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
