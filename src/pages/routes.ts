import Layout from '../components/Layout/Layout'
import Home from './Home/Home'
import Explore from './Explore/Explore'
import Reels from './Reels/Reels'
import Message from './Message/Message'
import Personal from './Personal/Personal'

interface Props {
  children: React.ReactNode
}
interface Route {
  path: string
  component: () => React.JSX.Element
  layout: ({ children }: Props) => React.ReactNode
}

const publicRoutes: Route[] = [
  {
    path: '/',
    component: Home,
    layout: Layout
  },
  {
    path: '/explore',
    component: Explore,
    layout: Layout
  },
  {
    path: '/reels',
    component: Reels,
    layout: Layout
  },
  {
    path: '/messages',
    component: Message,
    layout: Layout
  },
  {
    path: '/profile',
    component: Personal,
    layout: Layout
  }
]

export { publicRoutes }
