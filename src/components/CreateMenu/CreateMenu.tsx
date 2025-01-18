import { motion } from 'framer-motion'
import { BsImages, BsCameraVideo } from 'react-icons/bs'
import { IoMdImages } from 'react-icons/io'

interface CreateMenuProps {
  isVisible: boolean
  onClose: () => void
  onSelectOption: (option: 'post' | 'story' | 'reel') => void
  position: { top: number; left: number }
}

const CreateMenu = ({ isVisible, onClose, onSelectOption, position }: CreateMenuProps) => {
  if (!isVisible) return null

  return (
    <>
      <div className='fixed inset-0 z-[999]' onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='fixed z-[1000] bg-white rounded-lg shadow-lg p-2 w-[200px]'
        style={{
          top: position.top,
          left: position.left + 60
        }}
      >
        <div className='flex flex-col'>
          <button
            onClick={() => onSelectOption('post')}
            className='flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <BsImages size={20} />
            <span>Create Post</span>
          </button>
          <button
            onClick={() => onSelectOption('story')}
            className='flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <IoMdImages size={20} />
            <span>Create Story</span>
          </button>
          <button
            onClick={() => onSelectOption('reel')}
            className='flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <BsCameraVideo size={20} />
            <span>Create Reel</span>
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default CreateMenu
