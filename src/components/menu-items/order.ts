// assets
import { IconShoppingCartBolt, IconAB2, IconShoppingCartX } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { Perm_Order_Cancel_View, Perm_Order_View } from '../../help/permission'

// constant
const icons = { IconShoppingCartBolt, IconAB2, IconShoppingCartX }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Quản lý đơn hàng',
  type: 'group',
  premissions: Perm_Order_View,
  children: [
    {
      id: ROUTES.ORDER,
      title: 'Danh sách đơn',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.DEFAULT}`,
      icon: icons.IconShoppingCartBolt,
      breadcrumbs: false,
      premissions: Perm_Order_View
    },
    {
      id: ROUTES.ORDER_REQUEST,
      title: 'Yêu cầu sửa',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.ORDER_REQUEST}`,
      icon: icons.IconAB2,
      breadcrumbs: false,
      premissions: Perm_Order_View
    },
    {
      id: ROUTES.ORDER_CANCEL,
      title: 'Danh sách hủy',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.ORDER_CANCEL}`,
      icon: icons.IconShoppingCartX,
      breadcrumbs: false,
      premissions: Perm_Order_Cancel_View
    }
  ]
}

export default order
