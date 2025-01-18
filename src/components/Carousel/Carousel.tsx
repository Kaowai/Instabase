import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import defaultImage from '../../assets/default-avatar.jpg'
type Props = {
  imageAndVideo: string[]
  autoSlide?: boolean
  autoSlideInterval?: number | 3000
  isCreate?: boolean
  isVideo?: boolean
}
const Carousel: React.FC<Props> = ({
  imageAndVideo,
  autoSlide,
  autoSlideInterval = 3000,
  isCreate = false,
  isVideo = false
}: Props) => {
  const [curr, setCurr] = useState(0)
  const [isImageError, setIsImageError] = useState(false)

  const prev = () => setCurr((curr) => (curr === 0 ? imageAndVideo?.length - 1 : curr - 1))
  const next = () => setCurr((curr) => (curr === imageAndVideo?.length - 1 ? 0 : curr + 1))

  const handleImageError = () => {
    console.log(imageAndVideo)
    setIsImageError(true)
  }
  useEffect(() => {
    if (!autoSlide) {
      const slideInterval = setInterval(next, autoSlideInterval)
      return () => clearInterval(slideInterval)
    }
  }, [autoSlide, autoSlideInterval])

  const renderMedia = () => {
    return (
      <>
        {imageAndVideo?.map((url) => {
          if (isVideo) {
            return (
              <video
                key={url}
                className={`${isCreate ? 'h-[510px] w-[520px] min-h-[510px] min-w-[520px]' : 'h-[680px] w-[700px] min-h-[680px] min-w-[700px]'} object-cover`}
                autoPlay
              >
                <source src={url} type='video/mp4' />
                <source src={url} type='video/webm' />
                <source src={url} type='video/ogg' />
                Your browser does not support the video tag.
              </video>
            )
          } else {
            return (
              <img
                key={url}
                src={isImageError ? defaultImage : url}
                alt='Media'
                loading='lazy'
                className={`${isCreate ? 'h-[510px] w-[520px] min-h-[510px] min-w-[520px]' : 'h-[680px] w-[700px] min-h-[680px] min-w-[700px]'} object-cover`}
                onError={handleImageError}
              />
            )
          }
        })}
      </>
    )
  }

  useEffect(() => {
    setCurr(0)
  }, [])

  return (
    <div className='overflow-hidden relative box-border	'>
      <div
        className={`flex box-border ${!isCreate ? 'h-[680px] max-h-[680px] w-[700px] max-w-[780px]' : 'w-[520px] h-[510px]'} transition-transform ease-out duration-500`}
        style={{ transform: `translate(-${curr * 100}%)` }}
      >
        {renderMedia()}
      </div>
      <div
        className={`absolute inset-0 items-center flex justify-between p-3 ${imageAndVideo?.length === 0 && 'hidden'}`}
      >
        <button
          onClick={prev}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === 0 && ' invisible'}`}
        >
          <BiChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === imageAndVideo?.length - 1 && 'invisible'}`}
        >
          <BiChevronRight size={20} />
        </button>
      </div>
      <div className='absolute bottom-4 right-0 left-0'>
        <div className='flex items-center justify-center gap-2'>
          {imageAndVideo?.map((_, i) => (
            <div
              className={`transition-all w-2 h-2 bg-grey-color4 rounded-full ${curr == i ? 'p-1' : 'bg-grey-color1 bg-opacity-50'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
