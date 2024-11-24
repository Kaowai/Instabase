import styles from './sidebar.module.css'
import avatar from './../../assets/avatar.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoHome } from 'react-icons/go'
import { GoHomeFill } from 'react-icons/go'

import { GoSearch } from 'react-icons/go'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { RiMessengerLine } from 'react-icons/ri'
import { RiMessengerFill } from 'react-icons/ri'
import { IoMdHeartEmpty } from 'react-icons/io'
import { FaWpexplorer } from 'react-icons/fa'
import { CiYoutube } from 'react-icons/ci'
import { IoMdHeart } from 'react-icons/io'

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
    icon: [<FaWpexplorer className='stroke-0 w-8 h-8' />, <FaWpexplorer className='stroke-1 w-8 h-8' />]
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
    icon: [<CiYoutube className='stroke-0 w-8 h-8' />, <CiYoutube className='stroke-1 w-8 h-8' />]
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: [<RiMessengerLine className='stroke-0 w-8 h-8' />, <RiMessengerFill className='stroke-0 w-8 h-8' />]
  },
  {
    name: 'Notifications',
    icon: [<IoMdHeartEmpty className='w-7 h-7 stroke-1' />, <IoMdHeart className='w-7 h-7 text-red-500' />]
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: [
      <img src={avatar} style={{ height: '30px', width: '30px', borderRadius: '90px' }} />,
      <img src={avatar} style={{ height: '30px', width: '30px', borderRadius: '90px', border: '2px solid black' }} />
    ]
  }
]

const LogoApp: Menu = {
  name: 'Instacloud',
  path: '/',
  icon: [<span className='material-symbols-sharp md-32'>water_drop</span>]
}

const Sidebar = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [activeMenu, setActiveMenu] = useState<string>('Home')
  const navigate = useNavigate()

  const handleClickItem = ({ name, path }: Menu) => {
    if (name === 'Search' || name === 'Messages' || name === 'Notifications') {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
    setActiveMenu(name)
    if (path) {
      navigate(path)
    }
  }

  useEffect(() => {
    console.log(activeMenu)
  }, [activeMenu])

  return (
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
            <div className={styles.logo}>Instacloud</div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
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
        {MenuList.map((menu) => (
          <MenuItem
            activeMenu={activeMenu}
            key={menu.name}
            isOpen={isOpen}
            name={menu.name}
            icon={menu.icon}
            onClick={() => handleClickItem(menu)}
          />
        ))}
      </ul>
    </motion.div>
  )
}

const MenuItem = ({
  activeMenu,
  isOpen,
  name,
  icon,
  onClick
}: {
  activeMenu: string
  isOpen: boolean
  name: string
  icon: React.ReactNode[]
  onClick: () => void
}) => {
  return (
    <li
      className={`${styles.menuItem} ${!isOpen ? 'w-[50px] h-[50px]' : 'w-full'} ${!isOpen && styles.close}`}
      onClick={onClick}
    >
      <div className={activeMenu === name ? styles.linkActive : styles.link}>
        <div
          className={`w-[50px] h-[50px] ${activeMenu === name && (name === 'Search' || name === 'Notifications') && styles.iconActive} ${styles.icon}`}
        >
          {activeMenu === name ? icon[1] : icon[0]}
        </div>
        {isOpen && name}
      </div>
    </li>
  )
}

export default Sidebar
