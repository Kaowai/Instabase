import styles from './AccountSearch.module.css'
import avatar from './../../assets/avatar.png'
import { UserResponse } from '../../models/User/User.model'

interface AccountSearchProps {
  user: UserResponse
  onClick?: () => void
}

const AccountSearch = ({ user, onClick }: AccountSearchProps): React.JSX.Element => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div>
        <div className={styles.containerImage}>
          <div className={``}>{<img className={styles.imageSearch} src={avatar} alt='' />}</div>
        </div>
        <div className={styles.content}>
          <span className={styles.nameAccount}>{user?.nickName}</span>
          <span className={styles.infoAccount}>{user?.fullName}</span>
        </div>
      </div>
    </div>
  )
}

export default AccountSearch
