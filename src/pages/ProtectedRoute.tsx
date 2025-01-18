import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute: React.FC = () => {
  const userInfo = sessionStorage.getItem('user')
  return userInfo ? <Outlet /> : <Navigate to='/login' />
}
