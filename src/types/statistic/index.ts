export type StaticStaffTotalType = {
  currentMonth: number
  lastMonth: number
  percentageIncrease: number
}

export type StaticStatusStaffType = {
  countStatusOut: number
  countStatusStop: number
  countStatusWorking: number
  countTypeOfficial: number
  countTypePartTime: number
  countTypeProbation: number
}

export type StaticStatusEmployeeType = {
  countStatusFail: number
  countStatusInCompany: number
  countStatusInHome: number
  countStatusInCustomer: number
  countStatusOut: number
  countStatusWaiting: number
}

export type StaticSalaryAdvanceType = {
  totalSalaryAdvance: number
  totalSalaryRefund: number
  totalSalaryRemaining: number
}

export type StaticEmployeeByMonthType = {
  month: string
  count: number
}
