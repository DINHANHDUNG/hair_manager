//Order

import { PERMISSION } from '../constants'

//Báo cáo
export const Perm_DASHBOARD_Menu_View = [PERMISSION.ADMIN, PERMISSION.QUANLY]
export const Perm_DASHBOARD_ALL_View = [PERMISSION.ADMIN, PERMISSION.QUANLY]

export const Perm_DASHBOARD_ORDER_SALE_View = [PERMISSION.ADMIN]
export const Perm_DASHBOARD_ORDER_View = [PERMISSION.ADMIN]

export const Perm_Order_View = [PERMISSION.ADMIN, PERMISSION.SALE, PERMISSION.QUANLY]
export const Perm_Order_Add = [PERMISSION.SALE]
export const Perm_Order_Edit = [PERMISSION.SALE]
export const Perm_Order_HistoryPrd_View = [PERMISSION.SALE, PERMISSION.QUANLY, PERMISSION.ADMIN]
export const Perm_Order_HistoryPrd_Add = [PERMISSION.QUANLY]

export const Perm_Order_Cancel_View = [PERMISSION.ADMIN, PERMISSION.QUANLY]
export const Perm_Order_Cancel_Add = [PERMISSION.ADMIN]
export const Perm_Order_Cancel_Edit = [PERMISSION.ADMIN]

export const Perm_Invoice_Add = [PERMISSION.SALE]
export const Perm_Invoice_Edit = [PERMISSION.SALE, PERMISSION.QUANLY]

//Danh mục
export const Perm_Category_View = [PERMISSION.ADMIN, PERMISSION.SALE]

export const Perm_Staff_View = [PERMISSION.ADMIN]
export const Perm_Staff_Add = [PERMISSION.ADMIN]
export const Perm_Staff_Edit = [PERMISSION.ADMIN]

export const Perm_Customer_View = [PERMISSION.ADMIN, PERMISSION.SALE]
export const Perm_Customer_Add = [PERMISSION.ADMIN, PERMISSION.SALE]
export const Perm_Customer_Edit = [PERMISSION.ADMIN, PERMISSION.SALE]

export const Perm_Account_View = [PERMISSION.ADMIN]
export const Perm_Account_Add = [PERMISSION.ADMIN]
export const Perm_Account_Edit = [PERMISSION.ADMIN]
