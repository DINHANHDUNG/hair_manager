import { AccountType } from '../account'

export type CustomerType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  address: string
  phoneNumber: string
  email: string
  isActive: boolean
  note: string
  accountId: number
  account: AccountType
}
