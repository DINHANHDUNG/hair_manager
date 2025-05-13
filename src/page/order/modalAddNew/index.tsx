import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { handleMutation } from '../../../app/hooks'
import { useGetListCustomerQuery } from '../../../app/services/customer'
import { useAddOrderMutation } from '../../../app/services/order'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import { InputPropsNumber } from '../../../components/input'
import MyTextField from '../../../components/input/MyTextField'
import MyAutocomplete from '../../../components/select/MyAutocomplete'
import { gridSpacingForm } from '../../../constants'
import { convertDataLabelAutoComplate } from '../../../help'
import { ErrorType } from '../../../types'
import { FieldCOrder, FormValuesOrder } from '../../../types/order'
import ItemOrder from './ItemOrder'
import { validationSchemaOrder } from './validationSchema'
import moment from 'moment'
import Toast from '../../../components/toast'
interface Props {
  open: boolean
  handleClose: () => void
}

export default function FormAddNewOrder({ open, handleClose }: Props) {
  const [addOrder, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddOrderMutation()
  const { data: dataApiCustomer } = useGetListCustomerQuery({ isActive: true })
  const dataOptionCustomer = convertDataLabelAutoComplate({
    data: dataApiCustomer?.data?.rows || [],
    key: 'name',
    value: 'id'
  })
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValuesOrder>({
    resolver: yupResolver(validationSchemaOrder),
    // context: { permAddEditPaymentAcc },
    defaultValues: {
      products: [{ name: '', size: '', quantity: '', unit: '', price: '', money: '' }]
      // customerId: ''
    }
  })

  const {
    fields: fieldsItemOrders,
    append: appendItemOrders,
    remove: removeItemOrders
  } = useFieldArray({
    control,
    name: 'products' // Array field name
  })

  const handleAddItemOrder = () => {
    appendItemOrders({
      name: '',
      size: '',
      unit: '',
      price: '',
      money: '',
      quantity: ''
    })
  }

  const handleDeleteItemOrder = (index: number) => {
    removeItemOrders(index)
  }

  const onSubmit: SubmitHandler<FormValuesOrder> = (value) => {
    console.log('Submitted Data: ', value)
    const date = moment(value.dateOrder).startOf('day')
    const isoDateStr = date?.toISOString()
    const convertValue = {
      ...value,
      dateOrder: isoDateStr,
      discount: value.discount ? Number(value.discount) : 0,
      customerId: value.customerId ? Number(value.customerId) : 0,
      products: products?.map((e) => ({
        name: e.name,
        size: e.size,
        quantity: e.price ? Number(e.quantity) : 0,
        unit: e.unit,
        price: e.price ? Number(e.price) : 0
      }))
    }
    addOrder(convertValue)
    // Call API or handle save action
    // addCustomer({
    //   ...value
    // })
  }

  const products = useWatch({
    control,
    name: 'products'
  })

  useEffect(() => {
    if (products && Array.isArray(products)) {
      products.forEach((e, idx) => {
        const qty = Number(e.quantity) || 0
        const pr = Number(e.price) || 0
        const total = qty * pr
        const currentMoney = Number(e.money)

        // Chỉ setValue khi giá trị thay đổi
        if (currentMoney !== total) {
          setValue(`products.${idx}.money`, total.toString(), { shouldValidate: true })
        }
      })
    }
  }, [products, setValue])

  useEffect(() => {
    if (!loadingAdd) {
      const newError = error as ErrorType<FieldCOrder>
      if (newError && newError?.data?.keyError) {
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
        return
      }
      if (newError && !newError?.data?.keyError) {
        Toast({
          text: newError?.data?.message,
          variant: 'error'
        })
        return
      }
      handleMutation({
        successMessage: 'Thao tác thành công',
        errorMessage: newError && !newError?.data?.keyError ? newError?.data?.message : '',
        isError: isErrorAdd,
        isSuccess: isSuccessAdd,
        loading: loadingAdd,
        refetch: () => handleClose()
      })
    }
  }, [loadingAdd])
  return (
    <CustomDialog title={'Thêm mới đơn'} open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
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
            <MyAutocomplete
              name={`customerId`}
              control={control}
              errors={errors}
              options={dataOptionCustomer ?? []}
              title='Khách hàng'
              placeholder='Chọn khách hàng'
              size='small'
              fullWidth
              require
              onChange={(_, v) => {
                const selectedValue = v as any // Ép kiểu cho giá trị v
                setValue(`customerId`, selectedValue ? selectedValue?.value?.toString() : '') // set đúng giá trị của `value`
                // setValue('customerName', selectedValue?.name || '')
                setValue('customerAddress', selectedValue?.address || '')
                setValue('customerPhone', selectedValue?.phoneNumber || '')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <MyTextField
              name='customerAddress'
              control={control}
              errors={errors}
              title='Địa chỉ khách hàng'
              variant='outlined'
              size='small'
              placeholder='Nhập địa chỉ'
              require
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <MyTextField
              name='customerPhone'
              control={control}
              errors={errors}
              title='Số điện thoại khách hàng'
              variant='outlined'
              size='small'
              placeholder='Nhập số điện thoại'
              require
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <MyTextField
              name='discount'
              control={control}
              errors={errors}
              title='Tiền discount'
              variant='outlined'
              size='small'
              placeholder='Nhập tiền discount'
              require
              InputProps={InputPropsNumber(true)}
            />
          </Grid>
          <ItemOrder
            control={control}
            errors={errors}
            handleDeleteItemOrder={handleDeleteItemOrder}
            handleAddItemOrder={handleAddItemOrder}
            fieldsItemOrders={fieldsItemOrders}
            setValue={setValue}
          />
        </Grid>
        <Grid container spacing={gridSpacingForm}>
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
