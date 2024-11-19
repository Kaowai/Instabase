import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
type Props = {
  images: Array<string>
  autoSlide?: boolean
  autoSlideInterval?: number | 3000
}
const Carousel: React.FC<Props> = ({ images, autoSlide, autoSlideInterval = 3000 }: Props) => {
  const [curr, setCurr] = useState(1)

  const prev = () => setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1))
  const next = () => setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) {
      const slideInterval = setInterval(next, autoSlideInterval)
      return () => clearInterval(slideInterval)
    }
  }, [autoSlide, autoSlideInterval])

  return (
    <div className='overflow-hidden relative'>
      <div className='border-[1px] border-black'>
        <div
          className='flex transition-transform ease-out duration-500'
          style={{ transform: `translate(-${curr * 100}%)` }}
        >
          {images.map((src, index) => (
            <img key={index} className='w-full h-[700px] object-cover bg-center' src={src} alt={`Slide ${index + 1}`} />
          ))}
        </div>
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
              className={`transition-all w-2 h-2 bg-white rounded-full ${curr == i ? 'p-1' : 'bg-opacity-50'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
