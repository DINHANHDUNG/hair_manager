import { useEffect, useState } from 'react'

// material-ui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
// import IconButton from '@mui/material/IconButton'
// import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// third party
import * as Yup from 'yup'
import { useFormik } from 'formik'

// project imports
import AnimateButton from '../../../components/ui-component/extended/AnimateButton'

// assets
// import Visibility from '@mui/icons-material/Visibility'
// import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { authStore } from '../../../app/selectedStore'
import { useGetAccountQuery, useLoginMutation } from '../../../app/services/auth'
import LoadingModal from '../../../components/ui-component/LoadingModal'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { LICENSE_KEY } from '../../../common/contants'
import CryptoJS from 'crypto-js'
import { PERMISSION } from '../../../constants'

const AuthLogin = ({ ...others }) => {
  const { enqueueSnackbar } = useSnackbar()
  const auth = useAppSelector(authStore)
  const navigate = useNavigate()
  const theme = useTheme()
  const [login, { isLoading, error }] = useLoginMutation()
  const { data: account, isSuccess } = useGetAccountQuery(undefined, {
    skip: !auth.accessToken
  })
  const [checked, setChecked] = useState(true)

  // useEffect(() => {
  //   if (auth.accessToken) {
  //     navigate(`/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`)
  //   }
  // }, [auth, navigate])

  useEffect(() => {
    if (account && isSuccess) {
      console.log('account', account)

      if (account?.data?.role === PERMISSION.ADMIN) {
        navigate(`/${ROUTES.DASHBOARD}/${ROUTES.INDEX}`)
      } else {
        navigate(`/${ROUTES.ORDER}/${ROUTES.DEFAULT}`)
      }
    }
  }, [account, isSuccess])

  useEffect(() => {
    if (!isLoading && error) {
      enqueueSnackbar('Tài khoản hoặc mật khẩu không chính xác', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
    }
  }, [error, enqueueSnackbar, isLoading])

  useEffect(() => {
    const encryptedUsername = localStorage.getItem('username')
    const encryptedPassword = localStorage.getItem('password')

    if (encryptedUsername && encryptedPassword) {
      const decryptedUsername = CryptoJS.AES.decrypt(encryptedUsername, LICENSE_KEY).toString(CryptoJS.enc.Utf8)
      const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, LICENSE_KEY).toString(CryptoJS.enc.Utf8)
      formik.setFieldValue('username', decryptedUsername)
      formik.setFieldValue('password', decryptedPassword)
      setChecked(true)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().max(255, 'Độ dài không được quá 255').required('Vui lòng nhập tài khoản'),
      password: Yup.string().max(255, 'Độ dài không được quá 255').required('Vui lòng nhập mật khẩu')
    }),
    onSubmit: (values, { setSubmitting }) => {
      login({
        username: values.username,
        password: values.password
      })
      if (checked) {
        const encryptedUsername = CryptoJS.AES.encrypt(values.username, LICENSE_KEY).toString()
        const encryptedPassword = CryptoJS.AES.encrypt(values.password, LICENSE_KEY).toString()
        localStorage.setItem('username', encryptedUsername)
        localStorage.setItem('password', encryptedPassword)
      } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
      }

      setSubmitting(false)
    }
  })

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        <Grid item xs={12} container alignItems='center' justifyContent='center'>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Đăng nhập để tiếp tục</Typography>
          </Box>
        </Grid>
      </Grid>

      <form noValidate onSubmit={formik.handleSubmit} {...others}>
        <FormControl
          fullWidth
          error={Boolean(formik.touched.username && formik.errors.username)}
          sx={{ ...theme.typography.customInput }}
        >
          <InputLabel htmlFor='outlined-adornment-email-login'>Tài khoản</InputLabel>
          <OutlinedInput
            id='outlined-adornment-email-login'
            type='text'
            value={formik.values.username}
            name='username'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label='Tài khoản'
            inputProps={{}}
          />
          {formik.touched.username && formik.errors.username && (
            <FormHelperText error id='standard-weight-helper-text-email-login'>
              {formik.errors.username}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          error={Boolean(formik.touched.password && formik.errors.password)}
          sx={{ ...theme.typography.customInput }}
        >
          <InputLabel htmlFor='outlined-adornment-password-login'>Mật khẩu</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password-login'
            type={'password'}
            // type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            name='password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            // endAdornment={
            //   <InputAdornment position='end'>
            //     <IconButton
            //       aria-label='toggle password visibility'
            //       onClick={handleClickShowPassword}
            //       onMouseDown={handleMouseDownPassword}
            //       edge='end'
            //       size='large'
            //     >
            //       {showPassword ? <Visibility /> : <VisibilityOff />}
            //     </IconButton>
            //   </InputAdornment>
            // }
            label='Mật khẩu'
            inputProps={{}}
          />
          {formik.touched.password && formik.errors.password && (
            <FormHelperText error id='standard-weight-helper-text-password-login'>
              {formik.errors.password}
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
        {formik.errors.submit && (
          <Box sx={{ mt: 3 }}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button
              disableElevation
              disabled={formik.isSubmitting}
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
    </>
  )
}

export default AuthLogin
