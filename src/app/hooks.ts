import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Toast from '../components/toast'
import { FilterAdvancedType } from '../types'
import { authStore } from './selectedStore'
import type { AppDispatch, RootState } from './store'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }

  return true
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const Numberformat = function (number: number) {
  return new Intl.NumberFormat('vi-VN', {
    // minimumFractionDigits: 2,
  }).format(number)
}

//Format curency
export const currency = function (number: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
    // minimumFractionDigits: 2,
  }).format(number)
}

export function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN')
}

export const handleMutation = (props: {
  loading: boolean
  isError: boolean
  isSuccess: boolean
  successMessage: string
  errorMessage: string
  refetch: () => void
}) => {
  if (!props.loading) {
    props.isError && Toast({ text: props.errorMessage || '', variant: 'error' })
    props.isSuccess && Toast({ text: props.successMessage || '', variant: 'success' }) && props.refetch()
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const convertDataLabel = ({ data, key, value }: { data: any; key: string; value: string }) => {
  const newData = data.map((e: any) => ({ ...e, label: e?.[key] || '', value: e?.[value] || '' }))
  return newData || []
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const useHasPermission = (...permissionGroups: string[][]): boolean => {
  // Lấy role từ store
  const role = useAppSelector(authStore).user.role || ''

  // Nối tất cả các mảng quyền thành 1 mảng duy nhất
  const allowedPermissions = permissionGroups.flat()

  // Kiểm tra xem có ít nhất 1 quyền trong roles trùng với các quyền cho phép hay không
  return allowedPermissions.includes(role)
}

// Hàm tạo params từ paginationModel và filters
export const useCreateSearchParams = (
  paginationModel: { page: number; pageSize: number },
  filters: { [field: string]: string | FilterAdvancedType[] }
) => {
  const params: { [key: string]: string } = {}
  const fields = {
    page: paginationModel.page.toString(),
    pageSize: paginationModel.pageSize.toString(),
    ...filters
  }

  // Chỉ thêm các trường hợp có giá trị
  Object.entries(fields).forEach(([key, value]) => {
    if (typeof value == 'boolean') return (params[key] = value)
    if (value) {
      // Xử lý mảng nếu có
      if (Array.isArray(value)) {
        params[key] = JSON.stringify(value)
      } else {
        params[key] = value // Gán giá trị cho các trường khác
      }
    }
  })

  return params
}

// Lấy param
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useQueryParam = (paramName: string, defaultValue: any) => {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [searchParams] = useSearchParams()
  const paramValue = searchParams.get(paramName)

  const isJson = (str: string) => {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  if (paramValue) {
    if (isJson(paramValue)) {
      try {
        const val = JSON.parse(paramValue)
        if (typeof val == 'boolean') return val
        return val || defaultValue
      } catch (error) {
        console.error(`Error parsing ${paramName}:`, error)
        return defaultValue
      }
    } else {
      // Trả về chuỗi gốc nếu không phải là JSON
      return paramValue
    }
  }

  return defaultValue
}
