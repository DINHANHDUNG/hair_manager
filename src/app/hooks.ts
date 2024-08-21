import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import Toast from '../components/toast'

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
    props.isError && Toast({ text: props.errorMessage, variant: 'error' })
    props.isSuccess && Toast({ text: props.successMessage, variant: 'success' }) && props.refetch()
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const convertDataLabel = ({ data, key, value }: { data: any; key: string; value: string }) => {
  const newData = data.map((e: any) => ({ ...e, label: e?.[key] || '', value: e?.[value] || '' }))
  return newData || []
}
/* eslint-enable @typescript-eslint/no-explicit-any */
