import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import MyTextField from '../../../components/input/MyTextField'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import { gridSpacingForm } from '../../../constants'
import { useAddCompanyMutation, useUpdateCompanyMutation } from '../../../app/services/company'
import Toast from '../../../components/toast'
import LoadingModal from '../../../components/ui-component/LoadingModal'
import { CompanyType } from '../../../types/company'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: CompanyType
}

type FormValues = {
  code?: string
  name: string
  address: string
  taxCode: string
  phoneNumber: string
  representativeName?: string
  representativePosition?: string
  representativePhone?: string
  note?: string
  email?: string
  industryName?: string
}

const validationSchema = yup.object({
  code: yup.string().max(255).optional(),
  name: yup.string().max(255).required('Trường này là bắt buộc'),
  address: yup.string().max(255).required('Trường này là bắt buộc'),
  taxCode: yup.string().required('Trường này là bắt buộc'),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  representativeName: yup.string().max(255).optional(),
  representativePosition: yup.string().max(255).optional(),
  representativePhone: yup
    .string()
    .max(11)
    .test('is-valid-phone', 'Vui lòng nhập đúng định dạng', (value) => !value || VALIDATE.phoneRegex.test(value))
    .optional(),
  note: yup.string().max(255).optional(),
  email: yup.string().email('Vui lòng nhập đúng định dạng email').optional(),
  industryName: yup.string().max(255).optional()
})

export default function FormAddEditCompany({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [addCompany, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddCompanyMutation()

  const [editCompany, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdateCompanyMutation()

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    if (itemSelectedEdit?.id) return editCompany({ ...value, id: itemSelectedEdit.id })
    addCompany({ ...value })
  }

  useEffect(() => {
    if (!itemSelectedEdit?.id) reset()
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

  type Field =
    | 'name'
    | 'email'
    | 'address'
    | 'phoneNumber'
    | 'code'
    | 'taxCode'
    | 'representativeName'
    | 'representativePosition'
    | 'representativePhone'
    | 'note'
    | 'industryName'

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
    setValue('code', itemSelectedEdit?.code)
    setValue('taxCode', itemSelectedEdit?.taxCode || '')
    setValue('note', itemSelectedEdit?.note)
    setValue('representativeName', itemSelectedEdit?.representativeName)
    setValue('representativePosition', itemSelectedEdit?.representativePosition)
    setValue('representativePhone', itemSelectedEdit?.representativePhone)
    setValue('industryName', itemSelectedEdit?.industryName)
  }, [itemSelectedEdit])

  return (
    <CustomDialog
      title={itemSelectedEdit?.id ? 'Chỉnh sửa công ty' : 'Thêm mới công ty'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          {itemSelectedEdit?.id && (
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <MyTextField name='code' disabled={true} control={control} label='Mã công ty' errors={errors} />
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='name' control={control} label='Tên công ty*' errors={errors} />
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
            <MyTextField name='email' control={control} label='Email' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='representativeName' control={control} label='Tên người đại diện' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField
              name='representativePosition'
              control={control}
              label='Chức vụ người đại diện'
              errors={errors}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='representativePhone' control={control} label='SĐT người đại diện' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='note' control={control} label='Ghi chú' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <MyTextField name='industryName' control={control} label='Thuộc KCN' errors={errors} />
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
      <LoadingModal open={loadingAdd} />
    </CustomDialog>
  )
}
