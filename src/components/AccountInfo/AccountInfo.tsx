import React, { useEffect, useState } from 'react'
import styles from './AccountInfo.module.css'
import { User } from '../../models/User/User.model'
import { RenderMedia } from '../../utils/renderImage'
import { followUserSerice, unFollowUserSerice } from '../../apis/userService'

interface UserInfo {
  user: User
  isOwner: boolean
  isFollow?: boolean
}

const AccountInfo = ({ isOwner, user }: UserInfo): React.JSX.Element => {
  const [isFollow, setIsFollow] = useState(false)
  const handleFollow = () => {
    const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
    if (isOwner) {
      // open popup login
    } else {
      // follow user
      if (isFollow) {
        unFollowUserSerice(userId, user?.userId)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        followUserSerice(userId, user?.userId)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
      setIsFollow(!isFollow)
    }
  }
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.containerImage}>
          <RenderMedia mediaUrl={user?.avatar} cssOverride={'w-12 h-12 rounded-full'} />
        </div>
        <div className={styles.content}>
          <span className={styles.nameAccount}>{user?.nickName}</span>
          <span className={styles.infoAccount}>{user?.fullName}</span>
        </div>
      </div>
      <button onClick={handleFollow}>
        <span
          className={`${isOwner ? 'text-blue-500' : isFollow ? 'text-grey-color2' : 'text-blue-500'} hover:opacity-40 cursor-pointer text-sm font-semibold`}
        >
          {isOwner ? 'Switch' : isFollow ? 'Following' : 'Follow'}
        </span>
      </button>
    </div>
  )
}

export default AccountInfo
