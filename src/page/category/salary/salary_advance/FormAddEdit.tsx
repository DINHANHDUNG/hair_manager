import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { convertDataLabel, useAppSelector } from '../../../../app/hooks'
import { useGetListEmployeeQuery } from '../../../../app/services/employee'
import {
  useAddSalaryAdvanceMutation,
  useGetSalaryAdvanceByIdQuery,
  useUpdateSalaryAdvanceMutation
} from '../../../../app/services/salaryAdvance'
import { useGetListStaffQuery } from '../../../../app/services/staff'
import { OPTION_COMPLETION, OPTION_HUMAN_RESOURCES, STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import { VALIDATE } from '../../../../common/validate'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import { NumericFormatCustom } from '../../../../components/input'
import MyTextField from '../../../../components/input/MyTextField'
import MyAutocomplete from '../../../../components/select/MyAutocomplete'
import MySelect from '../../../../components/select/MySelect'
import Toast from '../../../../components/toast'
import { gridSpacingForm, PERMISSION } from '../../../../constants'
import { OptionType } from '../../../../types'
import { SalaryAdvanceType } from '../../../../types/salaryAdvance'
import { authStore } from '../../../../app/selectedStore'
interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: SalaryAdvanceType
}

type Field =
  | 'money'
  | 'dateAdvance'
  | 'isRefund'
  | 'noteAdvance'
  | 'statusAdvance'
  | 'staffId'
  | 'employeeId'
  | 'isStaff'

type FormValues = {
  money: number
  dateAdvance: string
  isRefund: boolean
  noteAdvance?: string
  statusAdvance: string
  isStaff: string
  staffId?: object | undefined
  employeeId?: object | undefined
}

const validationSchema = yup.object({
  money: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Trường này phải là số')
    .required('Trường này là bắt buộc'),
  dateAdvance: yup
    .string()
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  isRefund: yup.boolean().required('Trường này là bắt buộc').typeError('Trường này là bắt buộc'),
  noteAdvance: yup.string().max(255, 'Độ dài không được quá 255'),
  statusAdvance: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  isStaff: yup.string().required('Trường này là bắt buộc'),
  staffId: yup.lazy((_, context) => {
    if (context.parent.isStaff === 'STAFF') {
      return yup.object().required('Trường này là bắt buộc')
    }
    return yup.object().optional()
  }),
  employeeId: yup.lazy((_, context) => {
    if (context.parent.isStaff === 'EMPLOYEE') {
      return yup.object().required('Trường này là bắt buộc')
    }
    return yup.object().optional()
  })
})

export default function FormAddEditSalaryAdvance({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const user = useAppSelector(authStore)?.user
  const checkPremision = [PERMISSION.ADMIN, PERMISSION.GIAMDOC, PERMISSION.HCNS, PERMISSION.KETOAN]?.some(
    (e) => user?.role?.name === e
  )
  const [addSalaryAdvance, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddSalaryAdvanceMutation()
  const {
    data: fetchData,
    isLoading,
    refetch
  } = useGetSalaryAdvanceByIdQuery(
    {
      salaryAdvanceId: itemSelectedEdit?.id || 0
    },
    {
      skip: !itemSelectedEdit?.id
    }
  )

  const [
    editSalaryAdvance,
    { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }
  ] = useUpdateSalaryAdvanceMutation()

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
    defaultValues: {
      statusAdvance: 'WAITING_ACCEPT',
      isRefund: false,
      dateAdvance: dayjs(new Date()).toString(),
      isStaff: 'STAFF',
      staffId: {
        value: user.staff.id,
        label: user.staff.name
      }
    },
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const date = moment(value.dateAdvance).startOf('day')
    const isoDateStr = date?.toISOString()
    const staff = value?.staffId as OptionType
    const employee = value?.employeeId as OptionType
    const check = value.isStaff === 'STAFF'
    console.log(check, employee, staff)

    if (itemSelectedEdit?.id)
      return editSalaryAdvance({
        ...value,
        id: itemSelectedEdit.id,
        dateAdvance: isoDateStr,
        staffId: check ? staff.value : null,
        employeeId: !check ? employee.value : null
      })
    addSalaryAdvance({
      ...value,
      dateAdvance: isoDateStr,
      staffId: check ? staff.value : null,
      employeeId: !check ? employee.value : null
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
      setValue('isStaff', checkPremision && newData?.employeeId ? 'EMPLOYEE' : 'STAFF')
      setValue('money', newData?.money || '')
      setValue('dateAdvance', dayjs(newData?.dateAdvance).toString())
      setValue('isRefund', newData?.isRefund || false)
      setValue('noteAdvance', newData?.noteAdvance || '')
      setValue('statusAdvance', newData?.statusAdvance)
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
      title={itemSelectedEdit?.id ? 'Chỉnh sửa ứng lương' : 'Thêm mới ứng lương'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          {checkPremision && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MySelect
                name='isStaff'
                control={control}
                label='Loại nhân sự'
                errors={errors}
                options={OPTION_HUMAN_RESOURCES}
              />
            </Grid>
          )}
          {isStaff === 'STAFF' && checkPremision && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyAutocomplete
                name='staffId'
                control={control}
                label='Chọn nhân viên'
                errors={errors}
                options={dataOptionStaff}
                isOptionEqualToValue={(option, value) => {
                  return option.value === value.value
                }}
                textFieldProps={{ variant: 'standard' }}
              />
            </Grid>
          )}
          {isStaff === 'EMPLOYEE' && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyAutocomplete
                name='employeeId'
                control={control}
                label='Chọn công nhân'
                errors={errors}
                options={dataOptionEmployee}
                isOptionEqualToValue={(option, value) => {
                  return option.value === value.value
                }}
                textFieldProps={{ variant: 'standard' }}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='money'
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
            <MyDatePicker
              name='dateAdvance'
              control={control}
              label='Ngày'
              errors={errors}
              variant='standard'
              //   defaultValue={dayjs()}
            />
          </Grid>
          {checkPremision && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MySelect
                name='isRefund'
                control={control}
                label='Hoàn ứng'
                errors={errors}
                options={OPTION_COMPLETION}
              />
            </Grid>
          )}
          {checkPremision && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MySelect
                name='statusAdvance'
                control={control}
                label='Tình trạng hoàn ứng'
                errors={errors}
                options={STATUS_ADVANCE_SALARY}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='noteAdvance' control={control} label='Ghi chú' errors={errors} />
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
