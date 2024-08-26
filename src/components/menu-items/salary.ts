// assets
import {
  IconCash,
  IconCashBanknote,
  IconCategory,
  IconCoinBitcoin,
  IconReceipt,
  IconUsersGroup
} from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = {
  IconCategory,
  IconUsersGroup,
  IconCoinBitcoin,
  IconCash,
  IconReceipt,
  IconCashBanknote
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const salarys = {
  id: 'salary-manager',
  title: 'Quản lý lương thưởng',
  type: 'group',
  children: [
    {
      id: 'salary-advance',
      title: 'Ứng lương',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_ADVANCE}`,
      icon: icons.IconCash
    },
    {
      id: 'salary-refund',
      title: 'Hoàn ứng',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_REFUND}`,
      icon: icons.IconCashBanknote
    },
    {
      id: 'salary-pay',
      title: 'Thanh toán lương',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_PAY}`,
      icon: icons.IconReceipt
    }
  ]
}

export default salarys
