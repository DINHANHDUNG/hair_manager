export const API_URL = process.env.REACT_APP_BASE_URL ?? ''

export const NetWork = {
  //Admin
  login: 'auth/login',
  refresh_token: 'auth/refresh-token',

  //Account
  account: 'account',
  account_changePass: 'account/change-password',
  role: 'role',

  //Pokemon
  pokemon: 'api/v2/',

  //Staff
  staff: 'staff',
  staffId: (staffId: number) => `staff/${staffId}`,
  staffActive: (staffId: number) => `staff/${staffId}/active`,
  staffHistory: `staff-history`,
  staffHistoryList: (staffId: number) => `staff-history/staff/${staffId}`,
  staffHistoryId: (staffHistoryId: number) => `staff-history/${staffHistoryId}`,

  //Employee
  employee: 'employee',
  employeeId: (employeeId: number) => `employee/${employeeId}`,
  employeeActive: (employeeId: number) => `employee/${employeeId}/active`,
  employeeHistory: `employee-history`,
  employeeHistoryList: (employeeId: number) => `employee-history/employee/${employeeId}`,
  employeeHistoryId: (employeeHistoryId: number) => `employee-history/${employeeHistoryId}`,

  //Company
  company: 'company',
  companyId: (companyId: number) => `company/${companyId}`,

  //Partner
  partner: 'partner',
  partnerId: (partnerId: number) => `partner/${partnerId}`,

  //SalaryAdvance
  salaryAdvance: 'salary-advance',
  salaryAdvanceId: (salaryAdvanceId: number) => `salary-advance/${salaryAdvanceId}`
}
