import { EmployeeType } from '../employee'
import { StaffType } from '../staff'

export type SalaryAdvanceType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  money: number
  dateAdvance: string
  isRefund: boolean
  noteAdvance: string
  statusAdvance: string
  staffId: number
  employeeId: number
  staff: StaffType
  employee: EmployeeType
  salaryRefunds: []
}
