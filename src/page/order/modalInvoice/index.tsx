import { Button, Grid, Stack, Typography } from '@mui/material'
import { Control, FieldArrayWithId, FieldErrors, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { gridSpacingForm } from '../../../constants'
import { FormValuesOrder } from '../../../types/order'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import { RiAddLine, RiDeleteBin7Line } from '@remixicon/react'
import { COLORS } from '../../../common/colors'
import MyTextField from '../../../components/input/MyTextField'
import ReactDropzone from '../../../components/reactDropzone'
import { FILE_ACCEPT_TYPES } from '../../../common/contants'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import { requiredString } from '../../../help/validate'
import * as yup from 'yup'
interface Props {
  open: boolean
  handleClose: () => void
}

const validationSchema = yup.object({
  reason: requiredString('Lý do sửa đơn')
})

export default function FormAddEditInvoice({ open, handleClose }: Props) {
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
    resolver: yupResolver(validationSchema),
    // context: { permAddEditPaymentAcc },
    defaultValues: {
      // itemOrders: [{ name: '', size: '', quantity: '', unit: '', unitPrice: '', money: '' }],
      invoices: [
        { content: '', image: '' },
        { content: '', image: '' }
      ]
    }
  })

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

  return (
    <CustomDialog title={'Tạo invoice chỉnh sửa'} open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12}>
            Ngày yêu cầu sửa đơn: {moment().format('DD/MM/YYYY').toString()}
          </Grid>
          <Grid item xs={12}>
            <MyTextField
              name={`reason`}
              control={control}
              errors={errors}
              title='Lý do sửa đơn'
              variant='outlined'
              size='small'
              placeholder='Nhập lý do sửa đơn'
              multiline
              rows={3}
              require
            />
          </Grid>
          <Grid item xs={12}>
            <MyTextField
              name={`note`}
              control={control}
              errors={errors}
              title='Ghi chú sửa đơn'
              variant='outlined'
              size='small'
              placeholder='Nhập ghi chú sửa đơn'
              multiline
              rows={3}
              require
            />
          </Grid>
          {fieldsInvoices?.map((field, index) => (
            <Grid item xs={12} key={field.id} sx={{ mb: 1 }}>
              <Stack
                spacing={2}
                sx={{
                  backgroundColor: COLORS.gray,
                  padding: '16px',
                  borderRadius: '12px'
                }}
              >
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='h5' color={COLORS.textInput}>
                    Lý do sửa đơn {index + 1}
                  </Typography>
                  <Button
                    sx={{ padding: 0 }}
                    onClick={() => (index === 0 ? handleAddInvoice() : handleDeleteInvoice(index))}
                  >
                    <Typography
                      variant='h6'
                      style={{
                        color: index === 0 ? COLORS.main : COLORS.red,
                        fontWeight: '400',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {index === 0 ? (
                        <>
                          <RiAddLine size={18} style={{ marginRight: '5px' }} /> Thêm
                        </>
                      ) : (
                        <>
                          <RiDeleteBin7Line size={18} style={{ marginRight: '5px' }} /> Xoá
                        </>
                      )}
                    </Typography>
                  </Button>
                </Stack>

                <Grid container>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <MyTextField
                      name={`invoices.${index}.content`}
                      control={control}
                      errors={errors}
                      title='Nội dung'
                      variant='outlined'
                      size='small'
                      placeholder='Nhập nội dung'
                      multiline
                      rows={3}
                      require
                      // messageErrors={errors?.invoices?.[index]?.content?.message}
                    />
                  </Grid>
                  {index === 0 ? (
                    <Grid item xs={12}>
                      <ReactDropzone
                        control={control}
                        errors={errors}
                        name={`invoices.${index}.image`}
                        maxImage={1}
                        // onDropCallback={handleDropImage}
                        // disabled={loadingUploadFile}
                        accept={{
                          ...FILE_ACCEPT_TYPES.images
                        }}
                        // messageErrors={errors?.invoices?.[index]?.image?.message}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <img
                        srcSet={`${'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'}?h=183&fit=crop&auto=format&dpr=2 2x`}
                        src={`${'https://images.unsplash.com/photo-1551782450-a2132b4ba21d'}?h=183&fit=crop&auto=format`}
                        // alt={item.title}
                        style={{ width: '100%', height: '183px', objectFit: 'cover' }}
                        loading='lazy'
                      />
                    </Grid>
                  )}
                </Grid>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </form>
    </CustomDialog>
  )
}
