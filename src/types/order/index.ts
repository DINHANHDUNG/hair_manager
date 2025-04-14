export interface OrderType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  code: string
  fullName: string
  phoneNumber: string
  address: string
  dateOrder: string
  bankAccountId: number
  itemOrders: BankAccountType[]
}

export interface BankAccountType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  typeAccount: string
  bankName: string
  bankNumber: string
  personNumber: string
  isActive: boolean
  paymentId: number
  customerId: number
  payment: {
    id: number
    createdAt: string
    updatedAt: string
    deletedAt: string
    code: string
    name: string
    isActive: boolean
  }
}

export interface PaymentType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  code: string
  name: string
  isActive: boolean
}
export interface FormValuesOrder {
  dateOrder?: string
  fullName?: string
  address?: string
  phoneNumber?: string
  discount?: string

  itemOrders?: Array<{
    name?: string
    size?: string
    quantity?: string
    unit?: string
    unitPrice?: string
    money?: string
  }>
  invoices?: Array<{
    content?: string
    image?: string
  }>
}

export type FieldCustomer = 'fullName' | 'phoneNumber' | 'address' | 'dateOrder'

export type DataErrorCustomer = {
  errors: string
  keyError: FieldCustomer
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
