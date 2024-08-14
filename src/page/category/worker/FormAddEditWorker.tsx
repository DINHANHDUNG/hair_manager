import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MySelect from '../../../components/select/MySelect'
import { gridSpacingForm } from '../../../constants'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: (data: FormValues) => void
}

type FormValues = {
  workerId: string
  workerName: string
  birthday: string
  currentAddress?: string
  hometown?: string
  phonenumber: string
  identityNumber?: string
  email?: string
  sex: string
  ethnicity?: string
  // representativeName?: string
  // representativePhone?: string
  // representativePosition?: string
}

const validationSchema = yup.object({
  workerId: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255)
    .matches(VALIDATE.noSpace, 'Vui lòng nhập đúng định dạng'),
  workerName: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  birthday: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  currentAddress: yup.string().max(255).optional(),
  hometown: yup.string().max(255).optional(),
  phonenumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  identityNumber: yup.string().max(12).matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng').optional(),
  email: yup.string().email('Email không hợp lệ').optional(),
  sex: yup.string().required('Trường này là bắt buộc'),
  ethnicity: yup.string().max(255).optional()
  // representativeName: yup.string().max(255).optional(),
  // representativePhone: yup
  //   .string()
  //   .max(11)
  //   .test('is-valid-phone', 'Vui lòng nhập đúng định dạng', (value) => !value || VALIDATE.phoneRegex.test(value)),
  // representativePosition: yup.string().max(255).optional()
})

export default function FormAddEditWorker(Props: Props) {
  const { open, handleClose, handleSave } = Props

  const selectOptions = [
    { value: '0', label: 'Nữ' },
    { value: '1', label: 'Nam' }
  ]

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSave(data)
  }

  useEffect(() => {
    reset()
  }, [open])

  return (
    <CustomDialog title='Thêm mới công nhân' open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={6}>
            <MyTextField name='workerId' control={control} label='Mã công nhân' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='workerName' control={control} label='Tên công nhân' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyDatePicker name='birthday' control={control} label='Ngày sinh' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MySelect name='sex' control={control} label='Giới tính' errors={errors} options={selectOptions} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='phonenumber' control={control} label='Số điện thoại' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='identityNumber' control={control} label='Số CCCD' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='email' control={control} label='Email' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='ethnicity' control={control} label='Dân tộc' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='currentAddress' control={control} label='Địa chỉ hiện tại' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyTextField name='hometown' control={control} label='Nguyên quán' errors={errors} />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
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
          </Grid> */}
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
