import { AccountType } from '../account'
import { CustomerType } from '../customer'

export interface OrderType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  code: string
  dateOrder: string
  dateReceive: string
  dateEstimateDelivery: string
  dateDelivery: string
  customerName: string
  customerPhone: string
  customerAddress: string
  customerId: number
  discount: number
  statusOrder: string
  reasonCancel: string
  isDelete: boolean
  accountSaleId: number
  customer: CustomerType
  accountSale: AccountType
  products: Array<ProductType>
  historyProductions: []
  //dự kiến chưa có đặt tạm
  order_edit_date_push: string
}

export interface ProductType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  size: string
  quantity: number
  unit: string
  price: number
  orderId: number
  order: OrderType
}

// export interface PaymentType {
//   id: number
//   createdAt: string
//   updatedAt: string
//   deletedAt: string
//   code: string
//   name: string
//   isActive: boolean
// }
export interface FormValuesOrder {
  dateOrder: string
  customerId: string
  customerPhone: string
  customerAddress: string
  discount: string

  products?: Array<{
    name: string
    size: string
    quantity: string
    unit: string
    price: string
    money: string
  }>
  // invoices?: Array<{
  //   content?: string
  //   image?: string
  // }>
}

export type FieldCOrder = 'customerId' | 'customerPhone' | 'customerAddress' | 'dateOrder' | 'discount'

export type DataErrorCustomer = {
  errors: string
  keyError: FieldCOrder
  message: string
  status: string
}

//Filter advance
export type FormValuesFilterCustomer = {
  fullName?: string
  shortName?: string
  taxCode?: string
  typeCustomer?: string
  online?: boolean
  offline?: boolean
}

export type FilterAdvancedCustomerType = {
  fullName?: string
  shortName?: string
  taxCode?: string
  typeCustomer?: string
  isActive?: boolean | string
}
