import { Route, Routes } from 'react-router-dom'
import './App.css'
import { publicRoutes } from './pages/routes'

function App(): JSX.Element {
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Layout = route.layout
        const Page = route.component
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page></Page>
              </Layout>
            }
          />
        )
      })}
    </Routes>
  )
}

export default App
