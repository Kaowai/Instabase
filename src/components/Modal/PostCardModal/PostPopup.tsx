import { useEffect, useState } from 'react'
import { slides } from '../../../fake-data/slides-image.fake'
import Carousel from '../../Carousel/Carousel'
import styles from './PostPopup.module.css'
import PopupComment from '../../PopupComment/PopupComment'

type Props = {
  isVisible: boolean
  onClose: () => void
}

const PostPopup = ({ isVisible, onClose }: Props) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }[]>([])

  useEffect(() => {
    const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = reject
      })
    }

    const fetchDimensions = async () => {
      try {
        const dimensions = await Promise.all(slides.map((slide) => getImageDimensions(slide)))
        setImageDimensions(dimensions)
        console.log(imageDimensions)
      } catch (error) {
        console.error('Lỗi khi lấy kích thước ảnh:', error)
      }
    }

    fetchDimensions()
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Chặn cuộn của trang ngoài khi popup mở
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth; // Độ rộng thanh cuộn
      // document.body.style.position = 'fixed'; // Giữ trang cố định
      // document.body.style.top = `-${window.scrollY}px`; // Giữ vị trí cuộn
      // document.body.style.width = '100%'; // Ngăn cuộn ngang
      document.body.style.paddingRight = `${scrollBarWidth}px`; // Để không bị mất không gian do thanh cuộn
      document.body.style.overflowY = 'hidden';

    } else {
      // Khi popup đóng, khôi phục lại cuộn cho trang ngoài
      // const scrollY = document.body.style.top; // Vị trí cuộn trước
      // document.body.style.position = ''; // Bỏ cố định
      // document.body.style.top = ''; // Reset vị trí
      // document.body.style.paddingRight = ''; // Bỏ padding
      // window.scrollTo(0, parseInt(scrollY || '0') * -1); // Quay lại vị trí cuộn
      document.body.style.overflowY = 'scroll';
    }

    return () => {
      // Cleanup
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.paddingRight = '';
    };
  }, [isVisible]);


  if (!isVisible) return null

  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Popup */}
      <div
        className={`${styles.popup} relative bg-white shadow-lg h-[680px] z-[1001] overflow-hidden grid grid-cols-[500px_500px]`}
      >
        <div className=''>
          <Carousel images={slides} autoSlide={true} autoSlideInterval={3000}></Carousel>
        </div>
        <div className={`overflow-y-scroll ${styles.noScrollbar}`}>
          <PopupComment />
        </div>
      </div>
    </div>
  )
}

export default PostPopup
