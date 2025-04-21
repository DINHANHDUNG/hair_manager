import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAddEmployeeMutation } from '../../app/services/employee'
import MyButton from '../../components/button/MyButton'
import SubmitButton from '../../components/button/SubmitButton'
import { CustomDialog } from '../../components/dialog/CustomDialog'
import MyTextField from '../../components/input/MyTextField'
import Toast from '../../components/toast'
import { gridSpacingForm } from '../../constants'

interface Props {
  open: boolean
  handleClose: () => void
}

type FormValues = {
  note: string
}

type Field = 'note'

const validationSchema = yup.object({
  note: yup.string().required('Trường này là bắt buộc').max(255, 'Độ dài không được quá 255')
})

export default function FormReject(Props: Props) {
  const { open, handleClose } = Props
  const [addEmployee, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddEmployeeMutation()
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // addEmployee({ ...data })
  }

  useEffect(() => {
    reset()
  }, [open])

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    // if (isSuccess) handleSave()
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      isSuccess && Toast({ text: successMessage, variant: 'success' })
    }
  }

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

  return (
    <CustomDialog title='Từ chối' open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12}>
            <MyTextField name='note' control={control} label='Lý do từ chối' errors={errors} />
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
