import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import MyTextField from '../../../components/input/MyTextField'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import { gridSpacingForm } from '../../../constants'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: (data: FormValues) => void
  id?: number // Thêm mã đối tác
}

type FormValues = {
  partnerCode?: string
  partnerName: string
  address: string
  taxCode: string
  phoneNumber: string
  representativeName?: string
  representativeTitle?: string
  representativePhoneNumber?: string
}

const validationSchema = yup.object({
  partnerCode: yup.string().max(255).optional(),
  partnerName: yup.string().max(255).required('Trường này là bắt buộc'),
  address: yup.string().max(255).required('Trường này là bắt buộc'),
  taxCode: yup.string().required('Trường này là bắt buộc'),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  representativeName: yup.string().max(255).optional(),
  representativeTitle: yup.string().max(255).optional(),
  representativePhoneNumber: yup
    .string()
    .max(11)
    .test('is-valid-phone', 'Vui lòng nhập đúng định dạng', (value) => !value || VALIDATE.phoneRegex.test(value))
    .optional()
})

export default function FormAddEditPartner({ open, handleClose, handleSave, id }: Props) {
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
    <CustomDialog
      title={id ? 'Chỉnh sửa đối tác' : 'Thêm mới đối tác'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          {id && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyTextField name='partnerCode' control={control} label='Mã đối tác' errors={errors} />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='partnerName' control={control} label='Tên đơn vị đối tác*' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='address' control={control} label='Địa chỉ*' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='taxCode' control={control} label='MST*' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='phoneNumber' control={control} label='SĐT*' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='representativeName' control={control} label='Người đại diện' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='representativeTitle'
              control={control}
              label='Chức danh người đại diện'
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='representativePhoneNumber'
              control={control}
              label='SĐT người đại diện'
              errors={errors}
            />
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacingForm} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
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
