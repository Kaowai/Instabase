import React, { useState } from 'react'
import { updateUserInfo, updateUserPassword } from '../../apis/userService'
import { uploadImage } from '../../utils/uploadImage'
import { User } from '../../models/User/User.model'

const Settings = () => {
  const [user, setUser] = useState<User>(JSON.parse(sessionStorage.getItem('user') || '{}'))
  const [avatar, setAvatar] = useState<File | null>(null)
  const [username, setUsername] = useState(user.nickName || '')
  const [fullName, setFullName] = useState(user.fullName || '')
  const [password, setPassword] = useState('')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0])
    }
  }

  const handleUpdateInfo = async () => {
    try {
      let avatarUrl = user.avatar
      if (avatar) {
        avatarUrl = await uploadImage(avatar)
      }
      const updatedUser = await updateUserInfo({
        userId: user.userId,
        username,
        fullName,
        avatar: avatarUrl
      })
      setUser(updatedUser)
      sessionStorage.setItem('user', JSON.stringify(updatedUser))
      alert('User information updated successfully!')
    } catch (error) {
      console.error('Error updating user information:', error)
    }
  }

  const handleChangePassword = async () => {
    try {
      await updateUserPassword(user.userId, password)
      alert('Password updated successfully!')
    } catch (error) {
      console.error('Error updating password:', error)
    }
  }

  return (
    <div className='settings-container'>
      <h1>Settings</h1>
      <div className='settings-section'>
        <h2>Update Avatar</h2>
        <input type='file' accept='image/*' onChange={handleAvatarChange} />
      </div>
      <div className='settings-section'>
        <h2>Update Information</h2>
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Full Name' />
        <button onClick={handleUpdateInfo}>Update Info</button>
      </div>
      <div className='settings-section'>
        <h2>Change Password</h2>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='New Password'
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  )
}

export default Settings
