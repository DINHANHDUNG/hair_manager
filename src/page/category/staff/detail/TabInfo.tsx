import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useUpdateStaffMutation } from '../../../../app/services/staff'
import { OPTIONGENDER } from '../../../../common/contants'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import MyTextField from '../../../../components/input/MyTextField'
import MySelect from '../../../../components/select/MySelect'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { StaffType } from '../../../../types/staff'
import { useGetRolesQuery } from '../../../../app/services/auth'
import { RoleType } from '../../../../types/account'

type FormValues = {
  name: string
  gender: string
  birthDay: string
  email: string
  address: string
  phoneNumber: string
  ethnic: string
  identificationCard: string
  addressOrigin: string
  roleId: number
  representativeName: string
  representativePhone: string
  representativePosition: string
}

const validationSchema = yup.object({
  name: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  gender: yup.string().required('Trường này là bắt buộc'),
  birthDay: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  email: yup.string().required('Trường này là bắt buộc').email('Email không hợp lệ'),
  address: yup.string().required('Trường này là bắt buộc').max(255),
  roleId: yup.number().required('Trường này là bắt buộc').max(255),
  identificationCard: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(255)
    .matches(VALIDATE.cccdRegex, 'Vui lòng nhập đúng định dạng'),
  ethnic: yup.string().required('Trường này là bắt buộc').max(255),
  addressOrigin: yup.string().required('Trường này là bắt buộc').max(255),
  phoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng'),
  representativeName: yup
    .string()
    .max(255)
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.nameRegex, 'Vui lòng nhập đúng định dạng'),
  representativePosition: yup.string().required('Trường này là bắt buộc').max(255),
  representativePhone: yup
    .string()
    .required('Trường này là bắt buộc')
    .max(11)
    .matches(VALIDATE.phoneRegex, 'Vui lòng nhập đúng định dạng')
})
interface Props {
  data: StaffType
  reloadData?: () => void
}
export default function TabInfoStaff(Props: Props) {
  const { data, reloadData } = Props
  const { data: dataRole } = useGetRolesQuery({})
  const listRole = dataRole?.data?.map((e: RoleType) => ({ ...e, value: e.id, label: e.nameVI })) || []
  const [updateStaff, { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error }] =
    useUpdateStaffMutation()
  //   const { open, handleClose, handleSave } = Props

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
    const date = moment(value.birthDay).startOf('day')
    const isoDateStr = date?.toISOString()
    console.log(isoDateStr, moment(isoDateStr).format('DD/MM/YYYY'))
    updateStaff({ ...value, id: data.id, birthDay: isoDateStr })
    // handleSave(data)
  }

  useEffect(() => {
    reset()
  }, [open])

  useEffect(() => {
    setValue('name', data?.name)
    setValue('gender', data?.gender)
    setValue('identificationCard', data?.identificationCard)
    setValue('ethnic', data?.ethnic)
    setValue('phoneNumber', data?.phoneNumber)
    setValue('email', data?.email)
    setValue('addressOrigin', data?.addressOrigin)
    setValue('address', data?.address)
    setValue('roleId', data?.account?.role?.id)
    setValue('representativeName', data?.representativeName)
    setValue('representativePhone', data?.representativePhone)
    setValue('representativePosition', data?.representativePosition)
    setValue('birthDay', dayjs(data?.birthDay).toString())
  }, [data])

  type Field =
    | 'name'
    | 'gender'
    | 'birthDay'
    | 'email'
    | 'address'
    | 'addressOrigin'
    | 'identificationCard'
    | 'phoneNumber'
    | 'ethnic'
    | 'roleId'
    | 'representativePosition'
    | 'representativePhone'
    | 'representativeName'

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
          <MyTextField name='name' control={control} label='Họ và tên' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MySelect
            name='gender'
            control={control}
            label='Giới tính'
            errors={errors}
            options={OPTIONGENDER}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyDatePicker
            name='birthDay'
            control={control}
            label='Ngày sinh'
            errors={errors}
            variant='outlined'
            //   defaultValue={dayjs()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField
            name='identificationCard'
            control={control}
            label='Căn cước công dân'
            errors={errors}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='ethnic' control={control} label='Dân tộc' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='phoneNumber' control={control} label='Số điện thoại' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='address' control={control} label='Địa chỉ' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='addressOrigin' control={control} label='Nguyên quán' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MyTextField name='email' control={control} label='Email' errors={errors} variant='outlined' />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <MySelect
            name='roleId'
            control={control}
            label='Chức vụ'
            errors={errors}
            options={listRole}
            variant='outlined'
          />
        </Grid>
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
