import { useState } from 'react'
import Sidebar from '../Sidebar/sidebar'
import styles from './Layout.module.css'

interface Props {
  children?: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className={`${styles.content} ${isOpen && styles.open}`}>{children}</div>
    </div>
  )
}

export default Layout
