import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import MyAutocompleteFreeSolo from '../../../components/select/MyAutocompleteFreeSolo'
import { validationSchemaOrder } from './validationSchema'
import ItemOrder from '../modalAddNew/ItemOrder'
interface Props {
  open: boolean
  handleClose: () => void
}

export default function FormEditInfoOrder({ open, handleClose }: Props) {
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
    <CustomDialog title={'Sửa thông tin đơn'} open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction={'row'} sx={{ mb: 2 }} spacing={1.5}>
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
