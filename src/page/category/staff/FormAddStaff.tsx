import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { handleMutation } from '../../../app/hooks'
import { useGetListAccountQuery } from '../../../app/services/auth'
import { useAddStaffMutation, useGetStaffByIdQuery, useUpdateStaffMutation } from '../../../app/services/staff'
import { OPTIONSPOSITION } from '../../../common/contants'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MySelect from '../../../components/select/MySelect'
import { gridSpacingForm } from '../../../constants'
import { ErrorType } from '../../../types'
import { StaffType } from '../../../types/staff'
interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelected?: StaffType
}

type FormValues = {
  name: string
  // gender?: string
  // birthDay: string
  // email?: string
  address?: string
  phoneNumber?: string
  identificationCard: string
  // addressOrigin?: string
  // ethnic?: string
  role: string
  accountId: string
}

const validationSchema = yup.object({
  name: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  // gender: yup.string(),
  // birthDay: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  // email: yup.string().email('Email không hợp lệ'),
  address: yup.string().max(255, 'Độ dài không được quá 255'),
  // addressOrigin: yup.string().max(255, 'Độ dài không được quá 255'),
  // ethnic: yup.string().max(255, 'Độ dài không được quá 255'),
  identificationCard: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255, 'Độ dài không được quá 255')
    .matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng'),
  phoneNumber: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  role: yup.string().required('Trường này là bắt buộc').typeError('Vui lòng chọn quyền'),
  accountId: yup.string().required('Trường này là bắt buộc')
})

export default function FormAddStaff(Props: Props) {
  const { open, handleClose, itemSelected } = Props
  const { data: dataListAcccout } = useGetListAccountQuery({})

  const {
    data: fetchData,
    isLoading,
    refetch
  } = useGetStaffByIdQuery(
    {
      staffId: itemSelected?.id || 0
    },
    {
      skip: !itemSelected?.id
    }
  )

  const listAccount = dataListAcccout?.data?.rows?.map((e: any) => ({ ...e, value: e?.id, label: e?.username })) || []

  const [addStaff, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddStaffMutation()

  const [editStaff, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdateStaffMutation()
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // const date = moment(data.birthDay).startOf('day')
    // const isoDateStr = date?.toISOString()
    if (itemSelected?.id) {
      editStaff({ ...data, id: itemSelected?.id, accountId: Number(data.accountId) })
      return
    }
    addStaff({ ...data, accountId: Number(data.accountId) })
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  type Field =
    | 'name'
    // | 'gender'
    // | 'birthDay'
    // | 'email'
    | 'address'
    // | 'addressOrigin'
    | 'identificationCard'
    | 'phoneNumber'
    | 'role'

  useEffect(() => {
    if (!loadingAdd && isErrorAdd) {
      const newError = error as ErrorType<Field>
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isErrorAdd,
      isSuccess: isSuccessAdd,
      loading: loadingAdd,
      refetch: () => handleClose()
    })
  }, [loadingAdd])

  useEffect(() => {
    if (!loadingEdit && isErrorEdit) {
      const newError = errorEdit as ErrorType<Field>
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isErrorEdit,
      isSuccess: isSuccessEdit,
      loading: loadingEdit,
      refetch: () => handleClose()
    })
  }, [loadingEdit])

  useEffect(() => {
    if (!isLoading && fetchData?.data) {
      const newData = fetchData?.data
      setValue('name', newData?.name || '')
      setValue('address', newData?.address || '')
      setValue('phoneNumber', newData?.phoneNumber || '')
      setValue('role', newData?.role || '')
      setValue('accountId', newData?.accountId || '')
      setValue('identificationCard', newData?.identificationCard || '')
    }
  }, [isLoading, fetchData, open])

  useEffect(() => {
    if (!itemSelected?.id) reset()
  }, [open, itemSelected])

  useEffect(() => {
    if (itemSelected?.id) refetch()
  }, [open, itemSelected?.id, refetch])

  return (
    <CustomDialog
      title={itemSelected?.id ? 'Cập nhật' : 'Thêm mới'}
      open={open}
      onClose={handleClose}
      //   onSave={handleSave}
      maxWidth='md' // You can set the maxWidth here
      fullWidth // This makes the dialog take the full width of the container
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='name'
              control={control}
              label='Họ và tên'
              errors={errors}
              //   variant='standard'
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='identificationCard' control={control} label='Căn cước công dân' errors={errors} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='gender' control={control} label='Giới tính' errors={errors} options={OPTIONGENDER} />
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyDatePicker
              name='birthDay'
              control={control}
              label='Ngày sinh'
              errors={errors}
              //   defaultValue={dayjs()}
            />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='phoneNumber' control={control} label='Số điện thoại' errors={errors} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='email' control={control} label='Email' errors={errors} />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='address' control={control} label='Địa chỉ' errors={errors} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='addressOrigin' control={control} label='Nguyên quán' errors={errors} />
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='ethnic' control={control} label='Dân tộc' errors={errors} />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='role' control={control} label='Chức vụ' errors={errors} options={OPTIONSPOSITION} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='accountId' control={control} label='Tài khoản' errors={errors} options={listAccount} />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
            <MyButton variant='outlined' sx={{ float: 'right', ml: 1 }} onClick={handleClose}>
              HỦY
            </MyButton>
            <SubmitButton
              variant='outlined'
              sx={{ float: 'right' }}
              loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
            >
              LƯU
            </SubmitButton>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  )
}
