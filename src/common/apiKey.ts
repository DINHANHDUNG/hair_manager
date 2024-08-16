export const API_URL = process.env.REACT_APP_BASE_URL ?? ''

export const NetWork = {
  //Admin
  login: 'auth/login',
  refresh_token: 'auth/refresh-token',

  //Account
  account: 'account',
  role: 'role',

  //Pokemon
  pokemon: 'api/v2/',

  //Staff
  staff: 'staff',
  staffId: (staffId: number) => `staff/${staffId}`,
  staffActive: (staffId: number) => `staff/${staffId}/active`,

  //Employee
  employee: 'employee',
  employeeId: (employeeId: number) => `employee/${employeeId}`,
  employeeActive: (employeeId: number) => `employee/${employeeId}/active`,

  //Company
  company: 'company',
  companyId: (companyId: number) => `company/${companyId}`,

  //Partner
  partner: 'partner',
  partnerId: (partnerId: number) => `partner/${partnerId}`
}
