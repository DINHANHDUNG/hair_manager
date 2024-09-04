// assets
import {
  IconCash,
  IconCashBanknote,
  IconCategory,
  IconCoinBitcoin,
  IconReceipt,
  IconUsersGroup,
  IconUserPentagon
} from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { PERMISSION } from '../../constants'

// constant
const icons = {
  IconCategory,
  IconUsersGroup,
  IconCoinBitcoin,
  IconCash,
  IconReceipt,
  IconCashBanknote,
  IconUserPentagon
}

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const salarys = {
  id: 'salary-manager',
  title: 'Lương thưởng',
  type: 'group',
  premissions: [
    PERMISSION.ADMIN,
    PERMISSION.GIAMDOC,
    PERMISSION.HCNS,
    PERMISSION.KETOAN,
    PERMISSION.TUYENDUNG,
    PERMISSION.SALE
  ],
  children: [
    {
      id: 'salary-advance',
      title: 'Ứng lương',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_ADVANCE}`,
      icon: icons.IconCash,
      premissions: [
        PERMISSION.ADMIN,
        PERMISSION.GIAMDOC,
        PERMISSION.HCNS,
        PERMISSION.KETOAN,
        PERMISSION.TUYENDUNG,
        PERMISSION.SALE
      ]
    },
    {
      id: 'salary-refund',
      title: 'Hoàn ứng',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_REFUND}`,
      icon: icons.IconCashBanknote,
      premissions: [PERMISSION.ADMIN, PERMISSION.GIAMDOC, PERMISSION.HCNS, PERMISSION.KETOAN]
    },
    {
      id: 'salary-pay-staff',
      title: 'Thanh toán lương (NV)',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_PAY_STAFF}`,
      icon: icons.IconUserPentagon,
      premissions: [PERMISSION.ADMIN, PERMISSION.GIAMDOC, PERMISSION.KETOAN]
    },
    {
      id: 'salary-pay-employee',
      title: 'Thanh toán lương (CN)',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.SALARY_PAY_EMPLOYEE}`,
      icon: icons.IconUsersGroup,
      premissions: [PERMISSION.ADMIN, PERMISSION.GIAMDOC, PERMISSION.KETOAN]
    }
  ]
}

export default salarys
