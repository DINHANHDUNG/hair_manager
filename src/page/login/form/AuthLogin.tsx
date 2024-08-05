import { useEffect, useState } from 'react'

// material-ui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// third party
import { Formik } from 'formik'
import * as Yup from 'yup'

// project imports
import AnimateButton from '../../../components/ui-component/extended/AnimateButton'

// assets
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { authStore } from '../../../app/selectedStore'
import { useLoginMutation } from '../../../app/services/auth'
import LoadingModal from '../../../components/ui-component/LoadingModal'
import ROUTES from '../../../routers/helpersRouter/constantRouter'

const AuthLogin = ({ ...others }) => {
  const { enqueueSnackbar } = useSnackbar()
  const auth = useAppSelector(authStore)
  const navigate = useNavigate()
  const theme = useTheme()
  const [login, { isLoading, error }] = useLoginMutation()
  const [checked, setChecked] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
  }

  useEffect(() => {
    if (auth.accessToken) {
      navigate(`/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`)
    }
  }, [auth])

  useEffect(() => {
    if (!isLoading && error) {
      enqueueSnackbar('Tài khoản hoặc mật khẩu không chính xác', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
    }
  }, [error])

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        <Grid item xs={12} container alignItems='center' justifyContent='center'>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Đăng nhập để tiếp tục</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Vui lòng nhập tài khoản'),
          // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Vui lòng nhập mật khẩu')
        })}
        onSubmit={(values, { setSubmitting }) => {
          login({
            username: values.username,
            Password: values.password
          })
          setSubmitting(false)
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.username && errors.username)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-email-login'>Tài khoản</InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-login'
                type='text'
                value={values.username}
                name='username'
                onBlur={handleBlur}
                onChange={handleChange}
                label='Tài khoản'
                inputProps={{}}
              />
              {touched.username && errors.username && (
                <FormHelperText error id='standard-weight-helper-text-email-login'>
                  {errors.username}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-password-login'>Mật khẩu</InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-login'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name='password'
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                      size='large'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Mật khẩu'
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id='standard-weight-helper-text-password-login'>
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name='checked'
                    color='primary'
                  />
                }
                label='Nhớ mật khẩu'
              />
              {/* <Typography variant='subtitle1' color='secondary' sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography> */}
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  color='secondary'
                >
                  Đăng nhập
                </Button>
              </AnimateButton>
            </Box>
            <LoadingModal open={isLoading} />
          </form>
        )}
      </Formik>
    </>
  )
}

export default AuthLogin
