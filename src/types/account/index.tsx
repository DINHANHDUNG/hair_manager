import { StaffType } from '../staff'

export interface AccountType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  username: string
  password: string
  email: string
  accessToken: string
  refreshToken: string
  active: boolean
  staff: StaffType
  roles: string[]
  role: RoleType
}

export interface RoleType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  nameVI: string
  isActive: boolean
  permission: string
}
