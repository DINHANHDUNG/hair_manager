import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { convertDataLabel } from '../../../../app/hooks'
import { useGetListEmployeeQuery } from '../../../../app/services/employee'
import {
  useAddSalaryPayMutation,
  useGetSalaryPayByIdQuery,
  useUpdateSalaryPayMutation
} from '../../../../app/services/salaryPay'
import { useGetListStaffQuery } from '../../../../app/services/staff'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import { NumericFormatCustom } from '../../../../components/input'
import MyTextField from '../../../../components/input/MyTextField'
import MyAutocomplete from '../../../../components/select/MyAutocomplete'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { SalaryPayType } from '../../../../types/SalaryPay'
interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: SalaryPayType
}

type Field = 'totalMoney' | 'totalPayment' | 'note' | 'staffId' | 'employeeId' | 'isStaff'

type FormValues = {
  totalMoney: number
  totalPayment: number
  note: string
  isStaff?: string
  staffId?: object | undefined
  employeeId?: object | undefined
}

const validationSchema = yup.object({
  totalMoney: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Trường này phải là số')
    .required('Trường này là bắt buộc'),
  totalPayment: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Trường này phải là số')
    .required('Trường này là bắt buộc'),
  note: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  isStaff: yup.string(),
  staffId: yup.lazy((_, context) => {
    if (context.parent.isStaff === 'STAFF') {
      return yup.object().required('Không tìm thấy nhân viên')
    }
    return yup.object().optional()
  }),
  employeeId: yup.lazy((_, context) => {
    if (context.parent.isStaff === 'EMPLOYEE') {
      return yup.object().required('Không tìm thấy công nhân')
    }
    return yup.object().optional()
  })
})

export default function FormAddEditSalaryPay({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [addSalaryPay, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddSalaryPayMutation()
  const {
    data: fetchData,
    isLoading,
    refetch
  } = useGetSalaryPayByIdQuery(
    {
      salaryPayId: itemSelectedEdit?.id || 0
    },
    {
      skip: !itemSelectedEdit?.id
    }
  )

  const [editSalaryPay, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdateSalaryPayMutation()

  const { data: dataApiEmployee } = useGetListEmployeeQuery({})
  const { data: dataApiStaff } = useGetListStaffQuery({})

  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })
  const dataOptionEmployee = convertDataLabel({ data: dataApiEmployee?.data?.rows || [], key: 'name', value: 'id' })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    // const staff = value?.staffId as OptionType
    // const employee = value?.employeeId as OptionType
    // const check = value.isStaff === 'STAFF'

    if (itemSelectedEdit?.id)
      return editSalaryPay({
        totalMoney: value.totalMoney,
        totalPayment: value.totalPayment,
        note: value.note,
        id: itemSelectedEdit.id
      })
    addSalaryPay({
      totalMoney: value.totalMoney,
      totalPayment: value.totalPayment,
      note: value.note
    })
  }

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isSuccess) handleSave()
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      isSuccess && Toast({ text: successMessage, variant: 'success' })
    }
  }

  useEffect(() => {
    if (!loadingAdd && isErrorAdd) {
      const newError = error as {
        data: {
          errors: string
          keyError: Field
          message: string
          status: string
        }
      }
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation(loadingAdd, isErrorAdd, isSuccessAdd, 'Thêm mới thành công', 'Thêm mới không thành công')
  }, [loadingAdd])

  useEffect(() => {
    if (!loadingEdit && isErrorEdit) {
      const newError = errorEdit as {
        data: {
          errors: string
          keyError: Field
          message: string
          status: string
        }
      }
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation(loadingEdit, isErrorEdit, isSuccessEdit, 'Cập nhật thành công', 'Cập nhật không thành công')
  }, [loadingEdit])

  const isStaff = watch('isStaff') // Theo dõi giá trị isStaff

  useEffect(() => {
    if (isStaff === 'STAFF') {
      setValue('employeeId', {})
    } else {
      setValue('staffId', {})
    }
  }, [isStaff, setValue])

  useEffect(() => {
    if (!isLoading && fetchData?.data) {
      const newData = fetchData?.data
      setValue('isStaff', newData?.employeeId ? 'EMPLOYEE' : newData?.staffId ? 'STAFF' : '')
      setValue('totalMoney', newData?.totalMoney || '')
      setValue('totalPayment', newData?.totalPayment || '')
      setValue('note', newData?.note || '')
      setValue('staffId', newData?.staffId ? { value: newData?.staff.id, label: newData?.staff.name } : {})
      setValue('employeeId', newData?.employeeId ? { value: newData?.employee.id, label: newData?.employee.name } : {})
    }
  }, [isLoading, fetchData, open])

  useEffect(() => {
    if (!itemSelectedEdit?.id) reset()
  }, [open, itemSelectedEdit])

  useEffect(() => {
    if (itemSelectedEdit?.id) refetch()
  }, [open, itemSelectedEdit?.id, refetch])

  return (
    <CustomDialog
      title={itemSelectedEdit?.id ? 'Chỉnh sửa thanh toán lương' : 'Thêm mới thanh toán lương'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect
              name='isStaff'
              control={control}
              label='Nhân sự'
              errors={errors}
              options={OPTION_HUMAN_RESOURCES}
              disabled
            />
          </Grid> */}
          {isStaff === 'STAFF' && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyAutocomplete
                name='staffId'
                control={control}
                label='Nhân viên'
                errors={errors}
                options={dataOptionStaff}
                getOptionSelected={(option, value) => {
                  return option.value === value.value
                }}
                textFieldProps={{ variant: 'standard' }}
                disabled
              />
            </Grid>
          )}
          {isStaff === 'EMPLOYEE' && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyAutocomplete
                name='employeeId'
                control={control}
                label='Công nhân'
                errors={errors}
                options={dataOptionEmployee}
                getOptionSelected={(option, value) => {
                  return option.value === value.value
                }}
                textFieldProps={{ variant: 'standard' }}
                disabled
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='totalMoney'
              control={control}
              label='Số tiền'
              errors={errors}
              textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
              InputProps={{
                /* eslint-disable @typescript-eslint/no-explicit-any */
                inputComponent: NumericFormatCustom as any
                /* eslint-enable @typescript-eslint/no-explicit-any */
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='totalPayment'
              control={control}
              label='Số tiền'
              errors={errors}
              textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
              InputProps={{
                /* eslint-disable @typescript-eslint/no-explicit-any */
                inputComponent: NumericFormatCustom as any
                /* eslint-enable @typescript-eslint/no-explicit-any */
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='note' control={control} label='Ghi chú' errors={errors} />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacingForm} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MyButton variant='outlined' sx={{ float: 'right', ml: 1 }} onClick={handleClose}>
              HỦY
            </MyButton>
            <SubmitButton variant='outlined' sx={{ float: 'right' }} loading={isSubmitting}>
              LƯU
            </SubmitButton>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  )
}
