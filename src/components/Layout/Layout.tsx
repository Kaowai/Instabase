import React, { useState, useEffect, useRef } from 'react'
import styles from './Layout.module.css'
import Sidebar from '../Sidebar/Sidebar'
import SearchLayout from '../SearchLayout/SearchLayout'
import NotificationLayout from '../NotificationLayout/NotificationLayout'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { disconnectSignalR, getSignalRConnection, initializeSignalR } from '../../redux/signalRSlice'
import { RootState } from '../../redux/store'
import { useDispatch } from 'react-redux'
import * as signalR from '@microsoft/signalr'
import { getNotification } from '../../apis/notificationService'
import { NotificationModel } from '../../models/notification.model'

interface Props {
  children?: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [activeMenu, setActiveMenu] = useState<string>('Home')
  const location = useLocation()
  const searchBarRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const signalRState = useSelector((state: RootState) => state.signalR)
  const { isConnected } = signalRState
  const [isHaveNotification, setIsHaveNotification] = useState(false)
  const [notificationList, setNotificationList] = useState<Array<NotificationModel>>([])
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId

  useEffect(() => {
    const initConnection = async () => {
      await dispatch(initializeSignalR('http://localhost:32681/notificationHub'))
    }
    initConnection()

    return () => {
      dispatch(disconnectSignalR())
    }
  }, [dispatch])

  useEffect(() => {
    getNotification(userId)
      .then((res) => setNotificationList(res))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const connection = getSignalRConnection()
    if (connection?.state === signalR.HubConnectionState.Connected) {
      // Remove any existing handlers first to prevent duplicates
      connection.off('ReceiveNotification')

      connection.on('ReceiveNotification', async (res: string) => {
        try {
          const userId = JSON.parse(sessionStorage.getItem('user') as string).userId
          const resJson = JSON.parse(res)
          console.log('Received notification:', resJson)

          if (resJson?.EventType !== 'NewMessage') {
            const userReceive = resJson.ListUserReceiveMessage

            const id = userReceive.find((_id: string) => _id === userId)
            console.log('receive: ', userReceive)
            console.log('id: ', userId)
            console.log('id invoke: ', id)
            if (id) {
              setIsHaveNotification(true)
              setNotificationList((pre) => [resJson, ...(pre || [])])
            }
          }
        } catch (error) {
          console.error('Error handling notification:', error)
        }
      })
    }
  }, [isConnected])

  // Close SearchLayout if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        if (activeMenu === 'Search' || activeMenu === 'Notifications') {
          setActiveMenu('Home')
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeMenu])

  useEffect(() => {
    const childRoute = location.pathname.split('/')[1]
    const currentNickName = JSON.parse(sessionStorage.getItem('user') as string).nickName

    if (childRoute === currentNickName) {
      setActiveMenu('Profile')
    }
    if (childRoute === 'messages') {
      setActiveMenu('Messages')
      setIsOpen(false)
      return
    }
    setIsOpen(true)
  }, [location])

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <Sidebar
          isHaveNotification={isHaveNotification}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>

      {/* SearchLayout */}
      {(activeMenu === 'Search' || activeMenu === 'Notifications') && (
        <div ref={searchBarRef} className={`${styles.searchBar} ${isOpen ? styles.hidden : styles.visible}`}>
          {activeMenu === 'Search' && <SearchLayout setIsOpen={setIsOpen} setActiveMenu={setActiveMenu} />}
          {activeMenu === 'Notifications' && <NotificationLayout notificationList={notificationList} />}
        </div>
      )}

      {/* Content */}
      <div className={`${styles.contentContainer} ${isOpen && styles.open}`}>
        <div className={`${styles.content}`}>{children}</div>
      </div>
    </div>
  )
}

export default Layout
