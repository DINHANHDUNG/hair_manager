import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Grid, IconButton, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { convertDataLabel, handleMutation } from '../../../app/hooks'
import { useAddAccountMutation, useUpdateAccountMutation } from '../../../app/services/auth'
import { useGetListStaffQuery } from '../../../app/services/staff'
import { OPTIONSPOSITION } from '../../../common/contants'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MySelect from '../../../components/select/MySelect'
import { gridSpacingForm } from '../../../constants'
import { ErrorType } from '../../../types'
import { AccountType } from '../../../types/account'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelected?: AccountType
}

type FormValues = {
  username: string
  staffId: string
  password: string
  role: string
}

const validationSchema = yup.object({
  username: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  staffId: yup.string().required('Trường này là bắt buộc'),
  password: yup
    .string()
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.passwordRegex, ' Mật khẩu tối thiểu 8 ký tự phải có ít nhất 1 ký tự đặt biệt và in hoa, số.'),
  role: yup.string().required('Trường này là bắt buộc').typeError('Vui lòng chọn quyền')
})

export default function FormAddAccount(Props: Props) {
  const { open, handleClose, itemSelected } = Props
  const [showPassword, setShowPassword] = useState(false)
  // const { data: dataRole } = useGetRolesQuery({})
  // const listRole = dataRole?.data?.map((e: RoleType) => ({ ...e, value: e.id, label: e.nameVI })) || []

  const [addAccount, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddAccountMutation()

  const [editAccount, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdateAccountMutation()
  const { data: dataApiStaff } = useGetListStaffQuery({})
  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })
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
    if (itemSelected?.id) {
      editAccount({ ...data, id: itemSelected?.id, staffId: Number(data.staffId) })
      return
    }
    addAccount({ ...data, staffId: Number(data.staffId) })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
  }

  useEffect(() => {
    reset()
  }, [open])

  type Field = 'username' | 'staffId' | 'password' | 'role'

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

  // useEffect(() => {
  //   if (!isLoading && fetchData?.data) {
  //     const newData = fetchData?.data
  //     setValue('name', newData?.name || '')
  //     setValue('address', newData?.address || '')
  //     setValue('phoneNumber', newData?.phoneNumber || '')
  //     setValue('role', newData?.role || '')
  //     setValue('staffId', newData?.staffId || '')
  //     setValue('identificationCard', newData?.identificationCard || '')
  //   }
  // }, [isLoading, fetchData, open])

  useEffect(() => {
    if (!itemSelected?.id) reset()
  }, [open, itemSelected])

  // useEffect(() => {
  //   if (itemSelected?.id) refetch()
  // }, [open, itemSelected?.id, refetch])

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
              name='username'
              control={control}
              label='Tài khoản'
              errors={errors}
              //   variant='standard'
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='password'
              control={control}
              label='Mật khẩu'
              errors={errors}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                      size='large'
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              //   variant='standard'
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            {/* <MyAutocomplete
              name='staffId'
              control={control}
              label='Nhân viên'
              errors={errors}
              options={dataOptionAccount}
              isOptionEqualToValue={(option, value) => {
                return option.value === value.value
              }}
              textFieldProps={{ variant: 'outlined' }}
            /> */}
            <MySelect name='staffId' control={control} label='Nhân viên' errors={errors} options={dataOptionStaff} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='role' control={control} label='Loại tài khoản' errors={errors} options={OPTIONSPOSITION} />
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
