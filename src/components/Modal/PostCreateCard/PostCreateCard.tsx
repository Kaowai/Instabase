import { useCallback, useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import styles from './PostCreateCard.module.css'
import { BsImages } from 'react-icons/bs'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaArrowRight } from 'react-icons/fa6'
import Carousel from '../../Carousel/Carousel'
import avatar2 from '../../../assets/avatar2.webp'
import { UserResponse } from '../../../models/User/User.model'
import { searchGlobalUserService } from '../../../apis/userService'
import _ from 'lodash'
import defaultAvatar from '../../../assets/default_avatar.jpg'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../config'
type Props = {
  isVisible: boolean
  onClose: () => void
}

const PostCreateCard = ({ isVisible, onClose }: Props) => {
  const MAX_LENGTH = 1000

  const [step, setStep] = useState<number>(1)
  const [images, setImages] = useState<string[]>([]) // Chứa URL của các ảnh đã chọn
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [inputContent, setInputContent] = useState<string>('') // Nội dung div nhập vào => dùng để debounce
  const [userSearch, setUserSearch] = useState<UserResponse[]>([])
  const [keywordSearch, setKeyWordSearch] = useState<string>('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [htmlString, setHtmlString] = useState<string>('')
  const [listUserTag, setListUserTag] = useState<UserResponse[]>([])
  const [imageFiles, setImagesFiles] = useState<File[]>([])

  useEffect(() => {
    resetSetting()
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

  useEffect(() => {
    const handler = _.debounce(() => {
      setDebouncedKeyword(keywordSearch)
    }, 300) // 300ms debounce delay

    handler()

    return () => {
      handler.cancel()
    }
  }, [keywordSearch])

  useEffect(() => {
    if (debouncedKeyword) {
      searchGlobalUserService(debouncedKeyword)
        .then((response) => {
          setUserSearch(response)
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
      setIsLoading(false)
    }
  }, [debouncedKeyword])

  const resetSetting = () => {
    setStep(1)
    setImages([])
    setInputContent('')
    setKeyWordSearch('')
    setUserSearch([])
    setIsShowSearch(false)
    setHtmlString('')
    setListUserTag([])
    setImagesFiles([])
  }

  const handleChooseImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true // Cho phép chọn nhiều ảnh
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement)?.files
      if (files) {
        const fileArray = Array.from(files)
        const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
        setImages((prevImages) => [...prevImages, ...imageUrls]) // Cập nhật danh sách ảnh
        setImagesFiles((prev) => [...prev, ...fileArray])
        setStep(2)
      }
    }
    input.click()
  }

  const handleAddImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true // Cho phép chọn nhiều ảnh
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement)?.files
      if (files) {
        const fileArray = Array.from(files)
        const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
        setImages((prevImages) => [...prevImages, ...imageUrls]) // Cập nhật danh sách ảnh
        setImagesFiles((prev) => [...prev, ...fileArray])
      }
    }
    input.click()
  }
  const handleChooseUser = (user: UserResponse) => {
    setListUserTag((prev) => [...prev, user])

    const words = inputContent.split(' ')
    words[words.length - 1] = `<a className='font-bold'>${user.nickName}</a>&nbsp;`
    let updatedContent = words.join(' ')

    listUserTag.forEach((taggedUser) => {
      const regex = new RegExp(`\\b${taggedUser.nickName}\\b`, 'g')
      updatedContent = updatedContent.replace(regex, `<a className='font-bold'>${taggedUser.nickName}</a>`)
    })

    updatedContent += '<br/><span></span>'
    setHtmlString(updatedContent)

    setTimeout(() => {
      const div = document.querySelector('[contenteditable="true"]') as HTMLDivElement
      if (div) {
        div.focus()
        const range = document.createRange()
        const selection = window.getSelection()

        // Đặt con trỏ sau ký tự cuối cùng trong thẻ div
        const lastChild = div.lastChild
        if (lastChild) {
          if (lastChild.nodeType === Node.TEXT_NODE) {
            range.setStart(lastChild, lastChild.textContent?.length || 0)
          } else if (lastChild.nodeType === Node.ELEMENT_NODE) {
            range.selectNodeContents(lastChild)
            range.collapse(false)
          }
        } else {
          range.selectNodeContents(div)
          range.collapse(false)
        }

        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }, 0)

    setIsShowSearch(false)
    setUserSearch([])
    setIsLoading(false)
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

  const handleSubmit = async () => {
    if (imageFiles.length === 0) {
      alert('No images to upload')
      return
    }

    const uploadedImageUrls: string[] = []

    // Hiển thị thông báo hoặc trạng thái upload
    setIsLoading(true)

    try {
      for (const file of imageFiles) {
        const storageRef = ref(storage, `images/${file.name}-${Date.now()}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        // Quản lý tiến trình tải lên
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log(`Upload is ${progress}% done`)
            },
            (error) => {
              console.error('Upload failed:', error)
              reject(error)
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              uploadedImageUrls.push(downloadURL)
              resolve()
            }
          )
        })
      }

      // Sau khi upload tất cả ảnh, xử lý tiếp dữ liệu (e.g., lưu vào database)
      console.log('Uploaded image URLs:', uploadedImageUrls)

      // Reset dữ liệu
      setImages([])
      setImagesFiles([])
      resetSetting()

      // Thông báo thành công
      alert('Images uploaded successfully!')
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
    let content = event.currentTarget.innerText || ''

    // Check content nếu vượt quá số lượng từ qui định
    if (content.length > MAX_LENGTH) {
      content = content.slice(0, MAX_LENGTH) // Cắt bớt nếu vượt quá giới hạn
    }

    // Set description cho content gửi api
    setInputContent(content)

    // Lấy từ cuối của content có chứa @
    const lastWord = content.split(' ').pop()
    if (lastWord?.startsWith('@') && lastWord.length > 1) {
      setIsShowSearch(true)
      setKeyWordSearch(lastWord.slice(1))
    } else {
      setIsShowSearch(false)
    }
  }

  if (!isVisible) return null

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
              <div
                contentEditable='true'
                onInput={handleChange}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                className={`resize-none w-[350px] h-48 overflow-y-scroll ${styles.noScrollbar} outline-none font-normal`}
              ></div>
            </div>
            {isShowSearch && (
              <div className={`overflow-y-scroll ${styles.noScrollbar} w-full border-2 h-56`}>
                {isLoading ? (
                  <div className='flex justify-center items-center h-full'>
                    <span>Loading...</span> {/* Hoặc một spinner */}
                  </div>
                ) : (
                  <ul>
                    {userSearch.map((user) => (
                      <li
                        key={user.userId}
                        onClick={() => handleChooseUser(user)}
                        className='list-none gap-2 p-1 cursor-pointer w-full border-b-[1px] border-grey-color3 flex justify-start items-center hover:bg-grey-color1'
                      >
                        <img
                          className={`w-8 h-8 rounded-[90px] object-cover`}
                          src={user.avatar || defaultAvatar}
                          alt=''
                        />
                        <div className='flex flex-col justify-start items-start'>
                          <span className='font-bold'>{user?.nickName}</span>
                          <span className='font-normal'>{user?.fullName}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCreateCard
