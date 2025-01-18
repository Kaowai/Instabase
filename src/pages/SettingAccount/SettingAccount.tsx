import { RenderMedia } from '../../utils/renderImage'
import defaultImage from '../../assets/default-avatar.jpg'
import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import TinyPopupActionChangeAvatar from '../../components/TinyPopupChangeAvatar/TinyPopupAction'
import { User } from '../../models/User/User.model'
import { getUserById } from '../../apis/userService'
import { uploadAvatar } from '../../utils/uploadImage'
import { setNameAndAvatarService, setNickNameUserService } from '../../apis/authService'
import ClipLoader from 'react-spinners/ClipLoader'

const schema = yup.object().shape({
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

interface UpdateUser {
  fullName: string
  userName: string
}
const SettingAccount = () => {
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const [user, setUser] = useState<User>()
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false)
  const [isPopupChangeAvatarVisible, setIsPopupChangeDataVisible] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [fileAvatar, setFileAvatar] = useState<File | null>()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
      userName: user?.nickName || ''
    }
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setIsLoadingAvatar(true)
    getUserById(userId)
      .then((user) => {
        console.log(user)
        setImageUrl(user?.avatar)
        setUser(user)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoadingAvatar(false)
      })
  }
  const onSubmit = async (data: UpdateUser) => {
    let newImageUrl = ''
    if (fileAvatar) {
      newImageUrl = await uploadAvatar(fileAvatar)
    }
    try {
      Promise.all([
        setNameAndAvatarService(userId, data?.fullName, newImageUrl),
        setNickNameUserService(userId, data?.userName)
      ])
        .then(([response1, response2]) => {
          console.log(response1)
          console.log(response2)
        })
        .catch(([err1, err2]) => {
          console.log(err1)
          console.log(err2)
        })
        .finally(() => fetchUser())
    } catch (error) {
      console.log(error)
    }
  }
  const handlePopupChangeAvatarAction = () => {
    setIsPopupChangeDataVisible(!isPopupChangeAvatarVisible)
  }
  const handleUploadNewAvatar = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0]
      if (file) {
        const imageUrl = URL.createObjectURL(file)
        setFileAvatar(file)
        setImageUrl(imageUrl)
      }
    }
    input.click()
    handlePopupChangeAvatarAction()
  }
  const handleRemoveAvatar = () => {
    setImageUrl(defaultImage)
    setFileAvatar(null)
    handlePopupChangeAvatarAction()
  }
  return (
    <section className='min-h-screen ml-[17rem]'>
      <main className='w-[calc(100% - 40px)] max-w-[935px] flex gap-8 mx-auto pt-[30px] flex-col'>
        <h1 className='font-bold text-2xl '>Edit profile</h1>
        <div className='p-6 flex justify-between items-center w-full rounded-3xl bg-grey-color4'>
          <div className='flex justify-start gap-4'>
            {isLoadingAvatar ? (
              <div className='h-20 w-20 rounded-full'>
                <ClipLoader
                  color='black'
                  loading={isLoadingAvatar}
                  size={64}
                  aria-label='Loading Spinner'
                  data-testid='loader'
                />
              </div>
            ) : (
              <RenderMedia mediaUrl={imageUrl} cssOverride='w-20 h-20 rounded-full' />
            )}
            <div className='flex flex-col items-start justify-center'>
              <span className='font-semibold text-lg'>{user?.nickName}</span>
              <span className='font-normal text-base'>{user?.fullName}</span>
              <input
                type='file'
                accept='image/*'
                style={{ display: 'none' }} // Ẩn input file
                onChange={handleUploadNewAvatar}
              />
            </div>
          </div>
          <button
            onClick={handlePopupChangeAvatarAction}
            className='px-4 text-base font-semibold text-white rounded-xl py-2 bg-blue-500 hover:bg-blue-700 transition-all duration-300'
          >
            Change photo
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full gap-10'>
          <div className='flex flex-col gap-4  rounded-3xl '>
            <label className='font-bold text-lg'>Full name</label>
            <div className='w-full'>
              <input
                className='border w-full outline-none rounded-lg bg-transparent text-base p-4 border-grey-color2 focus:border-blue-500'
                type='text'
                {...register('fullName')}
                placeholder={user?.fullName}
              />
              {errors.fullName && <p className='text-red-500 font-semibold'>{errors.fullName.message}</p>}
            </div>
          </div>

          <div className='flex flex-col gap-4  w-full rounded-3xl '>
            <label className='font-bold text-lg'>User name</label>
            <div className='w-full'>
              <input
                className='border w-full outline-none rounded-lg bg-transparent text-base p-4 border-grey-color2 focus:border-blue-500'
                type='text'
                {...register('userName')}
                placeholder={user?.nickName}
              />
              {errors.userName && <p className='text-red-500 font-semibold'>{errors.userName.message}</p>}
            </div>
          </div>

          <div className='w-full flex justify-end '>
            <button className='px-4 text-base font-semibold text-white rounded-xl py-2 bg-blue-500 hover:bg-blue-700 transition-all duration-300'>
              Save changes
            </button>
          </div>
        </form>
      </main>
      <TinyPopupActionChangeAvatar
        isVisible={isPopupChangeAvatarVisible}
        onClose={handlePopupChangeAvatarAction}
        onDelete={handleRemoveAvatar}
        onUploadNew={handleUploadNewAvatar}
      />
    </section>
  )
}

export default SettingAccount
