export const API_URL = process.env.REACT_APP_BASE_URL ?? ''
export const URL_FILE_EXCEL = process.env.REACT_APP_URL_FILE_EXCEL_STAFF ?? ''
export const URL_FILE_EXCEL_EMPLOYEE = process.env.REACT_APP_URL_FILE_EXCEL_EMPLOYEE ?? ''

export const NetWork = {
  //Admin
  login: 'auth/login',
  refresh_token: 'auth/refresh-token',

  //Account
  account: 'account',
  accountActive: (accountId: number) => `account/${accountId}/active`,
  account_changePass: 'account/change-password',
  changePass_acc: 'staff/change-password',
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
  staffSalary: `salary-staff`,
  staffSalaryList: (staffId: number) => `salary-staff/staff/${staffId}`,
  staffSalaryId: (staffSalaryId: number) => `salary-staff/${staffSalaryId}`,

  //Employee
  employee: 'employee',
  employeeId: (employeeId: number) => `employee/${employeeId}`,
  employeeActive: (employeeId: number) => `employee/${employeeId}/active`,
  employeeHistory: `employee-history`,
  employeeHistoryList: (employeeId: number) => `employee-history/employee/${employeeId}`,
  employeeHistoryId: (employeeHistoryId: number) => `employee-history/${employeeHistoryId}`,
  employeeUpload: 'employee/upload',

  //Company
  company: 'company',
  companyId: (companyId: number) => `company/${companyId}`,

  //Partner
  partner: 'partner',
  partnerId: (partnerId: number) => `partner/${partnerId}`,

  //SalaryAdvance
  salaryAdvance: 'salary-advance',
  salaryAdvanceId: (salaryAdvanceId: number) => `salary-advance/${salaryAdvanceId}`,
  salaryAdvanceStatus: (salaryAdvanceId: number) => `salary-advance/${salaryAdvanceId}/status-advance`,

  //SalaryRefund
  salaryRefund: 'salary-refund',
  salaryRefundId: (salaryRefundId: number) => `salary-refund/${salaryRefundId}`,
  salaryRefundStatus: (salaryRefundId: number) => `salary-refund/${salaryRefundId}/status-refund`,
  salaryRefundMultipleStatus: `salary-refund/complete-refund-multiple`,

  //SalaryPay
  salaryPay: 'salary',
  salaryPayUpload: 'salary/upload',
  salaryPayId: (salaryPayId: number) => `salary/${salaryPayId}`,
  salaryPayStatus: (salaryPayId: number) => `salary/${salaryPayId}/status-advance`,

  //Static
  staticStaffTotal: 'statistic/staff-total',
  staticStaffDetail: 'statistic/staff-detail',
  staticEmployeeTotal: 'statistic/employee-total',
  staticEmployeeDetail: 'statistic/employee-detail',
  staticSalaryAdvance: 'statistic/salary-advance',
  staticEmployeeByMonth: 'statistic/employee-by-month'
}
