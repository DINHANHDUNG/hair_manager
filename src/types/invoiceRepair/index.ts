import { HistoryProductionType, OrderType } from '../order'

export interface InvoiceRepairType {
  id: number
  code: string,
  createdAt: string
  updatedAt: string
  deletedAt: string
  reasonRepair: string
  dateRepair: string
  dateReceive: null
  dateEstimateDelivery: null
  dateDelivery: null
  noteRepair: string
  statusOrder: string
  orderId: number
  order: OrderType
  historyProductions: HistoryProductionType
  contentInvoiceRepairs: Array<ContentInvoiceRepairType>
}

export interface ContentInvoiceRepairType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  invoiceRepairId: number
  content: string
  invoiceRepair: InvoiceRepairType
  imageUploads: Array<ImageUploadInvoiceRepairType>
}

export interface ImageUploadInvoiceRepairType {
  id?: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  fileName?: string
  path?: string
  routeName? : string
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
export interface FormValuesInvoiceRepair {
  code: string
  reasonRepair: string
  dateRepair?: string //ngày yêu cầu sửa
  noteRepair?: string
  orderId?: number
  contentInvoiceRepairs?: Array<{
    content: string
    imageUploads?: Array<ImageUploadInvoiceRepairType>
  }>
}

export type FieldCInvoiceRepair = 'reasonRepair' | 'dateRepair' | 'noteRepair' | 'orderId' | 'contentInvoiceRepairs'

export type FieldCInvoiceRepairHistory = 'date' | 'status'

//Filter advance
export type FormValuesFilterInvoicRepair = {
  fullName?: string
  shortName?: string
  taxCode?: string
  typeInvoicRepair?: string
  online?: boolean
  offline?: boolean
}

export type FilterAdvancedInvoicRepairType = {
  fullName?: string
  shortName?: string
  taxCode?: string
  typeInvoicRepair?: string
  isActive?: boolean | string
}
