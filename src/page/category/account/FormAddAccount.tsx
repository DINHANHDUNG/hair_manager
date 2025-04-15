import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, IconButton, InputAdornment } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useGetRolesQuery } from '../../../app/services/auth'
import { useAddStaffMutation, useGetListStaffQuery } from '../../../app/services/staff'
import { OPTIONGENDER } from '../../../common/contants'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MySelect from '../../../components/select/MySelect'
import Toast from '../../../components/toast'
import { gridSpacingForm } from '../../../constants'
import { RoleType } from '../../../types/account'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import MyAutocomplete from '../../../components/select/MyAutocomplete'
import { convertDataLabel } from '../../../app/hooks'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
}

type FormValues = {
  name: string
  gender?: string
  birthDay: string
  email?: string
  address?: string
  phoneNumber: string
  identificationCard: string
  addressOrigin?: string
  ethnic?: string
  roleId: number
}

const validationSchema = yup.object({
  name: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  gender: yup.string(),
  birthDay: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  email: yup.string().email('Email không hợp lệ'),
  address: yup.string().max(255, 'Độ dài không được quá 255'),
  addressOrigin: yup.string().max(255, 'Độ dài không được quá 255'),
  ethnic: yup.string().max(255, 'Độ dài không được quá 255'),
  identificationCard: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255, 'Độ dài không được quá 255')
    .matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng'),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  roleId: yup.number().required('Trường này là bắt buộc').typeError('Vui lòng chọn quyền')
})

export default function FormAddAccount(Props: Props) {
  const { open, handleClose, handleSave } = Props
  const [showPassword, setShowPassword] = useState(false)
  const { data: dataRole } = useGetRolesQuery({})
  const listRole = dataRole?.data?.map((e: RoleType) => ({ ...e, value: e.id, label: e.nameVI })) || []

  const [addStaff, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddStaffMutation()
  const { data: dataApiStaff } = useGetListStaffQuery({})
  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    // setValue,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const date = moment(data.birthDay).startOf('day')
    const isoDateStr = date?.toISOString()
    addStaff({ ...data, birthDay: isoDateStr })
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

  type Field =
    | 'name'
    | 'gender'
    | 'birthDay'
    | 'email'
    | 'address'
    | 'addressOrigin'
    | 'identificationCard'
    | 'phoneNumber'
    | 'roleId'

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

  return (
    <CustomDialog
      title='Thêm mới '
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
              options={dataOptionStaff}
              isOptionEqualToValue={(option, value) => {
                return option.value === value.value
              }}
              textFieldProps={{ variant: 'outlined' }}
            /> */}
            <MySelect name='staffId' control={control} label='Nhân viên' errors={errors} options={dataOptionStaff} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect
              name='roleId'
              control={control}
              label='Loại tài khoản'
              errors={errors}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'sale', label: 'Sale' },
                { value: 'quanly', label: 'Quản lý' },
                { value: 'ketoan', label: 'Kế toán' },
              ]}
            />
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
