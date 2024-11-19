import React from 'react'
import styles from './AccountInfo.module.css'

interface UserInfo {
  nameAccount: string
  nameUser: string
  isOwner: boolean
  avatar: string
  isHaveStory: boolean
}

const AccountInfo = ({ nameAccount, nameUser, isOwner, isHaveStory, avatar }: UserInfo): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.containerImage}>
          <img className={styles.imageSearch} src={avatar} alt='' />
        </div>
        <div className={styles.content}>
          <span className={styles.nameAccount}>{nameAccount}</span>
          <span className={styles.infoAccount}>{nameUser}</span>
        </div>
      </div>
      <button>
        <span>{isOwner ? 'Switch' : 'Follow'}</span>
      </button>
    </div>
  )
}

export default AccountInfo
