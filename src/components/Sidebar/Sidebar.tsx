import styles from './sidebar.module.css'
import avatar from './../../assets/avatar.png'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'
import { LuAlignJustify } from 'react-icons/lu'

import { GoSearch } from 'react-icons/go'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { IoMdHeartEmpty } from 'react-icons/io'
import { CiYoutube } from 'react-icons/ci'
import { IoMdHeart } from 'react-icons/io'
import { SetStateAction, useEffect, useState } from 'react'
import PostCreateCard from '../Modal/PostCreateCard/PostCreateCard'
import { PiMessengerLogoFill, PiMessengerLogoLight } from 'react-icons/pi'
import { HiOutlineViewfinderCircle } from 'react-icons/hi2'
import { HiViewfinderCircle } from 'react-icons/hi2'
import CreateMenu from '../CreateMenu/CreateMenu'
import StoryCreateCard from '../StoryCreateCard/StoryCreateCard'
import ReelsCreateCard from '../Modal/ReelsCreateCard/ReelsCreateCard'
import SettingMenu from '../SettingMenu/SettingMenu'

interface Menu {
  name: string
  path?: string
  icon: React.ReactNode[] // Allow JSX for icon
}

const Animation = {
  open: {
    x: 0,
    width: '245px',
    transition: {
      damping: 100
    }
  },
  closed: {
    x: 0,
    width: '72px',
    transition: {
      damping: 100,
      delay: 0.1
    }
  }
}

const MenuList: Array<Menu> = [
  {
    name: 'Home',
    path: '/',
    icon: [<GoHome className='stroke-0 w-8 h-8' />, <GoHomeFill color='red' className=' w-8 h-8' />] // JSX element
  },
  {
    name: 'Search',
    icon: [<GoSearch className='stroke-0 w-8 h-8' />, <GoSearch className='stroke-1 w-8 h-8' />]
  },
  {
    name: 'Explore',
    path: '/explore',
    icon: [<HiOutlineViewfinderCircle className=' w-8 h-8' />, <HiViewfinderCircle className='stroke-1 w-8 h-8' />]
  },
  {
    name: 'Create',
    icon: [
      <IoIosAddCircleOutline className='stroke-0 w-8 h-8' />,
      <IoIosAddCircleOutline className='stroke-1 w-8 h-8' />
    ]
  },
  {
    name: 'Reels',
    path: '/reels',
    icon: [<CiYoutube className='stroke-0 w-8 h-8' />, <CiYoutube fill='black' className='stroke-1 w-8 h-8' />]
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: [<PiMessengerLogoLight className='stroke-0 w-8 h-8' />, <PiMessengerLogoFill className='stroke-0 w-8 h-8' />]
  },
  {
    name: 'Notifications',
    icon: [<IoMdHeartEmpty className='w-7 h-7 stroke-1' />, <IoMdHeart className='w-7 h-7 text-red-500' />]
  },
  {
    name: 'Profile',
    icon: [
      <img src={avatar} style={{ height: '30px', width: '30px', borderRadius: '90px' }} />,
      <img src={avatar} style={{ height: '30px', width: '30px', borderRadius: '90px', border: '2px solid black' }} />
    ]
  },
  {
    name: 'Settings',
    icon: [<LuAlignJustify size={24} />, <LuAlignJustify size={24} />]
  }
]

const LogoApp: Menu = {
  name: 'Instacloud',
  path: '/',
  icon: [<span className='material-symbols-sharp md-32'>water_drop</span>]
}

const Sidebar = ({
  isOpen,
  setIsOpen,
  activeMenu,
  setActiveMenu,
  isHaveNotification
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeMenu: string
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>
  isHaveNotification: boolean
}) => {
  const navigate = useNavigate()

  const nickName = JSON.parse(sessionStorage.getItem('user') || '{}').nickName

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [createMenuPosition, setCreateMenuPosition] = useState({ top: 0, left: 0 })
  const [settingsMenuPosition, setSettingsMenuPosition] = useState({ top: 0, left: 0 })
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [isStoryPopupOpen, setIsStoryPopupOpen] = useState(false)
  const [isReelsPopupOpen, setIsReelsPopupOpen] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const handleClickItem = ({ name, path }: Menu) => {
    if (name === 'Create') {
      const createButton = document.querySelector(`[data-menu-item="Create"]`)
      if (createButton) {
        const rect = createButton.getBoundingClientRect()
        setCreateMenuPosition({ top: rect.top, left: rect.left })
        setShowCreateMenu(true)
      }
      return
    }

    if (name === 'Settings') {
      const createButton = document.querySelector(`[data-menu-item="Settings"]`)
      if (createButton) {
        const rect = createButton.getBoundingClientRect()
        setSettingsMenuPosition({ top: rect.top, left: rect.left })
        setShowSettingsMenu(true)
      }
      return
    }

    if (name === 'Search' || name === 'Messages' || name === 'Notifications') {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
    setActiveMenu(name)

    if (name === 'Profile') {
      navigate(`/${nickName}`)
    } else if (path) {
      navigate(path)
    }
  }

  const onClose = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  const handleCreateOption = (option: 'post' | 'story' | 'reel') => {
    setShowCreateMenu(false)
    switch (option) {
      case 'post':
        setIsPopupOpen(true)
        break
      case 'story':
        setIsStoryPopupOpen(true)
        break
      case 'reel':
        setIsReelsPopupOpen(true)
        break
    }
  }

  const handleSettingsOption = (option: 'logout' | 'switch account' | 'settings' | 'your activity') => {
    setShowSettingsMenu(false)
    switch (option) {
      case 'logout':
        handleLogout()
        break
      case 'switch account':
        break
      case 'settings':
        navigate('/your_account/settings')
        break
      case 'your activity':
        navigate('/your_account/activity/interactions')
        break
    }
  }

  return (
    <>
      <motion.div
        initial={{ x: 0 }}
        variants={Animation}
        animate={isOpen ? 'open' : 'closed'}
        className={styles.sidebarContainer}
      >
        <ul>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: '100px' }}
            key={isOpen ? 'logo' : 'menuItem'} // Add unique keys for each state
          >
            {isOpen ? (
              <div className={'logo'}>Instacloud</div>
            ) : (
              <div style={{ marginBottom: '20px', marginTop: '1rem' }}>
                <MenuItem
                  activeMenu={activeMenu}
                  isOpen={isOpen}
                  name={LogoApp.name}
                  icon={LogoApp.icon}
                  onClick={() => handleClickItem(LogoApp)}
                />
              </div>
            )}
          </motion.div>
          {MenuList.slice(0, 9).map((menu) => (
            <MenuItem
              activeMenu={activeMenu}
              key={menu.name}
              isOpen={isOpen}
              name={menu.name}
              icon={menu.icon}
              onClick={() => handleClickItem(menu)}
              isHaveNotification={menu.name === 'Notifications' && isHaveNotification}
            />
          ))}
        </ul>
      </motion.div>

      <CreateMenu
        isVisible={showCreateMenu}
        onClose={() => setShowCreateMenu(false)}
        onSelectOption={handleCreateOption}
        position={createMenuPosition}
      />

      <SettingMenu
        isVisible={showSettingsMenu}
        onClose={() => setShowSettingsMenu(false)}
        onSelectOption={handleSettingsOption}
        position={settingsMenuPosition}
      />

      <PostCreateCard isVisible={isPopupOpen} onClose={onClose} />
      <StoryCreateCard isVisible={isStoryPopupOpen} onClose={() => setIsStoryPopupOpen(false)} />
      <ReelsCreateCard isVisible={isReelsPopupOpen} onClose={() => setIsReelsPopupOpen(false)} />
    </>
  )
}

const MenuItem = ({
  activeMenu,
  isOpen,
  name,
  icon,
  onClick,
  isHaveNotification
}: {
  activeMenu: string
  isOpen: boolean
  name: string
  icon: React.ReactNode[]
  onClick: () => void
  isHaveNotification?: boolean
}) => {
  return (
    <li
      data-menu-item={name}
      className={`${styles.menuItem} ${!isOpen ? 'w-[50px] h-[50px]' : 'w-[220px] h-[50px]'} ${!isOpen && styles.close} ${name === 'Settings' && 'absolute bottom-2 w-full'}`}
      onClick={onClick}
    >
      <div className={activeMenu === name ? styles.linkActive : styles.link}>
        <div
          className={`w-[50px] h-[50px] ${activeMenu === name && (name === 'Search' || name === 'Notifications') && styles.iconActive} ${styles.icon}`}
        >
          {activeMenu === name ? icon[1] : icon[0]}
        </div>
        {isOpen && name}
        {name === 'Notifications' && isHaveNotification && (
          <div className={'absolute left-11 mt-5 w-2 h-2 rounded-full bg-red-700'}></div>
        )}
      </div>
    </li>
  )
}

export default Sidebar
