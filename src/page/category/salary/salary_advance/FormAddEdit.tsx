import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../../common/validate'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyTextField from '../../../../components/input/MyTextField'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import { gridSpacingForm } from '../../../../constants'
import Toast from '../../../../components/toast'
import { SalaryAdvanceType } from '../../../../types/salaryAdvance'
import { useAddSalaryAdvanceMutation, useUpdateSalaryAdvanceMutation } from '../../../../app/services/salaryAdvance'
import { NumericFormatCustom } from '../../../../components/input'
import moment from 'moment'
import { OPTION_COMPLETION, OPTION_HUMAN_RESOURCES, STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import MySelect from '../../../../components/select/MySelect'
import MyAutocomplete from '../../../../components/select/MyAutocomplete'
import { useGetListEmployeeQuery } from '../../../../app/services/employee'
import { useGetListStaffQuery } from '../../../../app/services/staff'
import { convertDataLabel } from '../../../../app/hooks'
import { StaffType } from '../../../../types/staff'
import { EmployeeType } from '../../../../types/employee'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'

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
  noteAdvance: string
  statusAdvance: string
  isStaff: string
  staffId?: object | undefined
  employeeId?: object | undefined
}

const validationSchema = yup.object({
  money: yup
    .number()
    .transform((value, originalValue) => (originalValue.trim() === '' ? null : value))
    .typeError('Trường này phải là số')
    .required('Trường này là bắt buộc'),
  dateAdvance: yup
    .string()
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  isRefund: yup.boolean().required('Trường này là bắt buộc').typeError('Trường này là bắt buộc'),
  noteAdvance: yup.string().max(255).required('Trường này là bắt buộc'),
  statusAdvance: yup.string().max(255).required('Trường này là bắt buộc'),
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
  const [addSalaryAdvance, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddSalaryAdvanceMutation()

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
    resolver: yupResolver(validationSchema)
  })

  console.log('errors', errors)

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const date = moment(value.dateAdvance).startOf('day')
    const isoDateStr = date?.toISOString()
    const staff = value?.staffId as StaffType
    const employee = value?.employeeId as EmployeeType
    const check = value.isStaff === 'STAFF'
    if (itemSelectedEdit?.id)
      return editSalaryAdvance({
        ...value,
        id: itemSelectedEdit.id,
        dateAdvance: isoDateStr,
        staffId: check ? staff.id : null,
        employeeId: !check ? employee.id : null
      })
    addSalaryAdvance({
      ...value,
      dateAdvance: isoDateStr,
      staffId: check ? staff.id : null,
      employeeId: !check ? employee.id : null
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
    if (!itemSelectedEdit?.id) reset()
  }, [open])

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

  // useEffect(() => {
  //   setValue('name', itemSelectedEdit?.name || '')
  //   setValue('email', itemSelectedEdit?.email)
  //   setValue('address', itemSelectedEdit?.address || '')
  //   setValue('phoneNumber', itemSelectedEdit?.phoneNumber || '')
  //   setValue('code', itemSelectedEdit?.code)
  //   setValue('noteAdvance', itemSelectedEdit?.noteAdvance || '')
  //   setValue('representativeName', itemSelectedEdit?.representativeName)
  //   setValue('representativePosition', itemSelectedEdit?.representativePosition)
  //   setValue('representativePhone', itemSelectedEdit?.representativePhone)
  // }, [itemSelectedEdit])

  const isStaff = watch('isStaff') // Theo dõi giá trị isStaff

  useEffect(() => {
    if (isStaff) {
      setValue('employeeId', {})
    } else {
      setValue('staffId', {})
    }
  }, [isStaff, setValue])
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
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect
              name='isStaff'
              control={control}
              label='Nhân sự'
              errors={errors}
              options={OPTION_HUMAN_RESOURCES}
            />
          </Grid>
          {isStaff === 'STAFF' && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyAutocomplete
                name='staffId'
                control={control}
                label='Chọn nhân viên'
                errors={errors}
                options={dataOptionStaff}
                getOptionSelected={(option, value) => {
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
                getOptionSelected={(option, value) => {
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
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='isRefund' control={control} label='Hoàn ứng' errors={errors} options={OPTION_COMPLETION} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect
              name='statusAdvance'
              control={control}
              label='Tình trạng hoàn ứng'
              errors={errors}
              options={STATUS_ADVANCE_SALARY}
            />
          </Grid>
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
