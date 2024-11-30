import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// interface ProtectedRouteProps {
//   children: React.ReactNode
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
//   useEffect(() => {
//     const userInfo = localStorage.getItem('userInfo')
//     setIsAuthenticated(!!userInfo)
//     console.log(isAuthenticated)
//   }, [])

//   if (isAuthenticated === null) {
//     // Chỉ hiển thị màn hình chờ khi kiểm tra trạng thái xác thực
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <p>Loading...</p>
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return <Navigate to='/login' replace />
//   }

//   return <>{children}</>
// }

export const PrivateRoute: React.FC = () => {
  const userInfo = localStorage.getItem('userId')
  console.log(userInfo)
  return userInfo ? <Outlet /> : <Navigate to='/login' />
}
