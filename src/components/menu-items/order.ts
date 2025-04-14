// assets
import { IconShoppingCartBolt } from '@tabler/icons-react'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { PERMISSION } from '../../constants'

// constant
const icons = { IconShoppingCartBolt }

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
    }
  ]
}

export default order
