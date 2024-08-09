import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import MyTextField from '../../../../components/input/MyTextField'
import MySelect from '../../../../components/select/MySelect'
import { gridSpacingForm } from '../../../../constants'

type FormValues = {
  nanme: string
  sex: string
  birthday: string
  email: string
  address: string
  phonenumber: string
  ethnic: string
  cccd: string
  domicile: string
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
  cccd: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255)
    .matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng'),
  ethnic: yup.string().required('Trường này là bắt buộc').max(255),
  domicile: yup.string().required('Trường này là bắt buộc').max(255),
  phonenumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng')
})

export default function TabInfoStaff() {
  //   const { open, handleClose, handleSave } = Props

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
    console.log(data)

    // handleSave(data)
  }

  useEffect(() => {
    reset()
  }, [open])

  return (
    // <SubCard>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='nanme' control={control} label='Họ và tên' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MySelect
            name='sex'
            control={control}
            label='Giới tính'
            errors={errors}
            options={selectOptions}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyDatePicker
            name='birthday'
            control={control}
            label='Ngày sinh'
            errors={errors}
            variant='outlined'
            //   defaultValue={dayjs()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='cccd' control={control} label='Căn cước công dân' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='ethnic' control={control} label='Dân tộc' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='phonenumber' control={control} label='Số điện thoại' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='address' control={control} label='Địa chỉ' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='domicile' control={control} label='Nguyên quán' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='email' control={control} label='Email' errors={errors} variant='outlined' />
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
    // </SubCard>
  )
}
