import Layout from '../components/Layout/Layout'
import Home from './Home/Home'
import Explore from './Explore/Explore'
import Reels from './Reels/Reels'
import Message from './Message/Message'
import Personal from './Personal/Personal'
import Story from './Story/Story'
import PostDetail from './PostDetail/PostDetail'
import Settings from './Settings/Settings'
import SettingAccount from './SettingAccount/SettingAccount'
import ActivityAccount from '../components/ActivityAccount/ActivityAccount'
import ArchiveStory from './ArchiveStory/ArchiveStory'

interface Props {
  children: React.ReactNode
}
interface Route {
  path: string
  component: () => React.JSX.Element
  layout?: ({ children }: Props) => React.ReactNode
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
    path: '/messages/*',
    component: Message,
    layout: Layout
  },
  {
    path: '/:nickName',
    component: Personal,
    layout: Layout
  },
  {
    path: '/:nickName/saved',
    component: Explore,
    layout: Layout
  },
  {
    path: '/stories/:id',
    component: Story
  },
  {
    path: '/post/:id',
    component: PostDetail,
    layout: Layout
  },
  {
    path: '/your_account/settings',
    component: SettingAccount,
    layout: Layout
  },
  {
    path: '/your_account/activity/*',
    component: ActivityAccount,
    layout: Layout
  },
  {
    path: '/settings',
    component: Settings,
    layout: Layout
  },
  {
    path: '/stories/archive',
    component: ArchiveStory,
    layout: Layout
  }
]

export { publicRoutes }
