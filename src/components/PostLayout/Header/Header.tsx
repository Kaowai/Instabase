import React from 'react'
import styles from './Header.module.css'
import vtv24 from '../../../assets/vtv24.jpg'
const Header = ({ isSeen }: { isSeen: boolean }): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.imageAndName}>
        <div className={`${styles.avatar_wrapper} ${isSeen ? styles.seen_story : styles.not_seen_story}`}>
          <div className={styles.wrapper}>
            <img className={styles.imageUser} src={vtv24} alt='' />
          </div>
        </div>
        <div className={styles.name}>
          <span className={styles.nameAccount}>vtv24news</span> • 1h
        </div>
      </div>
      <button>
        <span className='material-symbols-sharp md-24'>more_horiz</span>
      </button>
    </div>
  )
}

export default Header
