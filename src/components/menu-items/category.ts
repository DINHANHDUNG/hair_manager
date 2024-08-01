// assets
import { IconCategory } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconCategory
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const categorys = {
  id: 'category-manager',
  title: 'Quản lý danh mục',
  // caption: 'Danh mục',
  type: 'group',
  children: [
    {
      id: 'list-category',
      title: 'Danh mục',
      type: 'collapse',
      icon: icons.IconCategory,

      children: [
        {
          id: 'category-persion',
          title: 'Nhân viên',
          type: 'item',
          breadcrumbs: true,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}`
          // target: true
        }
      ]
    }
  ]
}

export default categorys
