import { yupResolver } from '@hookform/resolvers/yup'
import { Card, Divider, Grid, Stack, Step, StepLabel, Stepper, Typography, useMediaQuery } from '@mui/material'
import { useEffect, memo, useState } from 'react'
import { ErrorOption, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import {
//     useAddCustomerMutation,
//     useUpdateWarehouseCustomerMutation
// } from '../../../../app/services/customer'
// import { useGetListPaymentMethodQuery } from '../../../../app/services/paymentMethod'
import { COLORS } from '../../../common/colors'
// import { OPTIONTYPECUSTOMER } from '../../../common/contants'
import MyTextField from '../../../components/input/MyTextField'
import MySelect from '../../../components/select/MySelect'
import LoadingModal from '../../../components/ui-component/LoadingModal'
// import { DataErrorCustomer, FormValuesCustomer } from '../../../../types/customer'
import { convertDataLabel, handleMutation, useAppSelector } from '../../../app/hooks'
import { validationSchemaOrder } from './validationSchema'
import MyAutocompleteFreeSolo from '../../../components/select/MyAutocompleteFreeSolo'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import SubmitButton from '../../../components/button/SubmitButton'
import { gridSpacingForm } from '../../../constants'
import MainCard from '../../../components/ui-component/cards/MainCard'
import ItemOrder from './ItemOrder'
import { FormValuesOrder } from '../../../types/order'
import MyAutocomplete from '../../../components/select/MyAutocomplete'
import FormAddEditInvoice from '../modalInvoice'
import MyButton from '../../../components/button/MyButton'
// import ItemItemOrder from './ItemItemOrder'
// interface Props {
//   customerId?: number
//   dataCustomer?: CustomerType
//   refetchData?: () => void
//   isWareHouse?: boolean
// }

const selectOptions = [
  { value: 'Khách hàng 1', label: 'Khách hàng 1', address: 'Yên Phong', phoneNumber: '0333999887' },
  { value: 'Khách hàng 2', label: 'Khách hàng 2', address: 'Từ Sơn', phoneNumber: '0447999887' },
  { value: 'Khách hàng 3', label: 'Khách hàng 3', address: 'Hà Nội', phoneNumber: '0986999887' }
]

const selectOptions2 = [
  { value: '0333999887', label: '0333999887', address: 'Yên Phong', phoneNumber: '0333999887' },
  { value: '0447999887', label: '0447999887', address: 'Từ Sơn', phoneNumber: '0447999887' },
  { value: '0986999887', label: '0986999887', address: 'Hà Nội', phoneNumber: '0986999887' }
]

const selectOptions3 = [
  { value: 'Yên Phong', label: 'Yên Phong', address: 'Yên Phong', phoneNumber: '0333999887' },
  { value: 'Từ Sơn', label: 'Từ Sơn', address: 'Từ Sơn', phoneNumber: '0447999887' },
  { value: 'Hà Nội', label: 'Hà Nội', address: 'Hà Nội', phoneNumber: '0986999887' }
]

const statusSX = [
  { value: 'Đang chia hàng', label: 'Đang chia hàng' },
  { value: 'Đã gửi lace', label: 'Đã gửi lace' },
  { value: 'Đang làm màu', label: 'Đang làm màu' },
  { value: 'Đang tẩy màu', label: 'Đang tẩy màu' },
  { value: 'Đang xử lý mềm mượt', label: 'Đang xử lý mềm mượt' }
]

const steps = ['Đang sản xuất', 'Đã đóng gói - chờ giao', 'Đang giao hàng', 'Hoàn thành']

const FormAddEditOrder = memo(() => {
  //   const permAddEditPaymentAcc = useHasPermission(Perm_Customer_PaymentAccount_Add || [])
  // const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const matchDown1281 = useMediaQuery('(max-width:1281px)')

  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())

  const [modalInvoice, setModalInvoice] = useState(false)

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const isStepOptional = (step: number) => {
    return step === 0
  }
  // const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'))
  //   const [addCustomer, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
  //     useAddCustomerMutation()

  //   const { data: dataApiPaymentMethod } = useGetListPaymentMethodQuery({})
  //   const dataOptionPaymentMethod = convertDataLabel({
  //     data: dataApiPaymentMethod?.data?.rows || [],
  //     key: 'name',
  //     value: 'id'
  //   })
  const {
    control,
    handleSubmit,
    // reset,
    setError,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<any>({
    resolver: yupResolver(validationSchemaOrder),
    // context: { permAddEditPaymentAcc },
    defaultValues: {
      itemOrders: [{ name: '', size: '', quantity: '', unit: '', unitPrice: '', money: '' }],
      invoices: [
        { content: '', image: '' },
        { content: '', image: '' }
      ]
    }
  })

  const {
    fields: fieldsItemOrders,
    append: appendItemOrders,
    remove: removeItemOrders
  } = useFieldArray({
    control,
    name: 'itemOrders' // Array field name
  })

  const handleAddItemOrder = () => {
    appendItemOrders({
      name: '',
      size: '',
      unit: '',
      unitPrice: '',
      money: '',
      quantity: ''
    })
  }

  const handleDeleteItemOrder = (index: number) => {
    removeItemOrders(index)
  }

  const {
    fields: fieldsInvoices,
    append: appendInvoices,
    remove: removeInvoices
  } = useFieldArray({
    control,
    name: 'invoices' // Array field name
  })

  const handleAddInvoice = () => {
    appendInvoices({
      content: '',
      image: ''
    })
  }

  const handleDeleteInvoice = (index: number) => {
    removeInvoices(index)
  }

  const onSubmit: SubmitHandler<any> = (value) => {
    console.log('Submitted Data: ', value)
    // Call API or handle save action
    // addCustomer({
    //   ...value
    // })
  }

  const handleModalInvoice = () => {
    setModalInvoice(!modalInvoice)
  }

  return (
    <MainCard back title={'Thông tin đơn hàng'} sx={{ height: '100%' }}>
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
        <Stack direction='row' justifyContent='center' alignItems={'center'}>
          <Card
            sx={{
              mb: 1,
              width: '100%',
              bgcolor: 'background.default',
              padding: '15px',
              paddingTop: 0,
              marginBottom: 0
            }}
          >
            <Grid container direction={'row'} sx={{ mb: 2 }} spacing={1.5}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {}
                    const labelProps: {
                      optional?: React.ReactNode
                    } = {}
                    if (isStepOptional(index)) {
                      labelProps.optional = <Typography variant='caption'>{index + 1}/04/2025</Typography>
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    )
                  })}
                </Stepper>
              </Grid>
            </Grid>
            <Grid container direction={'row'} sx={{ mb: 2 }} spacing={1.5}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyTextField
                  name='code'
                  control={control}
                  errors={errors}
                  title='Mã đơn'
                  variant='outlined'
                  size='small'
                  placeholder='Nhập mã đơn'
                  require
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyAutocomplete
                  title='Trạng thái sản xuất'
                  name='address'
                  control={control}
                  // label='Pick or type a value'
                  errors={errors}
                  options={statusSX} //Object là object[] hoặc string[]
                  // mb={2}
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  freeSolo
                  placeholder='Chọn trạng thái sản xuất'
                  size='small'
                  require
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MyDatePicker
                  name='factoryReceiveDate'
                  control={control}
                  errors={errors}
                  title='Ngày xưởng nhận đơn'
                  variant='outlined'
                  size='small'
                  placeholder='Chọn ngày xưởng nhận đơn'
                  //   defaultValue={dayjs()}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MyDatePicker
                  name='expectedDeliveryDate'
                  control={control}
                  errors={errors}
                  title='Ngày dự kiến giao'
                  variant='outlined'
                  size='small'
                  placeholder='Chọn ngày dự kiến giao'
                  //   defaultValue={dayjs()}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <MyDatePicker
                  name='deliveredAt'
                  control={control}
                  errors={errors}
                  title='Ngày giao thực tế'
                  variant='outlined'
                  size='small'
                  placeholder='Chọn ngày giao thực tế'
                  //   defaultValue={dayjs()}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyDatePicker
                  name='dateOrder'
                  control={control}
                  errors={errors}
                  title='Ngày tạo đơn hàng'
                  variant='outlined'
                  size='small'
                  placeholder='Chọn ngày tạo đơn hàng'
                  //   defaultValue={dayjs()}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyAutocompleteFreeSolo
                  title='Tên khách hàng'
                  name='fullName'
                  control={control}
                  // label='Pick or type a value'
                  errors={errors}
                  options={selectOptions} //Object là object[] hoặc string[]
                  // mb={2}
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  freeSolo
                  onChange={(_, value) => {
                    console.log(value)

                    setValue('address', value?.address || '')
                    setValue('phoneNumber', value?.phoneNumber || '')
                  }}
                  placeholder='Nhập tên khách hàng'
                  size='small'
                  require
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyAutocompleteFreeSolo
                  title='Địa chỉ khách hàng'
                  name='address'
                  control={control}
                  // label='Pick or type a value'
                  errors={errors}
                  options={selectOptions3} //Object là object[] hoặc string[]
                  // mb={2}
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  freeSolo
                  placeholder='Nhập địa chỉ khách hàng'
                  size='small'
                  require
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <MyAutocompleteFreeSolo
                  title='Số điện thoại khách hàng'
                  name='phoneNumber'
                  control={control}
                  // label='Pick or type a value'
                  errors={errors}
                  options={selectOptions2} //Object là object[] hoặc string[]
                  // mb={2}
                  textFieldProps={{
                    variant: 'outlined'
                  }}
                  freeSolo
                  placeholder='Nhập số điện thoại khách hàng'
                  size='small'
                  require
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MyTextField
                  name='discount'
                  control={control}
                  errors={errors}
                  title='Tiền discount'
                  variant='outlined'
                  size='small'
                  placeholder='Nhập tiền discount'
                  require
                />
              </Grid>
              <ItemOrder
                control={control}
                errors={errors}
                handleDeleteItemOrder={handleDeleteItemOrder}
                handleAddItemOrder={handleAddItemOrder}
                fieldsItemOrders={fieldsItemOrders}
              />
            </Grid>

            <Grid container direction={'row'} spacing={1.5}>
              <Grid item xs={12}>
                <SubmitButton variant='contained' sx={{ float: 'right', mt: 2 }} loading={isSubmitting}>
                  Cập nhật
                </SubmitButton>
                <MyButton variant='contained' sx={{ float: 'right', mt: 2, mr: 1 }} loading={isSubmitting}>
                  Hoàn thành
                </MyButton>
                <MyButton variant='outlined' sx={{ float: 'right', mt: 2, mr: 1 }} loading={isSubmitting}>
                  Đã nhận hàng cần sửa
                </MyButton>
                <MyButton variant='outlined' sx={{ float: 'right', mt: 2, mr: 1 }} loading={isSubmitting}>
                  Nhận hàng
                </MyButton>
                <MyButton
                  variant='outlined'
                  sx={{ float: 'right', mt: 2, mr: 1, borderColor: COLORS.red, color: COLORS.red }}
                  loading={isSubmitting}
                  onClick={handleModalInvoice}
                >
                  Tạo invoice sửa đơn
                </MyButton>
                <MyButton
                  variant='outlined'
                  sx={{ float: 'right', mt: 2, mr: 1, borderColor: COLORS.red, color: COLORS.red }}
                  loading={isSubmitting}
                >
                  Huỷ đơn
                </MyButton>
              </Grid>
            </Grid>
          </Card>
        </Stack>

        <LoadingModal open={false} />

        <FormAddEditInvoice
          handleClose={handleModalInvoice}
          open={modalInvoice}
          control={control}
          errors={errors}
          handleDeleteInvoice={handleDeleteInvoice}
          handleAddInvoice={handleAddInvoice}
          fieldsInvoices={fieldsInvoices}
        />
      </form>
    </MainCard>
  )
})

export default FormAddEditOrder
