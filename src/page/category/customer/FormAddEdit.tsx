import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAddCustomerMutation, useUpdateCustomerMutation } from '../../../app/services/customer'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import Toast from '../../../components/toast'
import { gridSpacingForm } from '../../../constants'
import { CustomerType } from '../../../types/customer'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: CustomerType
}

type FormValues = {
  note?: string
  name: string
  address: string
  email?: string

  phoneNumber: string
}

const validationSchema = yup.object({
  note: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  name: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  address: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),

  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    // .max(11)
    .matches(VALIDATE.phoneRelaxed, 'Vui lòng nhập đúng định dạng'),

  email: yup.string().email('Vui lòng nhập đúng định dạng email').optional()
})

export default function FormAddEditCustomer({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [addCustomer, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddCustomerMutation()

  const [editCustomer, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdateCustomerMutation()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    if (itemSelectedEdit?.id) return editCustomer({ ...value, id: itemSelectedEdit.id })
    addCustomer({ ...value })
  }

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
    if (!itemSelectedEdit?.id) reset()
  }, [open])

  type Field = 'name' | 'email' | 'address' | 'phoneNumber' | 'note'

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

  useEffect(() => {
    if (!loadingEdit && isErrorEdit) {
      const newError = errorEdit as {
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
    handleMutation(loadingEdit, isErrorEdit, isSuccessEdit, 'Cập nhật thành công', 'Cập nhật không thành công')
  }, [loadingEdit])

  useEffect(() => {
    setValue('name', itemSelectedEdit?.name || '')
    setValue('email', itemSelectedEdit?.email)
    setValue('address', itemSelectedEdit?.address || '')
    setValue('phoneNumber', itemSelectedEdit?.phoneNumber || '')
    setValue('note', itemSelectedEdit?.note)
  }, [itemSelectedEdit])

  return (
    <CustomDialog
      title={itemSelectedEdit?.id ? 'Chỉnh sửa khách hàng' : 'Thêm mới khách hàng'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='name' control={control} label='Tên khách hàng' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='phoneNumber' control={control} label='Mã định danh (Whatsapp)' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='email' control={control} label='Email' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='address' control={control} label='Địa chỉ' errors={errors} />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <MySelect name='gender' control={control} label='Giới tính' errors={errors} options={OPTIONGENDER} />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MyTextField name='note' control={control} label='Ghi chú' errors={errors} />
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
