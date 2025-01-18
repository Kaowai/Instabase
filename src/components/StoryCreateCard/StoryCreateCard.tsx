import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { MdDone, MdOutlineAddPhotoAlternate } from 'react-icons/md'
import ImageEditor from '../ImageEditor/ImageEditor'
import { uploadAvatar, uploadImage } from '../../utils/uploadImage'
import { createStory } from '../../apis/storyService'
import { ClipLoader } from 'react-spinners'

interface StoryCreateCardProps {
  isVisible: boolean
  onClose: () => void
}

const StoryCreateCard = ({ isVisible, onClose }: StoryCreateCardProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setSelectedImage(null)
    setImageFile(null)
    setIsEditing(false)
    setLoading(false)
    setStep(0)
  }, [isVisible])

  if (!isVisible) return null

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsEditing(true)
      }
      reader.readAsDataURL(file)
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setIsEditing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = (editedImage: string) => {
    fetch(editedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], imageFile?.name || 'edited-image.jpg', { type: 'image/jpeg' })
        setImageFile(file)
        setSelectedImage(editedImage)
        setIsEditing(false)
      })
  }

  const handleSubmit = async () => {
    if (!imageFile) return
    setLoading(true)
    setStep(1)

    try {
      console.log('Uploading file:', imageFile)
      const imageUrl = await uploadAvatar(imageFile)
      const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId

      const response = await createStory(userId, imageUrl)
      console.log(response)
    } catch (error) {
      console.error('Error creating story:', error)
    }
    setLoading(false)
  }

  return (
    <div className='fixed overflow-y-hidden box-border inset-0 z-[1000] flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute box-border inset-0 bg-black bg-opacity-50' onClick={onClose}></div>

      {/* Close button */}
      <div className='fixed top-1 right-1 cursor-pointer' onClick={onClose}>
        <IoClose size={28} fill='white' />
      </div>

      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative rounded-xl bg-white shadow-lg w-[520px] h-[550px] z-10 overflow-hidden'
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='absolute flex justify-between items-center h-12 border-b-[1px] border-grey-color3 w-full px-4'
        >
          <span className='font-semibold text-xl'>{step === 0 ? 'Create story' : 'Loading story'}</span>
          {selectedImage && !isEditing && step === 0 && (
            <button onClick={() => setIsEditing(true)} className='text-blue-600 font-semibold hover:text-blue-700'>
              Edit
            </button>
          )}
        </motion.div>
        {/* Content */}
        {step === 0 ? (
          <div className='w-full mt-12 h-full'>
            {!selectedImage ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full h-full flex justify-center flex-col items-center gap-4
                        ${isDragging ? 'bg-blue-50' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <MdOutlineAddPhotoAlternate
                  size={72}
                  className={`${isDragging ? 'text-blue-500' : 'text-gray-400'} 
                           transition-colors duration-200`}
                />
                <span className='text-xl font-light'>{isDragging ? 'Drop image here' : 'Drag or choose image'}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='py-2 px-4 font-medium text-white rounded-lg bg-blue-600 
                         hover:bg-blue-700 transition-colors duration-200
                         cursor-pointer outline-none border-none'
                >
                  Select from computer
                </motion.button>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageSelect}
                />
              </motion.div>
            ) : !isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='relative w-full h-full'>
                <img src={selectedImage} alt='Selected' className='w-full h-full object-contain' />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedImage(null)}
                  className='absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-800/75 
                         backdrop-blur-sm transition-colors duration-200
                         rounded-full flex items-center justify-center'
                >
                  <IoClose size={20} fill='white' />
                </motion.button>
              </motion.div>
            ) : null}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='w-full h-full flex justify-center items-center'
          >
            {loading ? (
              <ClipLoader color='black' loading={loading} size={64} aria-label='Loading Spinner' data-testid='loader' />
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
        )}
        {/* Footer */}
        {step === 0 && (
          <>
            {selectedImage && !isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='absolute bottom-0 w-full border-t-[1px] border-grey-color3 p-4 
                       flex justify-end items-center gap-2 bg-white'
              >
                <button
                  onClick={onClose}
                  className='px-4 py-2 text-gray-700 hover:bg-gray-100 
                       rounded-lg transition-colors duration-200'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className='px-4 py-2 font-medium text-white rounded-lg bg-blue-600 
                       hover:bg-blue-700 transition-colors duration-200
                       cursor-pointer outline-none border-none'
                >
                  Share
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Image Editor Modal */}
      {isEditing && selectedImage && (
        <ImageEditor image={selectedImage} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
      )}
    </div>
  )
}

export default StoryCreateCard
