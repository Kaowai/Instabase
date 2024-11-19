import styles from './sidebar.module.css'
import avatar from './../../assets/avatar.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Menu {
  name: string
  path: string
  icon: React.ReactNode[] // Allow JSX for icon
}

const Animation = {
  open: {
    x: 0,
    width: '17rem',
    transition: {
      damping: 100
    }
  },
  closed: {
    x: 0,
    width: '5rem',
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
    icon: [
      <span className='material-symbols-sharp md-32'>home</span>,
      <span className='material-symbols-sharp filled md-32'>home</span>
    ] // JSX element
  },
  {
    name: 'Search',
    path: '/',
    icon: [
      <span className='material-symbols-sharp md-32'>search</span>,
      <span className='material-symbols-sharp filled md-32 weight'>search</span>
    ]
  },
  {
    name: 'Explore',
    path: '/explore',
    icon: [
      <span className='material-symbols-sharp md-32'>explore</span>,
      <span className='material-symbols-sharp filled md-32'>explore</span>
    ]
  },
  {
    name: 'Create',
    path: '/',
    icon: [
      <span className='material-symbols-sharp md-32'>add_circle</span>,
      <span className='material-symbols-sharp filled md-32'>add_circle</span>
    ]
  },
  {
    name: 'Reels',
    path: '/reels',
    icon: [
      <span className='material-symbols-sharp md-32'>play_circle</span>,
      <span className='material-symbols-sharp filled md-32'>play_circle</span>
    ]
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: [
      <span className='material-symbols-sharp md-32'>maps_ugc</span>,
      <span className='material-symbols-sharp filled md-32'>maps_ugc</span>
    ]
  },
  {
    name: 'Notifications',
    path: '/',
    icon: [
      <span className='material-symbols-sharp md-32'>favorite</span>,
      <span className='material-symbols-sharp filled md-32'>favorite</span>
    ]
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
    navigate(path)
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
          transition={{ ease: 'easeOut', duration: 1 }}
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
    <li className={`${styles.menuItem} ${!isOpen && styles.close}`} onClick={onClick}>
      <div className={activeMenu === name ? styles.linkActive : styles.link}>
        <div
          className={`${activeMenu === name && (name === 'Search' || name === 'Notifications') && styles.iconActive} ${styles.icon}`}
        >
          {activeMenu === name ? icon[1] : icon[0]}
        </div>
        {isOpen && name}
      </div>
    </li>
  )
}

export default Sidebar
