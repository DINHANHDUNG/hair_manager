// assets
import {
  IconCategory,
  IconUsersGroup,
  IconCoinBitcoin,
  IconBuilding,
  IconUser,
  IconBriefcase
} from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconCategory,
  IconUsersGroup,
  IconCoinBitcoin,
  IconBuilding,
  IconUser,
  IconBriefcase
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const categorys = {
  id: 'category-manager',
  title: 'Quản lý danh mục',
  type: 'group',
  children: [
    {
      id: 'category-persion',
      title: 'Nhân viên',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}`,
      icon: icons.IconUser
    },
    {
      id: 'category-worker',
      title: 'Công nhân',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.WORKER}`,
      icon: icons.IconBriefcase
    },
    {
      id: 'category-partner',
      title: 'Đối tác',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.PARTER}`,
      icon: icons.IconUsersGroup
    },
    {
      id: 'category-company',
      title: 'Công ty',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.COMPANY}`,
      icon: icons.IconBuilding
    }
  ]
}

export default categorys
