import { AccountType } from '../account'

export type StaffType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  birthDay: string
  address: string
  addressOrigin: string
  phoneNumber: string
  email: string
  gender: string
  avatar: string
  ethnic: string
  isActive: boolean
  identificationCard: string
  typeWorking: string
  typePosition: string
  representativeName: string
  representativePhone: string
  representativePosition: string
  accountId: number
  account: AccountType
}

export type HistoryStaffType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  status: string
  type: string
  date: string
  note: string
  staffId: number
  staff: StaffType
}
