import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import moment from 'moment'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAddEmployeeMutation } from '../../app/services/employee'
import { OPTIONGENDER } from '../../common/contants'
import { VALIDATE } from '../../common/validate'
import MyButton from '../../components/button/MyButton'
import SubmitButton from '../../components/button/SubmitButton'
import MyDatePicker from '../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../components/dialog/CustomDialog'
import MyTextField from '../../components/input/MyTextField'
import MySelect from '../../components/select/MySelect'
import Toast from '../../components/toast'
import { gridSpacingForm } from '../../constants'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
}

type FormValues = {
  code: string
  name: string
  birthDay: string
  address?: string
  addressOrigin?: string
  phoneNumber: string
  email?: string
  gender: string
  ethnic?: string
  identificationCard: string
  representativeName?: string
  representativePhone?: string
  representativePosition?: string
}

type Field =
  | 'code'
  | 'name'
  | 'birthDay'
  | 'address'
  | 'addressOrigin'
  | 'phoneNumber'
  | 'email'
  | 'gender'
  | 'ethnic'
  | 'identificationCard'
  | 'representativeName'
  | 'representativePhone'
  | 'representativePosition'

const validationSchema = yup.object({
  code: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255, 'Độ dài không được quá 255')
    .matches(VALIDATE.noSpace, 'Vui lòng nhập đúng định dạng'),
  name: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  birthDay: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  address: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  addressOrigin: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    // .max(11)
    .matches(VALIDATE.phoneRelaxed, 'Vui lòng nhập đúng định dạng'),
  email: yup.string().email('Email không hợp lệ').optional(),
  gender: yup.string().required('Trường này là bắt buộc'),
  ethnic: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  identificationCard: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255, 'Độ dài không được quá 255')
    .matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng'),
  representativeName: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  representativePhone: yup
    .string()
    // .max(11)
    .test('is-valid-phone', 'Vui lòng nhập đúng định dạng', (value) => !value || VALIDATE.phoneRelaxed.test(value)),
  representativePosition: yup.string().max(255, 'Độ dài không được quá 255').optional()
})

export default function FormAddEditWorker(Props: Props) {
  const { open, handleClose, handleSave } = Props
  const [addEmployee, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddEmployeeMutation()
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const date = moment(data.birthDay).startOf('day')
    const isoDateStr = date?.toISOString()
    addEmployee({ ...data, birthDay: isoDateStr })
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
    <CustomDialog title='Thêm mới công nhân' open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={6}>
            <MyTextField name='code' control={control} label='Mã công nhân' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='name' control={control} label='Tên công nhân' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyDatePicker name='birthDay' control={control} label='Ngày sinh' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MySelect name='gender' control={control} label='Giới tính' errors={errors} options={OPTIONGENDER} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='phoneNumber' control={control} label='Số điện thoại' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='identificationCard' control={control} label='Số CCCD' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='email' control={control} label='Email' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='ethnic' control={control} label='Dân tộc' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='address' control={control} label='Địa chỉ hiện tại' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='addressOrigin' control={control} label='Nguyên quán' errors={errors} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <MyTextField name='representativeName' control={control} label='Tên người đại diện' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='representativePhone' control={control} label='SĐT người đại diện' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField
              name='representativePosition'
              control={control}
              label='Chức vụ người đại diện'
              errors={errors}
            />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sx={{ mt: 2 }}>
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
