import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Grid } from '@mui/material'
import { GridRowId } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useChangeStatusSalaryRefundMultipleMutation } from '../../../../app/services/salaryRefund'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import MyTextField from '../../../../components/input/MyTextField'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  ids: GridRowId[]
}

type Field = 'statusRefund'

type FormValues = {
  note?: string
}

const validationSchema = yup.object({
  note: yup.string().max(255, 'Độ dài không được quá 255')
})

export default function FormChangeStatusRefundMultiple({ open, handleClose, handleSave, ids }: Props) {
  const [changeStatus, { isLoading: loading, isSuccess: isSuccess, isError: isError, error }] =
    useChangeStatusSalaryRefundMultipleMutation()

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
    changeStatus({
      salaryAdvanceIds: ids,
      ...value
    })
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
    reset()
  }, [open])

  useEffect(() => {
    if (!loading && isError) {
      const newError = error as {
        data: {
          errors: string
          keyError: Field
          message: string
          status: string
        }
      }
      newError && setError('note', { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation(loading, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loading])

  return (
    <CustomDialog title={'Hoàn ứng'} open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MyTextField name='note' control={control} label='Ghi chú' errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Alert variant='standard' severity='info'>
              Hệ thống chỉ thực hiện hoàn ứng cho các đơn ứng lương được duyệt và chưa hoàn ứng
            </Alert>
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
