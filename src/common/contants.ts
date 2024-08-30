export const POST = 'POST'
export const PUT = 'PUT'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PATCH = 'PATCH'

export const LICENSE_KEY = process.env.REACT_APP_PUBLIC_MUI_LICENSE_KEY || ''

export const OPTIONGENDER = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' }
]

// export const OPTIONSPOSITION = [
//   { value: 'ADMIN', label: 'Admin' },
//   { value: 'GIAMDOC', label: 'Giám đốc' },
//   { value: 'KETOAN', label: 'Kế toán' },
//   { value: 'HCNS', label: 'Hành chính nhân sự' },
//   { value: 'TUYENDUNG', label: 'Tuyển dụng' },
//   { value: 'SALE', label: 'Bán hàng' }
// ]

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

export const STATUS_WORKING_EMPLOYEE = [
  { value: 'WAITING', label: 'Chờ phỏng vấn' },
  { value: 'FAIL', label: 'Phỏng vấn trượt' },
  { value: 'IN_HOME', label: 'Chờ giao việc' },
  { value: 'IN_COMPANY', label: 'Trong công ty' },
  { value: 'IN_PARTNER', label: 'Cho đối tác mượn' },
  { value: 'OUT', label: 'Đã nghỉ việc' }
]

export const STATUS_ADVANCE_SALARY = [
  { value: 'WAITING_ACCEPT', label: 'Chờ duyệt' },
  { value: 'ACCEPTED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Từ chối' }
]

export const OPTION_COMPLETION = [
  { value: 'true', label: 'Đã hoàn ứng' },
  { value: 'false', label: 'Chưa hoàn' }
]

export const OPTION_HUMAN_RESOURCES = [
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'EMPLOYEE', label: 'Công nhân' }
]
