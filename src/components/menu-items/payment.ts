// assets
import { IconCheckupList, IconCurrencyDollar } from '@tabler/icons-react'
import { Perm_Payment_Approver_View, Perm_Payment_Default_View, Perm_Payment_View } from '../../help/permission'
import ROUTES from '../../routers/helpersRouter/constantRouter'

// constant
const icons = { IconCurrencyDollar, IconCheckupList }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const payment = {
  id: 'payment',
  title: 'Quản lý thanh toán',
  type: 'group',
  premissions: Perm_Payment_View,
  children: [
    {
      id: ROUTES.PAYMENT,
      title: 'Thanh toán',
      type: 'item',
      url: `/${ROUTES.PAYMENT}/${ROUTES.DEFAULT}`,
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false,
      premissions: Perm_Payment_Default_View
    },
    {
      id: ROUTES.PAYMENT_APPROVE,
      title: 'Phê duyệt',
      type: 'item',
      url: `/${ROUTES.PAYMENT}/${ROUTES.PAYMENT_APPROVE}`,
      icon: icons.IconCheckupList,
      breadcrumbs: false,
      premissions: Perm_Payment_Approver_View
    }
  ]
}

export default payment
