// assets
import { IconCategory, IconUsersGroup, IconCoinBitcoin } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconCategory,
  IconUsersGroup,
  IconCoinBitcoin
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
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}`
          // target: true
        },
        {
          id: 'category-worker',
          title: 'Công nhân',
          type: 'item',
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.WORKER}`
          // target: true
        },
        {
          id: 'category-partner',
          title: 'Đối tác',
          type: 'item',
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.PARTER}`
          // target: true
        },
        {
          id: 'category-company',
          title: 'Công ty',
          type: 'item',
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.COMPANY}`
          // target: true
        }
      ]
    },
    {
      id: 'list-salary',
      title: 'Lương thưởng',
      type: 'collapse',
      icon: icons.IconCoinBitcoin,

      children: [
        {
          id: 'category-salary-advance',
          title: 'Ứng lương',
          type: 'item',
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_ADVANCE}`
          // target: true
        },
        {
          id: 'category-salary-pay',
          title: 'Thanh toán lương',
          type: 'item',
          breadcrumbs: false,
          url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_PAY}`
          // target: true
        }
      ]
    }
  ]
}

export default categorys
