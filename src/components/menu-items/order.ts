// assets
import { IconShoppingCartBolt, IconAB2 } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { PERMISSION } from '../../constants'

// constant
const icons = { IconShoppingCartBolt, IconAB2 }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
  id: 'order',
  title: 'Quản lý đơn hàng',
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
      id: ROUTES.ORDER,
      title: 'Danh sách đơn',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.DEFAULT}`,
      icon: icons.IconShoppingCartBolt,
      breadcrumbs: false,
      premissions: [
        PERMISSION.ADMIN,
        PERMISSION.GIAMDOC,
        PERMISSION.HCNS,
        PERMISSION.KETOAN,
        PERMISSION.TUYENDUNG,
        PERMISSION.SALE
      ],
    },
    {
      id: ROUTES.ORDER_REQUEST,
      title: 'Yêu cầu sửa',
      type: 'item',
      url: `/${ROUTES.ORDER}/${ROUTES.ORDER_REQUEST}`,
      icon: icons.IconAB2,
      breadcrumbs: false,
      premissions: [
        PERMISSION.ADMIN,
        PERMISSION.GIAMDOC,
        PERMISSION.HCNS,
        PERMISSION.KETOAN,
        PERMISSION.TUYENDUNG,
        PERMISSION.SALE
      ],
    }
  ]
}

export default order
