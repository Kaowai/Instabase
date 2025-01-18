import { motion } from 'framer-motion'
interface Props {
  isVisible: boolean
  onClose: () => void
  onUploadNew: () => void
  onDelete: () => void
}
const TinyPopupActionChangeAvatar = ({ isVisible, onClose, onUploadNew, onDelete }: Props) => {
  if (!isVisible) return null
  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1200] flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-70' onClick={onClose}></div>

      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative rounded-xl bg-white shadow-lg w-[400px] h-fit z-10 overflow-hidden'
      >
        {/* Content */}
        <div className='w-full h-full cursor-pointer border-[1px] border-grey-color3'>
          <div className='text-red-500 transition-all duration-300 hover:bg-grey-color3 font-semibold text-center text-base py-6 border-b-[1px] border-grey-color3'>
            <h1 className='text-2xl'>Change Profile Photo</h1>
          </div>
          <div
            onClick={onUploadNew}
            className='text-blue-500 font-bold transition-all duration-300 hover:bg-grey-color3 text-center text-base py-4 border-b-[1px] border-grey-color3'
          >
            Upload Photo
          </div>

          <div
            onClick={onDelete}
            className='text-red-500 font-bold transition-all duration-300 hover:bg-grey-color3 text-center text-base py-4 border-b-[1px] border-grey-color3'
          >
            Remove Current Photo
          </div>

          <div
            onClick={onClose}
            className='text-black transition-all duration-300 hover:bg-grey-color3 font-normal text-center text-base py-4 border-b-[1px] border-grey-color3'
          >
            Cancel
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TinyPopupActionChangeAvatar
