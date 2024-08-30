import { CompanyType } from '../company'
import { PartnerType } from '../partner'
import { StaffType } from '../staff'

export type EmployeeType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  code: string
  name: string
  birthDay: string
  address: string
  addressOrigin: string
  phoneNumber: string
  email: string
  gender: string
  ethnic: string
  isDeleted: boolean
  identificationCard: string
  representativeName: string
  representativePhone: string
  representativePosition: string
  avatar: string
  staffId: number
  staff: StaffType
}

export type HistoryEmployeeType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  status: string
  date: string
  note: string
  employeeId: number
  companyId: number | null
  partnerId: number | null
  employee: EmployeeType
  company: CompanyType
  partner: PartnerType
}
