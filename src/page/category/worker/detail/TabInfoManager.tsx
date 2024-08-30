import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { convertDataLabel } from '../../../../app/hooks'
import { useUpdateEmployeeMutation } from '../../../../app/services/employee'
import { useGetListStaffQuery } from '../../../../app/services/staff'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyAutocomplete from '../../../../components/select/MyAutocomplete'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { OptionType } from '../../../../types'
import { EmployeeType } from '../../../../types/employee'

type FormValues = {
  staffId?: object | undefined
}

type Field = 'staffId'

const validationSchema = yup.object({
  staffId: yup.lazy((_, context) => {
    if (context.parent.isStaff === 'STAFF') {
      return yup.object().required('Trường này là bắt buộc')
    }
    return yup.object().optional()
  })
})

interface Props {
  data: EmployeeType
  reloadData?: () => void
}

export default function TabInfoManager(Props: Props) {
  const { data, reloadData } = Props
  const { data: dataApiStaff } = useGetListStaffQuery({})

  const dataOptionStaff = convertDataLabel({ data: dataApiStaff?.data?.rows || [], key: 'name', value: 'id' })
  const [updateEmployee, { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error }] =
    useUpdateEmployeeMutation()
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const staff = value?.staffId as OptionType
    updateEmployee({ ...data, ...value, staffId: staff.value || null })
  }

  useEffect(() => {
    reset()
  }, [open])

  useEffect(() => {
    setValue('staffId', data?.staffId ? { value: data?.staff?.id, label: data?.staff?.name } : {})
  }, [data])

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isSuccess) reloadData && reloadData()
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      isSuccess && Toast({ text: successMessage, variant: 'success' })
    }
  }

  useEffect(() => {
    if (!loadingUpdate && isErrorUpdate) {
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
    handleMutation(loadingUpdate, isErrorUpdate, isSuccessUpdate, 'Cập nhật thành công', 'Cập nhật không thành công')
  }, [loadingUpdate])

  return (
    // <SubCard>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <MyAutocomplete
            name='staffId'
            control={control}
            label='Người quản lý'
            errors={errors}
            options={dataOptionStaff}
            getOptionSelected={(option, value) => {
              return option.value === value.value
            }}
            textFieldProps={{ variant: 'outlined' }}
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
    // </SubCard>
  )
}
