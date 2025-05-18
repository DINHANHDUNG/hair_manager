//Order

import { PERMISSION } from '../constants'

export const Perm_DASHBOARD_ORDER_SALE_View = [PERMISSION.ADMIN, PERMISSION.SALE]
export const Perm_DASHBOARD_ORDER_View = [PERMISSION.ADMIN, PERMISSION.SALE]

export const Perm_Order_View = [PERMISSION.ADMIN, PERMISSION.SALE, PERMISSION.QUANLY]
export const Perm_Order_Add = [PERMISSION.SALE]
export const Perm_Order_Edit = [PERMISSION.SALE, PERMISSION.QUANLY]
export const Perm_Order_HistoryPrd_Edit = [PERMISSION.SALE, PERMISSION.QUANLY, PERMISSION.ADMIN]

export const Perm_Invoice_Add = [PERMISSION.SALE]
export const Perm_Invoice_Edit = [PERMISSION.SALE, PERMISSION.QUANLY]
