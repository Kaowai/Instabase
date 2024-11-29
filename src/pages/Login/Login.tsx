import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { loginService } from '../../apis/authService'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: any): Promise<void> => {
    try {
      const response = await loginService(data?.email, data?.password)

      // Lưu token và thông tin user vào localStorage

      alert('Đăng nhập thành công!')
      console.log(response)
      navigate('/')
      // Redirect hoặc cập nhật state của ứng dụng
    } catch (err: any) {
      setError(err || 'Đăng nhập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-screen flex flex-col gap-6 justify-center mt-4 items-center'>
      <div className='w-[350px] h-[410px] border-[1px] border-grey-color3 flex items-center flex-col gap-2 px-8'>
        {/* Logo */}
        <div className=' flex h-32 justify-center items-center w-full'>
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
              autoComplete='off'
              {...register('email')}
              placeholder='Email'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className='w-full'>
            <input
              type='password'
              autoComplete='off'
              {...register('password')}
              placeholder='Password'
              className='border-[1px] placeholder:text-gray-400 p-2 text-sm rounded-sm border-grey-color3 outline-none focus:border-grey-color2 w-full h-10'
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <button
            type='submit'
            className='text-white font-bold text-sm disabled:bg-blue-300 w-full bg-blue-500 rounded-md outline-none p-2 mt-3'
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className='flex justify-center items-center w-full mt-2 gap-4'>
          <div className='border-b-[1px] border-grey-color3 w-full'></div>
          <span className='text-grey-color2 font-semibold text-xs'>OR</span>
          <div className='border-b-[1px] border-grey-color3 w-full'></div>
        </div>

        {/* Forgot password */}
        <div className='flex justify-center items-center w-full mt-2 cursor-pointer hover:text-blue-500'>
          <span>Forgot password?</span>
        </div>
      </div>
      <div className='w-[350px] border-[1px] border-grey-color3 flex items-center justify-center gap-2 p-8'>
        <span className='text-grey-color2'>Don't have an account?</span>
        <span className='text-blue-600 hover:text-blue-800 font-semibold cursor-pointer'>Sign up</span>
      </div>
    </div>
  )
}

export default Login
