import { OrderType } from '../order'

export type OrderPaymentType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  datePayment: string
  money: number
  isApprove: boolean
  methodPayment: string
  bankAccount: string
  orderId: number
  order: OrderType
}
