// assets
import { IconShoppingCartBolt, IconAB2, IconShoppingCartX } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { PERMISSION } from '../../constants'

// constant
const icons = { IconShoppingCartBolt, IconAB2, IconShoppingCartX }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Quản lý đơn hàng',
  type: 'group',
  premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE, PERMISSION.QUANLY],
  children: [
    {
      id: ROUTES.ORDER,
      title: 'Danh sách đơn',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.DEFAULT}`,
      icon: icons.IconShoppingCartBolt,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE, PERMISSION.QUANLY]
    },
    {
      id: ROUTES.ORDER_REQUEST,
      title: 'Yêu cầu sửa',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.ORDER_REQUEST}`,
      icon: icons.IconAB2,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE, PERMISSION.QUANLY]
    },
    {
      id: ROUTES.ORDER_CANCEL,
      title: 'Danh sách hủy',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.ORDER_CANCEL}`,
      icon: icons.IconShoppingCartX,
      breadcrumbs: false,
      premissions: [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE, PERMISSION.QUANLY]
    }
  ]
}

export default order
