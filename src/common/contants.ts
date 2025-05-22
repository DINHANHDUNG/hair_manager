import colors from '../assets/scss/_themes-vars.module.scss'
import { COLORS } from './colors'
export const POST = 'POST'
export const PUT = 'PUT'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PATCH = 'PATCH'

export const STATUS_SUCCESS = 'success'
export const STATUS_ERROR = 'error'

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

export const OPTIONS_UNIT_KEY = {
  WIG: 'wig',
  BUNDLES: 'bundles',
  PIECE: 'piece',
  KG: 'kg'
}

export const OPTIONS_UNIT = [
  { value: OPTIONS_UNIT_KEY.WIG, label: OPTIONS_UNIT_KEY.WIG },
  { value: OPTIONS_UNIT_KEY.BUNDLES, label: OPTIONS_UNIT_KEY.BUNDLES },
  { value: OPTIONS_UNIT_KEY.PIECE, label: OPTIONS_UNIT_KEY.PIECE },
  { value: OPTIONS_UNIT_KEY.KG, label: OPTIONS_UNIT_KEY.KG }
]

export const OPTIONS_ORDER_KEY = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  DELIVERING: 'DELIVERING',
  RECEIVED_ORDER_REPAIR: 'RECEIVED_ORDER_REPAIR',
  RECEIVED: 'RECEIVED',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
  REPAIR: 'REPAIR'
}

export const OPTIONS_STATUS_ORDER = [
  { value: OPTIONS_ORDER_KEY.NEW, label: 'Gửi sản xuất' },
  { value: OPTIONS_ORDER_KEY.PROCESSING, label: 'Đang sản xuất' },
  { value: OPTIONS_ORDER_KEY.DELIVERING, label: 'Đang giao' },
  { value: OPTIONS_ORDER_KEY.RECEIVED, label: 'Đã nhận' },
  { value: OPTIONS_ORDER_KEY.DONE, label: 'Đã gửi hàng' },
  { value: OPTIONS_ORDER_KEY.REPAIR, label: 'Sửa đơn' },
  { value: OPTIONS_ORDER_KEY.CANCEL, label: 'Huỷ đơn' }
]

export const OPTIONS_STATUS_SALE_ORDER = [
  { value: OPTIONS_ORDER_KEY.RECEIVED, label: 'Đã nhận' },
  { value: OPTIONS_ORDER_KEY.DONE, label: 'Đã gửi hàng' },
  { value: OPTIONS_ORDER_KEY.REPAIR, label: 'Sửa đơn' },
  { value: OPTIONS_ORDER_KEY.CANCEL, label: 'Huỷ đơn' }
]

export const OPTIONS_STATUS_QL_ORDER = [
  { value: OPTIONS_ORDER_KEY.PROCESSING, label: 'Đang sản xuất' },
  { value: OPTIONS_ORDER_KEY.DELIVERING, label: 'Đang giao' },
  { value: OPTIONS_ORDER_KEY.RECEIVED_ORDER_REPAIR, label: 'Đã nhận hàng cần sửa' }
]

export const OPTIONS_HISTORY_PROD_KEY = {
  SHARING: 'SHARING',
  LACE: 'LACE',
  COLOR: 'COLOR',
  CLEAN_COLOR: 'CLEAN_COLOR',
  SMOOTH: 'SMOOTH'
}

export const OPTIONS_STATUS_HISTORY_PROD = [
  { value: OPTIONS_HISTORY_PROD_KEY.SHARING, label: 'Đang chia hàng' },
  { value: OPTIONS_HISTORY_PROD_KEY.LACE, label: 'Đã gửi lace' },
  { value: OPTIONS_HISTORY_PROD_KEY.COLOR, label: 'Đang làm màu' },
  { value: OPTIONS_HISTORY_PROD_KEY.CLEAN_COLOR, label: 'Đang tẩy màu' },
  { value: OPTIONS_HISTORY_PROD_KEY.SMOOTH, label: 'Đang làm mượt' }
]

export const OPTIONS_STATUS_PAYMENT_KEY = {
  PART: 'PART',
  DONE: 'DONE'
}

export const OPTIONS_STATUS_PAYMENT = [
  { value: OPTIONS_STATUS_PAYMENT_KEY.PART, label: 'Thanh toán 1 phần' },
  { value: OPTIONS_STATUS_PAYMENT_KEY.DONE, label: 'Thanh toán hết' }
]

export const checkColor = (val: string) => {
  switch (val) {
    // Order status
    case OPTIONS_ORDER_KEY.NEW:
    case OPTIONS_ORDER_KEY.PROCESSING:
      return COLORS.black
    case OPTIONS_ORDER_KEY.DELIVERING:
    case OPTIONS_ORDER_KEY.RECEIVED:
    case OPTIONS_ORDER_KEY.DONE:
    case OPTIONS_ORDER_KEY.CANCEL:
    case OPTIONS_ORDER_KEY.REPAIR:
      return COLORS.black

    // History production status
    case OPTIONS_HISTORY_PROD_KEY.SHARING:
      return COLORS.black
    case OPTIONS_HISTORY_PROD_KEY.LACE:
      return COLORS.black
    case OPTIONS_HISTORY_PROD_KEY.COLOR:
      return COLORS.black
    case OPTIONS_HISTORY_PROD_KEY.CLEAN_COLOR:
      return COLORS.black
    case OPTIONS_HISTORY_PROD_KEY.SMOOTH:
      return COLORS.black

    // Payment status
    case OPTIONS_STATUS_PAYMENT_KEY.PART:
    case OPTIONS_STATUS_PAYMENT_KEY.DONE:
      return COLORS.black

    default:
      return COLORS.black
  }
}

export const checkBg = (val: string) => {
  switch (val) {
    // Order status
    case OPTIONS_ORDER_KEY.NEW:
      return '#E0F7FA'
    case OPTIONS_ORDER_KEY.PROCESSING:
      return '#FFF59D'
    case OPTIONS_ORDER_KEY.DELIVERING:
      return '#FF7043'
    case OPTIONS_ORDER_KEY.RECEIVED:
      return '#42A5F5'
    case OPTIONS_ORDER_KEY.DONE:
      return '#66BB6A'
    case OPTIONS_ORDER_KEY.CANCEL:
      return '#EF5350'
    case OPTIONS_ORDER_KEY.REPAIR:
      return '#E1BEE7'

    // History production status
    case OPTIONS_HISTORY_PROD_KEY.SHARING:
      return '#29B6F6'
    case OPTIONS_HISTORY_PROD_KEY.LACE:
      return '#FFF9C4'
    case OPTIONS_HISTORY_PROD_KEY.COLOR:
      return '#FFB74D'
    case OPTIONS_HISTORY_PROD_KEY.CLEAN_COLOR:
      return '#E0E0E0'
    case OPTIONS_HISTORY_PROD_KEY.SMOOTH:
      return '#BA68C8'

    // Payment status
    case OPTIONS_STATUS_PAYMENT_KEY.PART:
      return '#E1BEE7'
    case OPTIONS_STATUS_PAYMENT_KEY.DONE:
      return '#66BB6A'

    default:
      return COLORS.black
  }
}
