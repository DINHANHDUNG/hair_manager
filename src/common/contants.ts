import colors from '../assets/scss/_themes-vars.module.scss'
import { COLORS } from './colors'
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

export const OPTIONS_ORDER_KEY = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  DELIVERING: 'DELIVERING',
  RECEIVED: 'RECEIVED',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
  REPAIR: 'REPAIR'
}

export const OPTIONS_STATUS_ORDER = [
  { value: OPTIONS_ORDER_KEY.NEW, label: 'Đơn mới' },
  { value: OPTIONS_ORDER_KEY.PROCESSING, label: 'Đang sản xuất' },
  { value: OPTIONS_ORDER_KEY.DELIVERING, label: 'Đang giao' },
  { value: OPTIONS_ORDER_KEY.RECEIVED, label: 'Đã nhận' },
  { value: OPTIONS_ORDER_KEY.DONE, label: 'Hoàn thành' },
  { value: OPTIONS_ORDER_KEY.CANCEL, label: 'Sửa đơn' },
  { value: OPTIONS_ORDER_KEY.REPAIR, label: 'Huỷ đơn' }
]

export const checkColor = (val: string) => {
  switch (val) {
    case OPTIONS_ORDER_KEY.NEW:
      return '#000000'
    case OPTIONS_ORDER_KEY.PROCESSING:
      return '#000000'
    case OPTIONS_ORDER_KEY.DELIVERING:
      return '#ffffff'
    case OPTIONS_ORDER_KEY.RECEIVED:
      return '#ffffff'
    case OPTIONS_ORDER_KEY.DONE:
      return '#ffffff'
    case OPTIONS_ORDER_KEY.CANCEL:
      return '#ffffff'
    case OPTIONS_ORDER_KEY.REPAIR:
      return '#ffffff'
    default:
      return COLORS.black
  }
}
export const checkBg = (val: string) => {
  switch (val) {
    case OPTIONS_ORDER_KEY.NEW:
      return '#ffffff'
    case OPTIONS_ORDER_KEY.PROCESSING:
      return '#FFEB3B'
    case OPTIONS_ORDER_KEY.DELIVERING:
      return '#FFEB3B'
    case OPTIONS_ORDER_KEY.RECEIVED:
      return '#2196F3'
    case OPTIONS_ORDER_KEY.DONE:
      return '#4CAF50'
    case OPTIONS_ORDER_KEY.CANCEL:
      return '#F44336'
    case OPTIONS_ORDER_KEY.REPAIR:
      return '#9C27B0'
    default:
      return COLORS.black
  }
}
