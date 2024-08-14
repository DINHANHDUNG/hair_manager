import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyTextField from '../../../../components/input/MyTextField'
import { gridSpacingForm } from '../../../../constants'

type FormValues = {
  nanme: string
  sex: string
  birthday?: string
  email?: string
  address: string
  phonenumber: string
  relationship: string
}

const validationSchema = yup.object({
  nanme: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  sex: yup.string().required('Trường này là bắt buộc'),
  // birthday: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  // email: yup.string().required('Trường này là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Trường này là bắt buộc').max(255),
  relationship: yup.string().required('Trường này là bắt buộc').max(255),
  phonenumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng')
})

export default function TabInfoRelationship() {
  //   const { open, handleClose, handleSave } = Props
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
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <MyTextField name='nanme' control={control} label='Họ và tên' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <MyTextField name='phonenumber' control={control} label='Số điện thoại' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <MyTextField
            name='relationship'
            control={control}
            label='Chức vụ người đại diện'
            errors={errors}
            variant='outlined'
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
    // </SubCard>
  )
}
