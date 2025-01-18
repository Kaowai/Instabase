import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'
import { BsCameraVideo } from 'react-icons/bs'
import { UserResponse } from '../../../models/User/User.model'
import { searchGlobalUserService } from '../../../apis/userService'
import defaultAvatar from '../../../assets/default_avatar.jpg'
import ClipLoader from 'react-spinners/ClipLoader'
import _ from 'lodash'
import styles from './ReelsCreateCard.module.css'
import { FaArrowLeft } from 'react-icons/fa6'
import { uploadAvatar } from '../../../utils/uploadImage'
import { MdDone } from 'react-icons/md'
import { createReel } from '../../../apis/postService'
import { ReelInput } from '../../../models/post.model'

interface ReelsCreateCardProps {
  isVisible: boolean
  onClose: () => void
}

const ReelsCreateCard = ({ isVisible, onClose }: ReelsCreateCardProps) => {
  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB limit
  const ALLOWED_TYPES = ['video/mp4', 'video/quicktime']
  const MAX_DURATION = 60 // 60 seconds
  const MAX_LENGTH = 1000

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [userSearch, setUserSearch] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [listUserTag, setListUserTag] = useState<UserResponse[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [htmlString, setHtmlString] = useState<string>('')
  const [listHagTag, setListHagTag] = useState<string[]>([])
  const [inputContent, setInputContent] = useState<string>('') // Nội dung div nhập vào => dùng để debounce
  const [keywordSearch, setKeyWordSearch] = useState<string>('') // Keyword use to search global user
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
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

  useEffect(() => {
    if (!isVisible) {
      resetForm()
    }
  }, [isVisible])

  const resetForm = () => {
    setSelectedVideo(null)
    setVideoFile(null)
    setTitle('')
    setListUserTag([])
    setInputContent('')
    setHtmlString('')
    setListUserTag([])
    setListHagTag([])
    setStep(0)
    setLoading(false)
  }

  // Debounced search function

  const handleVideoSelect = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please select a valid video file (MP4 or MOV)')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size should be less than 100MB')
      return
    }

    // Check video duration
    const duration = await getVideoDuration(file)
    if (duration > MAX_DURATION) {
      alert('Video duration should be less than 60 seconds')
      return
    }

    setVideoFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setSelectedVideo(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(video.duration)
      }
      video.src = URL.createObjectURL(file)
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleVideoSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleVideoSelect(file)
    }
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

  const removeHTMLTags = (htmlString: string) =>
    htmlString
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

  const handleSubmit = async () => {
    if (!videoFile) return
    setLoading(true)
    setStep(1)
    try {
      // const videoUrl = await uploadAvatar(videoFile)
      const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
      const videoUrl = await uploadAvatar(videoFile)
      const reelTitle = inputContent

      // Step 1: Loại bỏ thẻ HTML
      const cleanReelTitle = removeHTMLTags(reelTitle)

      // Step 2: Tách chuỗi thành mảng từ (dùng regex để nhận diện mọi khoảng trắng)
      const words = cleanReelTitle.split(/\s+/)

      // Lặp qua từng từ để phân loại hashtag
      const filteredWords = words.filter((word) => {
        if (word.startsWith('#')) {
          setListHagTag((pre) => [...pre, word]) // Thêm hashtag vào danh sách
          return false // Loại bỏ hashtag khỏi reelTitle
        }
        return true // Giữ lại từ không phải hashtag
      })

      // Gộp lại reelTitle
      const finalReelTitle = filteredWords.join(' ')

      // Debug: Log kết quả
      console.log('Reel Title:', finalReelTitle)
      console.log('List Hashtags:', listHagTag)

      // Step 3: Tạo request object
      const req = {
        userId: userId,
        postTitle: finalReelTitle,
        video: videoUrl,
        listHagTag: listHagTag
      }
      const response = await createReel(req)
      console.log(response)
    } catch (error) {
      console.error('Error creating reel:', error)
    }
    setLoading(false)
  }

  if (!isVisible) return null
  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative bg-white shadow-lg w-[850px] h-[600px] z-10 overflow-hidden rounded-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`absolute  h-12 ${!selectedVideo && 'border-b-[1px] border-grey-color3'} w-full z-10`}>
          {step === 0 ? (
            <div className='h-full w-full flex justify-center items-center'>
              {!selectedVideo && <span className='font-bold text-base'>Create new reel</span>}
              <div className='absolute right-2'>
                <IoMdClose size={24} className='cursor-pointer' onClick={onClose} />
              </div>
            </div>
          ) : (
            <div className='h-full w-full flex justify-center items-center border-b-[1px] border-grey-color3'>
              <span className='font-bold text-base'>Loading new reel</span>
            </div>
          )}
        </div>
        {step === 0 ? (
          <>
            {!selectedVideo ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full h-full flex justify-center flex-col items-center gap-4 mt-12
                        ${isDragging ? 'bg-blue-50' : ''} border-2 border-dashed rounded-lg`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <BsCameraVideo
                  size={72}
                  className={`${isDragging ? 'text-blue-500' : 'text-gray-400'} 
                           transition-colors duration-200`}
                />
                <span className='text-xl font-light text-center'>
                  {isDragging ? 'Drop video here' : 'Drag and drop or click to upload'}
                </span>
                <span className='text-sm text-gray-500'>MP4 or MOV, maximum 60 seconds, less than 100MB</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 
                         hover:bg-blue-700 transition-colors duration-200'
                >
                  Select video
                </motion.button>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='video/mp4,video/quicktime'
                  onChange={handleFileInput}
                />
              </motion.div>
            ) : (
              <div className={styles.reelsContainer}>
                {/* Left side - Video */}
                <div className={styles.videoSection}>
                  <video
                    controls={true}
                    ref={videoRef}
                    src={selectedVideo}
                    className={styles.video}
                    autoPlay
                    loop
                    muted
                  />{' '}
                  <div className='absolute cursor-pointer top-4 z-[1000] left-4' onClick={resetForm}>
                    <FaArrowLeft size={16} fill='white' className='cursor-pointer' />
                  </div>
                </div>

                {/* Right side - Input */}
                <div className={styles.inputSection}>
                  {/* User info */}
                  <div className='flex items-center gap-2 p-4 border-b border-gray-200'>
                    <img
                      src={JSON.parse(sessionStorage.getItem('user') || '{}').avatar || defaultAvatar}
                      alt='User'
                      className='w-8 h-8 rounded-full object-cover'
                    />
                    <span className='font-semibold'>{JSON.parse(sessionStorage.getItem('user') || '{}').nickName}</span>
                  </div>

                  {/* Caption input */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='border-l-[1px] border-grey-color3 w-full'
                  >
                    <div className=' px-4 border-b-[1px] border-grey-color3'>
                      <div
                        contentEditable='true'
                        onInput={handleChange}
                        dangerouslySetInnerHTML={{ __html: htmlString }}
                        className={`resize-none w-[350px] h-48 overflow-y-scroll ${styles.noScrollbar} font-normal outline-none`}
                      ></div>
                    </div>
                    {isShowSearch && (
                      <div className={`overflow-y-scroll ${styles.noScrollbar} h-full w-full border`}>
                        {isLoading ? (
                          <div className='flex justify-center items-center p-4'>
                            <ClipLoader size={20} />
                          </div>
                        ) : (
                          <ul className='gap-0'>
                            {userSearch.map((user) => (
                              <li
                                key={user.userId}
                                onClick={() => handleChooseUser(user)}
                                className='list-none gap-2 p-2 cursor-pointer w-full border-b-[1px] border-grey-color3 flex justify-start items-center hover:bg-grey-color1'
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

                  {/* Share button */}
                  <div className='p-4 border-t absolute bottom-0 w-full border-gray-200'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className='w-full py-2 font-medium text-white rounded-lg bg-blue-600 
                             hover:bg-blue-700 transition-colors duration-200'
                    >
                      Share
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='w-full h-[600px] flex justify-center flex-col items-center gap-4 mt-12
                      '
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
                  <span className='text-xl font-medium'>Your story has been shared</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ReelsCreateCard
