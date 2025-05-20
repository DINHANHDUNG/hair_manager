// assets
import {
  IconBriefcase,
  IconBuilding,
  IconCategory,
  IconCoinBitcoin,
  IconUser,
  IconUsersGroup
} from '@tabler/icons-react'
import { Perm_Account_View, Perm_Category_View, Perm_Customer_View, Perm_Staff_View } from '../../help/permission'
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
  title: 'Danh mục',
  type: 'group',
  premissions: Perm_Category_View,
  children: [
    {
      id: 'category-persion',
      title: 'Nhân viên',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}`,
      icon: icons.IconUser,
      premissions: Perm_Staff_View
    },
    {
      id: 'category-worker',
      title: 'Tài khoản',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.ACCOUNT_MANAGER}`,
      icon: icons.IconBriefcase,
      premissions: Perm_Account_View
    },
    {
      id: 'category-customer',
      title: 'Khách hàng',
      type: 'item',
      breadcrumbs: false,
      url: `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.CUSTOMER_MANAGER}`,
      icon: icons.IconUsersGroup,
      premissions: Perm_Customer_View
    }
    // {
    //   id: 'category-customer',
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
    //
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
    //
    //   ]
    // }
  ]
}

export default categorys
