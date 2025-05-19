// assets
import { IconDashboard } from '@tabler/icons-react'
import {
  Perm_DASHBOARD_ALL_View,
  Perm_DASHBOARD_Menu_View,
  Perm_DASHBOARD_ORDER_SALE_View,
  Perm_DASHBOARD_ORDER_View
} from '../../help/permission'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = { IconDashboard }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Báo cáo',
  type: 'group',
  premissions: Perm_DASHBOARD_Menu_View,
  children: [
    {
      id: ROUTES.DASHBOARD,
      title: 'Thống kê',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: Perm_DASHBOARD_ALL_View
    },
    {
      id: ROUTES.DASHBOARD_ORDER,
      title: 'Đơn hàng',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.DASHBOARD_ORDER}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: Perm_DASHBOARD_ORDER_View
    },
    {
      id: ROUTES.DASHBOARD_ORDER_SALE,
      title: 'Doanh thu (Sale)',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.DASHBOARD_ORDER_SALE}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: Perm_DASHBOARD_ORDER_SALE_View
    }
  ]
}

export default dashboard
