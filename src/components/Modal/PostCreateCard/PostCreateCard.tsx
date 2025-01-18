import { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import styles from './PostCreateCard.module.css'
import { BsImages } from 'react-icons/bs'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import Carousel from '../../Carousel/Carousel'
import avatar2 from '../../../assets/avatar2.webp'
import { UserResponse } from '../../../models/User/User.model'
import { searchGlobalUserService } from '../../../apis/userService'
import _ from 'lodash'
import defaultAvatar from '../../../assets/default_avatar.jpg'
import ClipLoader from 'react-spinners/ClipLoader'
import { MdDone } from 'react-icons/md'
import { uploadImage } from '../../../utils/uploadImage'
import { createPost, updatePost } from '../../../apis/postService'
import { motion } from 'framer-motion'
import { Post } from '../../../models/post.model'

type Props = {
  isVisible: boolean
  onClose: () => void
  postData?: Post
  isEdit?: boolean
  refreshAfterEdit?: () => void
}

const PostCreateCard = ({ isVisible, onClose, postData, isEdit = false, refreshAfterEdit = () => {} }: Props) => {
  const MAX_LENGTH = 1000

  const [step, setStep] = useState<number>(1)
  const [images, setImages] = useState<string[]>([]) // Chứa URL của các ảnh đã chọn
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [inputContent, setInputContent] = useState<string>('') // Nội dung div nhập vào => dùng để debounce
  const [userSearch, setUserSearch] = useState<UserResponse[]>([])
  const [keywordSearch, setKeyWordSearch] = useState<string>('') // Keyword use to search global user
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [htmlString, setHtmlString] = useState<string>('')
  const [listUserTag, setListUserTag] = useState<UserResponse[]>([])
  const [listHagTag, setListHagTag] = useState<Array<string>>([])
  const [imageFiles, setImagesFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)

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
    if (isEdit && postData) {
      setStep(3)
      setImages(postData?.imageAndVideo)
      setInputContent(postData?.postTitle)
      setHtmlString(postData?.postTitle)
      return
    }
    setStep(1)
    setImages([])
    setInputContent('')
    setKeyWordSearch('')
    setUserSearch([])
    setIsShowSearch(false)
    setHtmlString('')
    setListUserTag([])
    setImagesFiles([])
    setIsLoading(false)
    setLoading(false)
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
    setStep((pre) => pre + 1)
    setLoading(true)

    if (isEdit) {
      try {
        const uploadedImageUrls = await uploadImage(imageFiles)
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
        let postTitle = inputContent
        listUserTag?.forEach((user) => {
          postTitle = postTitle.replace(`${user.nickName}`, `@${user.nickName}@`)
        })
        postTitle.replace('\\n', '')
        console.log(postTitle)
        const req = {
          postId: postData?.postId,
          userId: user.userId,
          postTitle: postTitle,
          imageAndVideo: uploadedImageUrls,
          listHagtag: listHagTag
        }

        console.log('Request:', req)
        // Step 3: Call API to save post to the database
        const response = await updatePost(req)
        console.log('Create post response:', response)
      } catch (err) {
        console.log(err)
      } finally {
        // Ensure loading spinner is hidden
        setLoading(false)
        refreshAfterEdit()
      }
    } else {
      try {
        // Step 1: Upload images
        const uploadedImageUrls = await uploadImage(imageFiles)

        // Step 2: Prepare request payload
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
        let postTitle = inputContent
        listUserTag?.forEach((user) => {
          postTitle = postTitle.replace(`${user.nickName}`, `@${user.nickName}@`)
        })
        postTitle.replace('\\n', '')
        console.log(postTitle)
        const req = {
          userId: user.userId,
          postTitle: postTitle,
          imageAndVideo: uploadedImageUrls,
          listHagTag: listHagTag
        }
        console.log('Request:', req)
        // Step 3: Call API to save post to the database
        const response = await createPost(req)
        console.log('Create post response:', response)
      } catch (error) {
        // Handle errors from both `uploadImage` and `createPost`
        console.error('Error:', error)
      } finally {
        // Ensure loading spinner is hidden
        setLoading(false)
      }
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
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1001] flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Close button */}
      <div className='fixed top-1 right-1 cursor-pointer' onClick={onClose}>
        <IoMdClose size={28} fill='white' />
      </div>

      {/* Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${styles.popup} relative rounded-xl bg-white shadow-lg 
                   ${step !== 3 ? 'w-[520px]' : 'w-[900px]'} h-[550px] z-10 overflow-hidden`}
      >
        {/* Header with motion */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute flex justify-center items-center h-12 border-b-[1px] border-grey-color3 w-full'
        >
          {step === 1 && <span className='font-semibold text-xl'>Create new post</span>}
          {step === 2 && (
            <div className='w-full flex justify-between items-center px-4'>
              <FaArrowLeft size={16} className='cursor-pointer' onClick={handleBackStep} />
              <span className='font-semibold text-xl'>Crop</span>
              <FaArrowRight size={16} className='cursor-pointer' onClick={handleNextStep} />
            </div>
          )}
          {step === 3 && (
            <div className='w-full flex justify-between items-center px-4'>
              <FaArrowLeft size={16} className='cursor-pointer' onClick={handleBackStep} />
              <span className='font-semibold text-xl'>Complete</span>
              <span className='font-bold text-blue-600 cursor-pointer hover:text-blue-800' onClick={handleSubmit}>
                Share
              </span>
            </div>
          )}
          {step === 4 && <span className='font-semibold text-xl'>Shared post</span>}
        </motion.div>

        {/* Content create new post */}
        <div className={`w-full mt-12 h-full ${step === 3 && 'grid grid-cols-[520px_380px]'}`}>
          <div
            className={`w-full h-full flex justify-center items-center flex-col ${styles.noScrollbar} overflow-y-scroll`}
          >
            {/* First step */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full h-full flex justify-center flex-col items-center gap-4'
              >
                <BsImages size={72} className='text-gray-400' />
                <span className='text-xl font-light'>Drag or choose image</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChooseImage}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 
                           hover:bg-blue-700 transition-colors duration-200
                           cursor-pointer outline-none border-none'
                >
                  Select from computer
                </motion.button>
              </motion.div>
            )}

            {/* Second step */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='w-full h-full flex flex-col items-center gap-4'
              >
                <div className='grid grid-cols-3 gap-4'>
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className='relative'
                    >
                      <img src={image} alt={`Selected ${index}`} className='w-full h-auto rounded-lg' />
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setImages((prevImages) => prevImages.filter((_, i) => i !== index))}
                        className='absolute top-1 right-1 p-2 bg-gray-800/50 hover:bg-gray-800/75 
                                 backdrop-blur-sm transition-colors duration-200
                                 rounded-full flex items-center justify-center'
                      >
                        <IoMdClose size={16} fill='white' />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddImage}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 
                           hover:bg-blue-700 transition-colors duration-200
                           cursor-pointer outline-none border-none'
                >
                  Add more images
                </motion.button>
              </motion.div>
            )}

            {/* Step 3 and 4 with motion */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-[520px] h-full'>
                <Carousel imageAndVideo={images} isCreate={true} autoSlide={true} />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='w-full h-full flex justify-center items-center'
              >
                {loading ? (
                  <ClipLoader
                    color='black'
                    loading={loading}
                    size={64}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='w-full h-full flex justify-center flex-col items-center gap-4'
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className='rounded-full border-2 border-black p-4'
                    >
                      <MdDone size={64} />
                    </motion.div>
                    <span className='text-xl font-medium'>Your post has been shared</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right side panel with motion */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='border-l-[1px] border-grey-color3 w-full'
            >
              <div className='flex justify-start items-center gap-2 p-4'>
                <img className={`w-10 h-10 rounded-[90px] object-cover`} src={avatar2} alt='' />
                <span className='font-medium'>hoaiisreal</span>
              </div>
              <div className=' px-4 border-b-[1px] border-grey-color3'>
                <div
                  contentEditable='true'
                  onInput={handleChange}
                  dangerouslySetInnerHTML={{ __html: htmlString }}
                  className={`resize-none w-[350px] h-48 overflow-y-scroll ${styles.noScrollbar} font-normal outline-none`}
                ></div>
              </div>
              {isShowSearch && (
                <div className={`overflow-y-scroll ${styles.noScrollbar} w-full border-2 h-56`}>
                  {isLoading ? (
                    <div className='flex justify-center items-center p-4'>
                      <ClipLoader size={20} />
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
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PostCreateCard
