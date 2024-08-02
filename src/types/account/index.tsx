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
}

export interface StaffType {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  name: string
  address: string
  birthDay: string
  phoneNumber: string
  email: string
  identificationCard: string
  addressOrigin: string
  accountId: number
  account: AccountType
}
