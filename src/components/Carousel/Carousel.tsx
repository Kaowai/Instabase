import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
type Props = {
  images: Array<string>
  autoSlide?: boolean
  autoSlideInterval?: number | 3000
  isCreate?: boolean
}
const Carousel: React.FC<Props> = ({ images, autoSlide, autoSlideInterval = 3000, isCreate = false }: Props) => {
  const [curr, setCurr] = useState(0)

  const prev = () => setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1))
  const next = () => setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) {
      const slideInterval = setInterval(next, autoSlideInterval)
      return () => clearInterval(slideInterval)
    }
  }, [autoSlide, autoSlideInterval])

  useEffect(() => {
    setCurr(0)
  }, [])

  const handleLoading = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const size = e.currentTarget
    console.log(size.naturalWidth, size.naturalHeight)
  }

  return (
    <div className='overflow-hidden relative box-border	'>
      <div
        className={`flex box-border ${!isCreate ? 'h-[680px] max-h-[680px] w-[700px] max-w-[780px]' : 'w-[520px] h-[510px]'} transition-transform ease-out duration-500`}
        style={{ transform: `translate(-${curr * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            className='h-[510px] w-[520px] object-cover min-h-[510px] min-w-[520px]'
            src={src}
            onLoad={handleLoading}
            loading='lazy'
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <div className={`absolute inset-0 items-center flex justify-between p-3 ${images.length === 0 && 'hidden'}`}>
        <button
          onClick={prev}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === 0 && ' invisible'}`}
        >
          <BiChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === images.length - 1 && 'invisible'}`}
        >
          <BiChevronRight size={20} />
        </button>
      </div>
      <div className='absolute bottom-4 right-0 left-0'>
        <div className='flex items-center justify-center gap-2'>
          {images.map((_, i) => (
            <div
              className={`transition-all w-2 h-2 bg-blue-500 rounded-full ${curr == i ? 'p-1' : 'bg-white bg-opacity-50'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
