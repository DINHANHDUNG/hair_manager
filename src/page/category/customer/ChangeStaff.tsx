import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { convertDataLabel, handleMutation } from '../../../app/hooks'
import { useChangeAccCustomerMutation } from '../../../app/services/customer'
import { useGetListStaffQuery } from '../../../app/services/staff'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MySelect from '../../../components/select/MySelect'
import { gridSpacingForm } from '../../../constants'
import { ErrorType } from '../../../types'
import { CustomerType } from '../../../types/customer'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: CustomerType
}

type FormValues = {
  accountId: string
}

const validationSchema = yup.object({
  accountId: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc')
})

export default function ChangeAccountStaff({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [
    changeAccCustomer,
    { isLoading: loadingChangeAcc, isSuccess: isSuccessChangeAcc, isError: isErrorChangeAcc, error }
  ] = useChangeAccCustomerMutation()

  const { data: dataApiStaff } = useGetListStaffQuery({})
  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    itemSelectedEdit && changeAccCustomer({ accountId: Number(value.accountId), customerIds: [itemSelectedEdit.id] })
  }

  useEffect(() => {
    if (!itemSelectedEdit?.id) reset()
  }, [open])

  type Field = 'accountId'

  useEffect(() => {
    if (!loadingChangeAcc && isErrorChangeAcc) {
      const newError = error as ErrorType<Field>
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isErrorChangeAcc,
      isSuccess: isSuccessChangeAcc,
      loading: loadingChangeAcc,
      refetch: () => handleClose()
    })
  }, [loadingChangeAcc])

  return (
    <CustomDialog title={'Chuyển tài khoản'} open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MySelect name='accountId' control={control} label='Nhân viên' errors={errors} options={dataOptionStaff} />
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
