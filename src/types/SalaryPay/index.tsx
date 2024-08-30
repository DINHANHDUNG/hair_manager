import { EmployeeType } from '../employee'
import { SalaryRefundType } from '../salaryRefund'
import { StaffType } from '../staff'

export type SalaryPayType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  totalMoney: number
  totalPayment: number
  datePayment: string
  isPayment: false
  month: number
  year: number
  note: string
  staffId: number
  employeeId: number
  salaryId: number
  staff: StaffType
  employee: EmployeeType
  salaryRefund: SalaryRefundType
}
