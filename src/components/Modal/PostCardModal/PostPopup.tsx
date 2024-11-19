import { slides } from '../../../fake-data/slides-image.fake'
import Carousel from '../../Carousel/Carousel'
import styles from './PostPopup.module.css'

type Props = {
  isVisible: boolean
  onClose: () => void
}

const PostPopup = ({ isVisible, onClose }: Props) => {
  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center'>
      {/* Lớp phủ mờ */}
      <div className='absolute inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Popup */}
      <div
        className={`${styles.popup} relative bg-white rounded-md shadow-lg w-[1200px] max-w-7xl h-[700px] max-h-[700px] z-[1001] overflow-hidden grid grid-cols-[1fr_500px]`}
      >
        <div className='border-[1px]'>
          <Carousel images={slides} autoSlide={true} autoSlideInterval={3000}></Carousel>
        </div>
        <div className='border-[1px]'>2</div>
      </div>
    </div>
  )
}

export default PostPopup
