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
import { PERMISSION } from '../../constants'

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
  title: 'Danh mục',
  type: 'group',
  premissions: [
    PERMISSION.ADMIN,
    PERMISSION.GIAMDOC,
    PERMISSION.HCNS,
    PERMISSION.KETOAN,
    PERMISSION.SALE,
    PERMISSION.TUYENDUNG
  ],
  children: [
    {
      id: 'category-persion',
      title: 'Nhân viên',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}`,
      icon: icons.IconUser,
      premissions: [PERMISSION.ADMIN, PERMISSION.GIAMDOC, PERMISSION.HCNS, PERMISSION.KETOAN]
    },
    {
      id: 'category-worker',
      title: 'Tài khoản',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.ACCOUNT_MANAGER}`,
      icon: icons.IconBriefcase,
      premissions: [
        PERMISSION.ADMIN,
        PERMISSION.GIAMDOC,
        PERMISSION.HCNS,
        PERMISSION.KETOAN,
        PERMISSION.SALE,
        PERMISSION.TUYENDUNG
      ]
    },
    {
      id: 'category-customer',
      title: 'Khách hàng',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.CUSTOMER_MANAGER}`,
      icon: icons.IconUsersGroup,
      premissions: [
        PERMISSION.ADMIN,
        PERMISSION.GIAMDOC,
        PERMISSION.HCNS,
        PERMISSION.KETOAN,
        PERMISSION.SALE,
        PERMISSION.TUYENDUNG
      ]
    },
    // {
    //   id: 'category-partner',
    //   title: 'Vender',
    //   type: 'item',
    //   breadcrumbs: false,
    //   url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.PARTER}`,
    //   icon: icons.IconUsersGroup,
    //   premissions: [
    //     PERMISSION.ADMIN,
    //     PERMISSION.GIAMDOC,
    //     PERMISSION.HCNS,
    //     PERMISSION.KETOAN,
    //     PERMISSION.SALE,
    //     PERMISSION.TUYENDUNG
    //   ]
    // },
    // {
    //   id: 'category-company',
    //   title: 'Công ty',
    //   type: 'item',
    //   breadcrumbs: false,
    //   url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.COMPANY}`,
    //   icon: icons.IconBuilding,
    //   premissions: [
    //     PERMISSION.ADMIN,
    //     PERMISSION.GIAMDOC,
    //     PERMISSION.HCNS,
    //     PERMISSION.KETOAN,
    //     PERMISSION.SALE,
    //     PERMISSION.TUYENDUNG
    //   ]
    // }
  ]
}

export default categorys
