import { motion } from 'framer-motion'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineShowChart } from 'react-icons/md'

interface CreateMenuProps {
  isVisible: boolean
  onClose: () => void
  onSelectOption: (option: 'logout' | 'switch account' | 'settings' | 'your activity') => void
  position: { top: number; left: number }
}

const SettingMenu = ({ isVisible, onClose, onSelectOption, position }: CreateMenuProps) => {
  if (!isVisible) return null

  return (
    <>
      <div className='fixed inset-0 z-[999]' onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='fixed z-[1000] bg-white rounded-lg shadow-lg p-2 w-[240px]'
        style={{
          top: position.top - 240,
          left: position.left + 10
        }}
      >
        <div className='flex flex-col'>
          <button
            onClick={() => onSelectOption('settings')}
            className='flex items-center gap-2 p-4 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <IoSettingsOutline size={20} />

            <span>Settings</span>
          </button>
          <button
            onClick={() => onSelectOption('your activity')}
            className='flex items-center gap-2 p-4 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <MdOutlineShowChart size={20} />
            <span>Your activity</span>
          </button>
          <hr className='h-1 w-full bg-grey-color4 my-2' />
          <button
            onClick={() => onSelectOption('switch account')}
            className='flex items-center gap-2 p-4 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <span>Switch account</span>
          </button>
          <button
            onClick={() => onSelectOption('logout')}
            className='flex items-center gap-2 p-4 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <span>Log out</span>
          </button>
        </div>
      </motion.div>
    </>
  )
}

export default SettingMenu
