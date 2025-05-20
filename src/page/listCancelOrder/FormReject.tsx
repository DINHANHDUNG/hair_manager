import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { handleMutation } from '../../app/hooks'
import { useUpdateOrderCancelApprovalMutation } from '../../app/services/order'
import MyButton from '../../components/button/MyButton'
import SubmitButton from '../../components/button/SubmitButton'
import { CustomDialog } from '../../components/dialog/CustomDialog'
import MyTextField from '../../components/input/MyTextField'
import { gridSpacingForm } from '../../constants'
import { ErrorType } from '../../types'

interface Props {
  open: boolean
  handleClose: () => void
  orderId?: number
}

type FormValues = {
  reasonCancel: string
}

type Field = 'reasonCancel'

const validationSchema = yup.object({
  reasonCancel: yup.string().required('Trường này là bắt buộc').max(255, 'Độ dài không được quá 255')
})

export default function FormReject(Props: Props) {
  const { open, handleClose, orderId } = Props
  const [updateOrder, { isLoading, isSuccess, isError, error }] = useUpdateOrderCancelApprovalMutation()
  const {
    control,
    handleSubmit,
    reset,
    // setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateOrder({ ...data, id: orderId, isDelete: false })
  }

  useEffect(() => {
    reset()
  }, [open])

  useEffect(() => {
    if (!isLoading) {
      const newError = error as ErrorType<Field>

      handleMutation({
        successMessage: 'Thao tác thành công',
        errorMessage: newError && !newError?.data?.keyError ? newError?.data?.message : 'Thao tác không thành công',
        isError: isError,
        isSuccess: isSuccess,
        loading: isLoading,
        refetch: () => handleClose()
      })
    }
  }, [isLoading])

  return (
    <CustomDialog title='Từ chối' open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12}>
            <MyTextField name='reasonCancel' control={control} label='Lý do từ chối' errors={errors} />
          </Grid>
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
