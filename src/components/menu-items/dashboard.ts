// assets
import { IconDashboard } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { PERMISSION } from '../../constants'

// constant
const icons = { IconDashboard }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Báo cáo',
  type: 'group',
  premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE],
  children: [
    {
      id: ROUTES.DASHBOARD,
      title: 'Thống kê',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE]
    },
    {
      id: ROUTES.DASHBOARD_ORDER,
      title: 'Đơn hàng',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.DASHBOARD_ORDER}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE]
    },
    {
      id: ROUTES.DASHBOARD_ORDER_SALE,
      title: 'Doanh thu (Sale)',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.DASHBOARD_ORDER_SALE}`,
      icon: icons.IconDashboard,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE]
    }
  ]
}

export default dashboard
