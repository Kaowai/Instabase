import Notification from '../Notification/Notification'
import styles from './NotificationLayout.module.css'
const NotificationLayout = () => {
  return (
    <div className={styles.container}>
      <section>
        <h3 className='text-2xl font-bold'>Notifications</h3>
      </section>
      <span className={styles.divideVertical}></span>
      <section className={'px-5'}>
        <div>
          <span className='font-semibold text-black text-lg'>Earlier</span>
        </div>
        <div className={'flex flex-col px-1'}>
          <Notification />
          <Notification />
          <Notification />
        </div>
      </section>
    </div>
  )
}

export default NotificationLayout
