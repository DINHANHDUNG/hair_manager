import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  useChangeStatusSalaryAdvanceMutation,
  useGetSalaryAdvanceByIdQuery
} from '../../../../app/services/salaryAdvance'
import { STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import MySelect from '../../../../components/select/MySelect'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { SalaryAdvanceType } from '../../../../types/salaryAdvance'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: SalaryAdvanceType
}

type Field = 'statusAdvance'

type FormValues = {
  statusAdvance: string
}

const validationSchema = yup.object({
  statusAdvance: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc')
})

export default function FormChangeStatusSalaryAdvance({ open, handleClose, handleSave, itemSelectedEdit }: Props) {
  const [changeStatus, { isLoading: loading, isSuccess: isSuccess, isError: isError, error }] =
    useChangeStatusSalaryAdvanceMutation()
  const { data: fetchData, isLoading } = useGetSalaryAdvanceByIdQuery(
    {
      salaryAdvanceId: itemSelectedEdit?.id || 0
    },
    {
      skip: !itemSelectedEdit?.id
    }
  )

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
    changeStatus({
      salaryAdvanceId: itemSelectedEdit?.id || 0,
      params: {
        ...value
      }
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
    if (!itemSelectedEdit?.id) reset()
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
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation(loading, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loading])

  useEffect(() => {
    if (!isLoading && fetchData?.data) {
      const newData = fetchData?.data
      setValue('statusAdvance', newData?.statusAdvance)
    }
  }, [isLoading, fetchData])

  return (
    <CustomDialog title={'Thay đổi trạng thái ứng lương'} open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MySelect
              name='statusAdvance'
              control={control}
              label='Tình trạng hoàn ứng'
              errors={errors}
              options={STATUS_ADVANCE_SALARY}
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
