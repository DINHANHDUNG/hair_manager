import { StaffType } from '../staff'

export interface AccountType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  username: string
  password: string
  accessToken: string
  refreshToken: string
  active: true
  role: string
  staff: StaffType
}
