// assets
import { IconShoppingCartBolt } from '@tabler/icons-react'

// constant
const icons = { IconShoppingCartBolt }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Đơn hàng',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Danh sách đơn hàng',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconShoppingCartBolt,
      breadcrumbs: false
    }
  ]
}

export default dashboard
