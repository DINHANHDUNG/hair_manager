// assets
import { IconDashboard } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = { IconDashboard }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Báo cáo',
  type: 'group',
  children: [
    {
      id: ROUTES.DASHBOARD,
      title: 'Thống kê',
      type: 'item',
      url: `/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`,
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
}

export default dashboard
