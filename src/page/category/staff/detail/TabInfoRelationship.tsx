import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useUpdateStaffMutation } from '../../../../app/services/staff'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyTextField from '../../../../components/input/MyTextField'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { StaffType } from '../../../../types/staff'

const validationSchema = yup.object({
  representativeName: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  representativePosition: yup.string().required('Trường này là bắt buộc').max(255, 'Độ dài không được quá 255'),
  representativePhone: yup
    .string()
    .required('Trường này là bắt buộc')
    // .max(11)
    .matches(VALIDATE.phoneRelaxed, 'Vui lòng nhập đúng định dạng')
})

type FormValues = {
  representativeName: string
  representativePhone: string
  representativePosition: string
}

type Field = 'representativeName' | 'representativePhone' | 'representativePosition'

interface Props {
  data: StaffType
  reloadData?: () => void
}
export default function TabInforepresentativePosition(Props: Props) {
  //   const { open, handleClose, handleSave } = Props
  const { data, reloadData } = Props
  const [updateStaff, { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error }] =
    useUpdateStaffMutation()
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    setValue,
    // reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    console.log(value)
    updateStaff({ ...data, ...value })
  }

  useEffect(() => {
    setValue('representativeName', data?.representativeName)
    setValue('representativePhone', data?.representativePhone)
    setValue('representativePosition', data?.representativePosition)
  }, [data])

  // useEffect(() => {
  //   reset()
  // }, [open])

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
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='representativeName'
            control={control}
            label='Họ và tên'
            errors={errors}
            variant='outlined'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='representativePhone'
            control={control}
            label='Số điện thoại'
            errors={errors}
            variant='outlined'
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='representativePosition'
            control={control}
            label='Chức vụ người đại diện'
            errors={errors}
            variant='outlined'
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
