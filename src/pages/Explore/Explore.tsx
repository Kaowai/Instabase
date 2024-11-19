import { useState } from 'react'
import PostItem from '../../components/PostItem/PostItem'
import styles from './Explore.module.css'
import PostPopup from '../../components/Modal/PostCardModal/PostPopup'
const Explore = (): React.JSX.Element => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const onClose = () => {
    setIsPopupOpen(false)
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
        <PostItem onClick={() => setIsPopupOpen(true)}></PostItem>
      </div>
      <PostPopup isVisible={isPopupOpen} onClose={onClose} />
    </div>
  )
}

export default Explore
