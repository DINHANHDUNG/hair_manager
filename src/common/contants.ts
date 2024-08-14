export const POST = 'POST'
export const PUT = 'PUT'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PATCH = 'PATCH'

export const OPTIONSTATUSWORK = [
  { value: 'WORKING', label: 'Đang làm việc' },
  { value: 'OUT', label: 'Đã nghỉ việc' },
  { value: 'STOP', label: 'Tạm nghỉ' }
]

export const OPTIONTYPEWORK = [
  { value: 'PROBATION', label: 'Thử việc' },
  { value: 'OFFICIAL', label: 'Chính thức' },
  { value: 'PART_TIME', label: 'Bán thời gian' }
]

export const OPTIONSTTWORKER = [
  { value: 'WAITING_FOR_INTERVIEW', label: 'Chờ phỏng vấn' },
  { value: 'INTERVIEW_FAILED', label: 'Phỏng vấn trượt' },
  { value: 'WORKING', label: 'Đang làm việc' },
  { value: 'WAITING_FOR_JOB', label: 'Đang chờ việc' },
  { value: 'LENT_TO_PARTNER', label: 'Cho đối tác mượn' },
  { value: 'RESIGNED', label: 'Đã nghỉ việc' },
  { value: 'BORROWED_FROM_PARTNER', label: 'Mượn của đối tác' }
]
