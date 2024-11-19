import { useState } from 'react'
import styles from './Layout.module.css'
import Sidebar from '../Sidebar/Sidebar'
import { motion } from 'framer-motion'
import SearchLayout from '../SearchLayout/SearchLayout'
interface Props {
  children?: React.ReactNode
}

const Animation = {
  open: {
    x: 0,
    width: '28rem',
    display: 'block',
    transition: {
      damping: 100
    }
  },
  closed: {
    x: 0,
    width: '0rem',
    display: 'none',
    transition: {
      damping: 100
    }
  }
}

const Layout = ({ children }: Props): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <motion.div
        initial={{ x: 0 }}
        variants={Animation}
        animate={isOpen ? 'closed' : 'open'}
        className={`${styles.searchBar}`}
      >
        <SearchLayout />
      </motion.div>
      <div className={`${styles.content} ${isOpen && styles.open}`}>{children}</div>
    </div>
  )
}

export default Layout
