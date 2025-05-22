export type ReportOrderType = {
  id: number,
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
  moneyPay1: number
  moneyPay2: number
  moneyPay3: number
  methodPayment: string
  bankAccount: string
  moneyReceived: number
  moneyDebt: number
  isApprove1: number
  isApprove2: number
  isApprove3: number
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
