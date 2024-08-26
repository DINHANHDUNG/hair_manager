import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Grid } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import SubmitButton from '../../../../components/button/SubmitButton'
import { NumericFormatCustom } from '../../../../components/input'
import MyTextField from '../../../../components/input/MyTextField'
import { gridSpacingForm } from '../../../../constants'

type FormValues = {
  salary: string
}

const validationSchema = yup.object({
  salary: yup.string().max(255).required('Trường này là bắt buộc')
})

export default function TabSalary() {
  //   const { open, handleClose, handleSave } = Props

  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    // setValue,
    // reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)

    // handleSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 3 }}>
          <Alert variant='outlined' severity='info'>
            Chú ý: Lương là bảo mật
          </Alert>
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <MyTextField
            name='salary'
            control={control}
            label='Mức lương'
            errors={errors}
            sx={{ mb: 2 }}
            InputProps={{
              /* eslint-disable @typescript-eslint/no-explicit-any */
              inputComponent: NumericFormatCustom as any
              /* eslint-enable @typescript-eslint/no-explicit-any */
            }}
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
  )
}
