import { SalaryAdvanceType } from '../salaryAdvance'

export type SalaryRefundType = {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string
  money: number
  dateRefund: string
  noteRefund: string
  statusRefund: string
  salaryAdvanceId: number
  salaryAdvance: SalaryAdvanceType
}
