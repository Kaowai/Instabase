import { Route, Routes } from 'react-router-dom'
import './App.css'
import { publicRoutes } from './pages/routes'
import React from 'react'
import { PrivateRoute } from './pages/ProtectedRoute'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { Provider } from 'react-redux'
import store from './redux/store'

function App(): JSX.Element {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
