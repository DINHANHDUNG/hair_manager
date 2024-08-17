import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Alert, Grid, IconButton, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useChange_pass_staffMutation } from '../../../../app/services/auth'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyTextField from '../../../../components/input/MyTextField'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { StaffType } from '../../../../types/staff'

type FormValues = {
  // oldPassword: string
  newPassword: string
  repeatPassword: string
}

type Field = 'newPassword' | 'repeatPassword'

const validationSchema = yup.object({
  // oldPassword: yup.string().max(255).required('Trường này là bắt buộc'),
  newPassword: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.passwordRegex, 'Vui lòng nhập đúng định dạng'),
  repeatPassword: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.passwordRegex, 'Vui lòng nhập đúng định dạng')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

interface Props {
  data: StaffType
  reloadData?: () => void
}

export default function TabChangePassword(Props: Props) {
  const { data, reloadData } = Props
  const [changePass, { isLoading, isSuccess, isError, error }] = useChange_pass_staffMutation()
  //   const { open, handleClose, handleSave } = Props
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
  }

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
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    // console.log(data)
    changePass({ accountId: data.id, ...value })
    // handleSave(data)
  }

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isSuccess) {
      reloadData && reloadData()
      reset()
    }
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      isSuccess && Toast({ text: successMessage, variant: 'success' })
    }
  }

  useEffect(() => {
    if (!isLoading && isError) {
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
    handleMutation(isLoading, isError, isSuccess, 'Cập nhật thành công', 'Cập nhật không thành công')
  }, [isLoading])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 3 }}>
          <Alert variant='outlined' severity='info'>
            Mật khẩu tối thiểu 8 ký tự phải có ít nhất 1 ký tự đặt biệt và in hoa, số.
          </Alert>
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacingForm}>
        {/* <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='oldPassword'
            control={control}
            label='Mật khẩu cũ'
            errors={errors}
            variant='outlined'
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
          />
        </Grid> */}

        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='newPassword'
            control={control}
            label='Mật khẩu mới'
            errors={errors}
            variant='outlined'
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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='repeatPassword'
            control={control}
            label='Xác nhận mật khẩu'
            errors={errors}
            variant='outlined'
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
          />
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
          <SubmitButton
            variant='contained'
            sx={{ float: 'right' }}
            loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
          >
            Câp nhật
          </SubmitButton>
        </Grid>
      </Grid>
    </form>
  )
}
