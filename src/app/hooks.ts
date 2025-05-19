import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import Toast from '../components/toast'
import { authStore } from './selectedStore'

export function isEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }

  return true
}

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
