import { useState, useEffect, useRef } from 'react'
import styles from './Layout.module.css'
import Sidebar from '../Sidebar/Sidebar'
import SearchLayout from '../SearchLayout/SearchLayout'

interface Props {
  children?: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const searchLayoutRef = useRef<HTMLDivElement>(null)

  // Close SearchLayout if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchLayoutRef.current && !searchLayoutRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* SearchLayout */}

      <div className={`${styles.searchBar} ${isOpen ? styles.hidden : styles.visible}`}>
        <SearchLayout />
      </div>

      {/* Content */}
      <div className={`${styles.contentContainer} ${isOpen && styles.open}`}>
        <div className={styles.space}>a</div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default Layout
