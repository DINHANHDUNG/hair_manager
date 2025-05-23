import { Alert, Grid, IconButton, InputAdornment } from '@mui/material'
import { CustomDialog } from './CustomDialog'
import { gridSpacingForm } from '../../constants'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VALIDATE } from '../../common/validate'
import { useChange_pass_accMutation } from '../../app/services/auth'
import { useEffect, useState } from 'react'
import Toast from '../toast'
import SubmitButton from '../button/SubmitButton'
import MyTextField from '../input/MyTextField'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface Props {
  open: boolean
  handleClose: () => void
}

type Field = 'newPassword' | 'repeatPassword' | 'currentPassword'

type FormValues = {
  currentPassword: string
  newPassword: string
  repeatPassword: string
}

const validationSchema = yup.object({
  currentPassword: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  newPassword: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.passwordRegex, 'Vui lòng nhập đúng định dạng'),
  repeatPassword: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.passwordRegex, 'Vui lòng nhập đúng định dạng')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

export default function ChangePassword({ open, handleClose }: Props) {
  const [changePass, { isLoading, isSuccess, isError, error }] = useChange_pass_accMutation()
  const [showPassword, setShowPassword] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
  }

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    changePass({ ...value })
  }

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isSuccess) {
      reset()
      handleClose()
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
    handleMutation(isLoading, isError, isSuccess, 'Thay đổi mật khẩu thành công', 'Thay đổi mật khẩu không thành công')
  }, [isLoading])

  return (
    <CustomDialog title={'Đổi mật khẩu'} open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 3 }}>
          <Alert variant='outlined' severity='info'>
            Mật khẩu tối thiểu 8 ký tự phải có ít nhất 1 ký tự đặt biệt và in hoa, số.
          </Alert>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <MyTextField
              name='currentPassword'
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
          </Grid>

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
              Đổi mật khẩu
            </SubmitButton>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  )
}
