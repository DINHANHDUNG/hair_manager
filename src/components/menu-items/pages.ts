// assets
import { IconKey } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconKey
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          url: ROUTES.LOGIN,
          target: true
        }
        // {
        //   id: 'register3',
        //   title: 'Register',
        //   type: 'item',
        //   url: '/pages/register/register3',
        //   target: true
        // }
      ]
    }
  ]
}

export default pages
