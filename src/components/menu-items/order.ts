// assets
import { IconShoppingCartBolt } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = { IconShoppingCartBolt }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Đơn hàng',
  type: 'group',
  children: [
    {
      id: ROUTES.ORDER,
      title: 'Danh sách đơn hàng',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.DEFAULT}`,
      icon: icons.IconShoppingCartBolt,
      breadcrumbs: true
    }
  ]
}

export default order
