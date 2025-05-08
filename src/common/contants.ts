import colors from '../assets/scss/_themes-vars.module.scss'
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

export const OPTIONSPOSITION = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'QUANLY', label: 'Quản lý' },
  { value: 'SALE', label: 'Sale' },
  { value: 'KETOAN', label: 'Kế toán' }
]

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
  { value: 'LENT_TO_PARTNER', label: 'Cho vendor mượn' },
  { value: 'RESIGNED', label: 'Đã nghỉ việc' },
  { value: 'BORROWED_FROM_PARTNER', label: 'Mượn của vendor' }
]

export const STATUS_WORKING_EMPLOYEE = [
  { value: 'WAITING', label: 'Chờ phỏng vấn' },
  { value: 'FAIL', label: 'Phỏng vấn trượt' },
  { value: 'IN_HOME', label: 'Chờ giao việc' },
  { value: 'IN_COMPANY', label: 'Trong công ty' },
  { value: 'IN_PARTNER', label: 'Cho vendor mượn' },
  { value: 'OUT', label: 'Đã nghỉ việc' }
]

export const STATUS_ADVANCE_SALARY = [
  { value: 'WAITING_ACCEPT', label: 'Chờ duyệt', bg: 'yellow', color: 'black' },
  { value: 'ACCEPTED', label: 'Đã duyệt', bg: colors.successDark, color: 'white' },
  { value: 'REJECTED', label: 'Từ chối', bg: 'red', color: 'white' }
]

export const OPTION_COMPLETION = [
  { value: 'true', label: 'Đã hoàn ứng' },
  { value: 'false', label: 'Chưa hoàn' }
]

export const OPTION_HUMAN_RESOURCES = [
  { value: 'STAFF', label: 'Nhân viên' },
  { value: 'EMPLOYEE', label: 'Công nhân' }
]

//ReactDropzone upload file
export const FILE_ACCEPT_TYPES = {
  images: {
    'image/jpeg': ['.jpg', '.jpeg', '.jfif'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/heic': ['.heic', '.heif']
  },
  excel: {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  },
  pdf: {
    'application/pdf': ['.pdf']
  }
}

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif', '.heic', '.heif']
