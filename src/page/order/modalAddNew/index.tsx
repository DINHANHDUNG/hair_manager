import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MyAutocompleteFreeSolo from '../../../components/select/MyAutocompleteFreeSolo'
import ItemOrder from './ItemOrder'
import { validationSchemaOrder } from './validationSchema'
interface Props {
  open: boolean
  handleClose: () => void
}

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

export default function FormAddNewOrder({ open, handleClose }: Props) {
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

  const onSubmit: SubmitHandler<any> = (value) => {
    console.log('Submitted Data: ', value)
    // Call API or handle save action
    // addCustomer({
    //   ...value
    // })
  }

  return (
    <CustomDialog title={'Thêm mới đơn'} open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction={'row'} sx={{ mb: 2 }} spacing={1.5}>
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
      </form>
    </CustomDialog>
  )
}
