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
  nanme: string
  sex: string
  birthday: string
  email: string
  address: string
  phonenumber: string
}

const validationSchema = yup.object({
  nanme: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  sex: yup.string().required('Trường này là bắt buộc'),
  birthday: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  email: yup.string().required('Trường này là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Trường này là bắt buộc').max(255),
  phonenumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng')
})

export default function FormAddStaff(Props: Props) {
  const { open, handleClose, handleSave } = Props

  const selectOptions = [
    { value: '0', label: 'Nữ' },
    { value: '1', label: 'Nam' }
  ]
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    // setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSave(data)
  }

  useEffect(() => {
    reset()
  }, [open])

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
              name='nanme'
              control={control}
              label='Họ và tên'
              errors={errors}
              //   variant='standard'
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='sex' control={control} label='Giới tính' errors={errors} options={selectOptions} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyDatePicker
              name='birthday'
              control={control}
              label='Ngày sinh'
              errors={errors}
              //   defaultValue={dayjs()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='phonenumber' control={control} label='Số điện thoại' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='address' control={control} label='Địa chỉ' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='email' control={control} label='Email' errors={errors} />
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
