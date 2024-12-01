import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import styles from './PostCreateCard.module.css'
import { BsImages } from 'react-icons/bs'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaArrowRight } from 'react-icons/fa6'
import Carousel from '../../Carousel/Carousel'
import avatar2 from '../../../assets/avatar2.webp'
import { UserResponse } from '../../../models/User/User.model'
import { searchGlobalUserService } from '../../../apis/userService'

type Props = {
  isVisible: boolean
  onClose: () => void
}

const PostCreateCard = ({ isVisible, onClose }: Props) => {
  const [step, setStep] = useState<number>(1)
  const [images, setImages] = useState<string[]>([]) // Chứa URL của các ảnh đã chọn
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [inputContent, setInputContent] = useState<string>('') // Nội dung textarea
  const [userSearch, setUserSearch] = useState<UserResponse[]>([])

  useEffect(() => {
    if (isVisible) {
      // Chặn cuộn của trang ngoài khi popup mở
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth // Độ rộng thanh cuộn
      document.body.style.paddingRight = `${scrollBarWidth}px` // Để không bị mất không gian do thanh cuộn
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'scroll'
    }

    return () => {
      // Cleanup
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.paddingRight = ''
    }
  }, [isVisible])

  const handleChooseImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true // Cho phép chọn nhiều ảnh
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement)?.files
      if (files) {
        const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
        setImages((prevImages) => [...prevImages, ...imageUrls]) // Cập nhật danh sách ảnh
        setStep(2)
      }
    }
    input.click()
  }

  if (!isVisible) return null

  const handleAddImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true // Cho phép chọn nhiều ảnh
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement)?.files
      if (files) {
        const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
        setImages((prevImages) => [...prevImages, ...imageUrls]) // Cập nhật danh sách ảnh
      }
    }
    input.click()
  }

  const handleBackStep = () => {
    if (step === 2) {
      setImages([])
    }
    setStep((pre) => pre - 1)
  }
  const handleNextStep = () => {
    setStep((pre) => pre + 1)
  }

  const handleSubmit = () => {}

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value
    setInputContent(content)

    // Kiểm tra xem ký tự cuối cùng có phải là "@" hay không
    const lastWord = content.split(' ').pop() // Lấy từ cuối cùng

    if (lastWord?.startsWith('@')) {
      setIsShowSearch(true)
    } else {
      setIsShowSearch(false)
    }

    const delayDebounce = setTimeout(() => {
      const lastWord = inputContent.split(' ').pop()
      if (lastWord?.startsWith('@')) {
        console.log('Last word: ', lastWord)
        const keyword = lastWord.slice(1)
        if (keyword.trim() === '') return

        const fetchUsers = async () => {
          try {
            console.log('Key word', keyword.trim())
            // const response = await searchGlobalUserService(keyword)
            // setUserSearch(response)
            // console.log('Response', response)
          } catch (error) {
            console.log('Error', error)
          }
        }

        fetchUsers()
      }
    }, 300) // Chỉ gọi sau khi người dùng ngừng nhập trong 300ms

    return () => clearTimeout(delayDebounce) // Cleanup timeout nếu `inputContent` thay đổi
  }

  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>
      <div className=' fixed top-1 right-1 cursor-pointer' onClick={onClose}>
        <IoMdClose size={28} fill='white' />
      </div>
      {/* Popup */}
      <div
        className={`${styles.popup} relative rounded-xl bg-white shadow-lg ${step !== 3 ? 'w-[520px]' : 'w-[900px]'} h-[550px] z-[1001] overflow-hidden`}
      >
        {/* Header */}

        <div className='absolute flex justify-center items-center h-12 border-b-[1px] border-grey-color3 w-full '>
          {step === 1 && <span className='font-bold text-base'>Create new post</span>}
          {step === 2 && (
            <div className='w-full flex justify-between items-center px-4'>
              <FaArrowLeft size={16} className='cursor-pointer' onClick={handleBackStep} />
              <span className='font-bold text-base'>Crop</span>
              <FaArrowRight size={16} className='cursor-pointer' onClick={handleNextStep} />
            </div>
          )}
          {step === 3 && (
            <div className='w-full flex justify-between items-center px-4'>
              <FaArrowLeft size={16} className='cursor-pointer' onClick={handleBackStep} />
              <span className='font-bold text-base'>Complete</span>
              <span className='font-bold text-blue-600 cursor-pointer hover:text-blue-800' onClick={handleSubmit}>
                Share
              </span>
            </div>
          )}
        </div>

        {/* Content create new post */}
        <div className={`w-full mt-12 h-full ${step === 3 && 'grid grid-cols-[520px_380px]'}`}>
          <div
            className={` w-full h-full flex justify-center items-center flex-col ${styles.noScrollbar} overflow-y-scroll`}
          >
            {/* First step, drag or choose image */}
            {step === 1 && (
              <div className='w-full h-full flex justify-center flex-col items-center gap-4'>
                <BsImages size={72} />
                <span className='text-xl font-light'>Drag or choose image</span>
                <button
                  onClick={handleChooseImage}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-900 cursor-pointer outline-none border-none'
                >
                  Select from computer
                </button>
              </div>
            )}

            {/* Second step, display selected images */}
            {step === 2 && (
              <div className='w-full h-full flex flex-col items-center gap-4'>
                <div className='grid grid-cols-3 gap-4'>
                  {images.map((image, index) => (
                    <div key={index} className='relative'>
                      <img src={image} alt={`Selected ${index}`} className='w-full h-auto rounded-lg' />
                      <button
                        onClick={() => setImages((prevImages) => prevImages.filter((_, i) => i !== index))}
                        className='absolute top-1 right-1 bg-grey-color3 flex justify-center items-center hover:bg-grey-color2 text-white rounded-full p-1'
                      >
                        <IoMdClose size={16} fill='white' />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddImage}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-900 cursor-pointer outline-none border-none'
                >
                  Add more images
                </button>
              </div>
            )}
            {step === 3 && (
              <div className='w-[520px] h-full'>
                <Carousel images={images} isCreate={true} autoSlide={true} />
              </div>
            )}
          </div>
          <div className='border-l-[1px] border-grey-color3 w-full'>
            <div className='flex justify-start items-center gap-2 p-4'>
              <img className={`w-10 h-10 rounded-[90px] object-cover`} src={avatar2} alt='' />
              <span className='font-medium'>hoaiisreal</span>
            </div>
            <div className=' px-4 border-b-[1px] border-grey-color3'>
              <textarea
                onChange={handleChange}
                value={inputContent}
                maxLength={1000}
                className={`resize-none w-[350px] h-48 overflow-y-scroll ${styles.noScrollbar} outline-none font-normal`}
              ></textarea>
            </div>
            {isShowSearch && (
              <div className={`overflow-y-scroll ${styles.noScrollbar} w-full h-56`}>
                <ul className=''>
                  {userSearch.map((user) => (
                    <li
                      key={user.userId}
                      className='list-none gap-2 p-1 cursor-pointer	w-full border-b-[1px] border-grey-color3 flex justify-start items-center hover:bg-grey-color1'
                    >
                      <img className={`w-8 h-8 rounded-[90px] object-cover`} src={avatar2} alt='' />
                      <div className='flex flex-col justify-start items-start'>
                        <span className='font-bold'>{user?.nickName}</span>
                        <span className='font-normal'>{user?.fullName}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCreateCard
