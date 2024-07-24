// assets
import { IconCategory } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconCategory
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const categorys = {
  id: 'category-all',
  title: 'Category',
  caption: 'Category Caption',
  type: 'group',
  children: [
    {
      id: 'list-category',
      title: 'List category',
      type: 'collapse',
      icon: icons.IconCategory,

      children: [
        {
          id: 'category-persion',
          title: 'category-persion',
          type: 'item',
          url: ROUTES.SAMPLE_PAGE
          // target: true
        },
        {
          id: 'category-2',
          title: 'category-2',
          type: 'item',
          url: ROUTES.DASHBOARD + '/' + ROUTES.DEFAULT
        }
      ]
    }
  ]
}

export default categorys
