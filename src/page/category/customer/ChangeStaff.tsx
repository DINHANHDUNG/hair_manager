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
import { PartnerType } from '../../../types/partner'
import { useAddPartnerMutation, useUpdatePartnerMutation } from '../../../app/services/partner'
import Toast from '../../../components/toast'
import MySelect from '../../../components/select/MySelect'
import { OPTIONGENDER } from '../../../common/contants'
import { useGetListStaffQuery } from '../../../app/services/staff'
import { convertDataLabel } from '../../../app/hooks'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: PartnerType
}

type FormValues = {
  code?: string
  name: string
  address: string
  email?: string
  taxCode: string
  phoneNumber: string
  representativeName?: string
  representativePosition?: string
  representativePhone?: string
}

const validationSchema = yup.object({
  code: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  name: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  address: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  taxCode: yup.string().required('Trường này là bắt buộc'),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  representativeName: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  representativePosition: yup.string().max(255, 'Độ dài không được quá 255').optional(),
  representativePhone: yup
    .string()
    .max(11)
    .test('is-valid-phone', 'Vui lòng nhập đúng định dạng', (value) => !value || VALIDATE.phoneRegex.test(value))
    .optional(),
  email: yup.string().email('Vui lòng nhập đúng định dạng email').optional()
})

export default function ChangeAccountStaff({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [addPartner, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddPartnerMutation()

  const [editPartner, { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }] =
    useUpdatePartnerMutation()

  const { data: dataApiStaff } = useGetListStaffQuery({})
  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })

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
    if (itemSelectedEdit?.id) return editPartner({ ...value, id: itemSelectedEdit.id })
    addPartner({ ...value })
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
    setValue('representativeName', itemSelectedEdit?.representativeName)
    setValue('representativePosition', itemSelectedEdit?.representativePosition)
    setValue('representativePhone', itemSelectedEdit?.representativePhone)
  }, [itemSelectedEdit])

  return (
    <CustomDialog
      title={'Chuyển tài khoản'}
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MySelect name='staffId' control={control} label='Nhân viên' errors={errors} options={dataOptionStaff} />
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
