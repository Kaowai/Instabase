import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import { publicRoutes } from './pages/routes'
import React from 'react'
import ProtectedRoute, { PrivateRoute } from './pages/ProtectedRoute'
import Login from './pages/Login/Login'
import path from 'path'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home'

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {publicRoutes.map((route, index) => {
          const Layout = route?.layout || React.Fragment
          const Page = route.component
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          )
        })}
      </Route>
      <Route element={<Login />} path={'/login'}></Route>
      <Route element={<Signup />} path={'/signup'}></Route>
    </Routes>
  )
}

export default App
