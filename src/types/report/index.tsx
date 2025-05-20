export type ReportOrderType = {
  customerName: string
  dateOrder: string
  code: string
  totalWeight: number
  totalPrice: number
  discount: number
  feeShip: number
  feeWig: number
  feePaypal: number
  totalOrder: number
}

export type ReportOrderBySaleType = {
  accountId: number
  staffName: string
  username: string
  quantity: number
  totalWeight: number
  totalOrder: number
  totalOrderPayment: number
  totalOrderDebt: number
}
