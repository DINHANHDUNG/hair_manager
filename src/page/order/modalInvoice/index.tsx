import { yupResolver } from '@hookform/resolvers/yup'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import { RiAddLine, RiDeleteBin7Line } from '@remixicon/react'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect } from 'react'
import { ErrorOption, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { handleMutation } from '../../../app/hooks'
import {
  useAddInvoiceRepairMutation,
  useGetInvoiceRepairByIdQuery,
  useUpdateInvoiceRepairMutation,
  useUploadFileInvoiceRepairMutation
} from '../../../app/services/invoiceRepair'
import { COLORS } from '../../../common/colors'
import { FILE_ACCEPT_TYPES, STATUS_SUCCESS } from '../../../common/contants'
import MyButton from '../../../components/button/MyButton'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import ReactDropzone from '../../../components/reactDropzone'
import Toast from '../../../components/toast'
import { gridSpacingForm } from '../../../constants'
import { getUrlImage } from '../../../help/localHelp'
import { requiredString } from '../../../help/validate'
import { ErrorType } from '../../../types'
import {
  FieldCInvoiceRepair,
  FormValuesInvoiceRepair,
  ImageUploadInvoiceRepairType,
  InvoiceRepairType
} from '../../../types/invoiceRepair'

interface Props {
  open: boolean
  handleClose: () => void
  orderId?: number
  itemSelectedEdit?: InvoiceRepairType
}

const contentInvoiceRepairsSchema = yup.object().shape({
  content: requiredString()
})

const validationSchema = yup.object({
  reasonRepair: requiredString('Lý do sửa đơn'),
  // noteRepair: requiredString('Lý do sửa đơn'),
  contentInvoiceRepairs: yup.array().of(contentInvoiceRepairsSchema)
})

export default function FormAddEditInvoice({ open, handleClose, orderId, itemSelectedEdit }: Props) {
  const invoiceRepairId = itemSelectedEdit?.id
  const [addInvoiceRepair, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddInvoiceRepairMutation()
  const [
    updateInvoiceRepair,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateInvoiceRepairMutation()
  const [uploadImage, { isLoading: loadingUploadImage }] = useUploadFileInvoiceRepairMutation()
  const {
    data: fetchData,
    isLoading,
    refetch: refetch
  } = useGetInvoiceRepairByIdQuery(
    {
      invoiceRepairId: invoiceRepairId || 0
    },
    {
      skip: !invoiceRepairId
    }
  )

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<FormValuesInvoiceRepair>({
    resolver: yupResolver(validationSchema),
    // context: { permAddEditPaymentAcc },
    defaultValues: {
      reasonRepair: '',
      dateRepair: dayjs().toISOString(),
      contentInvoiceRepairs: [
        {
          content: '',
          imageUploads: []
        }
      ]
    }
  })

  const dateEdit = getValues('dateRepair') || ''

  const {
    fields: fieldsInvoices,
    append: appendInvoices,
    remove: removeInvoices
  } = useFieldArray({
    control,
    name: 'contentInvoiceRepairs' // Array field name
  })

  const handleAddInvoice = () => {
    appendInvoices({
      content: '',
      imageUploads: []
    })
  }

  const handleDeleteInvoice = (index: number) => {
    removeInvoices(index)
  }

  // const downloadImage = (image: ImageUploadInvoiceRepairType) => {
  //   const link = getUrlImage(image?.fileName || '', image?.path || '')
  //   handleDownload(link, image.fileName)
  // }

  const deleteImage = (index: number, indexToDelete: number) => {
    const currentImages = getValues(`contentInvoiceRepairs.${index}.imageUploads`) || []
    const updated = currentImages.filter((_, idx) => idx !== indexToDelete)
    setValue(`contentInvoiceRepairs.${index}.imageUploads`, updated, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<FormValuesInvoiceRepair> = (value) => {
    console.log('Submitted Data: ', value, orderId)
    //Thêm ngày //Thêm OrderId
    const date = moment(value.dateRepair).startOf('day')
    const isoDateStr = date?.toISOString()
    if (invoiceRepairId) {
      updateInvoiceRepair({
        id: invoiceRepairId,
        orderId: orderId,
        dateRepair: isoDateStr,
        ...value
      })
      return
    }
    // Call API or handle save action
    addInvoiceRepair({
      orderId: orderId,
      dateRepair: isoDateStr,
      ...value
    })
  }

  const handleDropImage = (files: File[], index: number) => {
    // inside handleDropImage
    const currentImages = getValues(`contentInvoiceRepairs.${index}.imageUploads`) || []
    if (currentImages.length + files.length > 4) {
      return Toast({ text: 'Tối đa 4 ảnh mỗi mục', variant: 'error' })
    }
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    uploadImage(formData).then((res) => {
      if (res.data.status === STATUS_SUCCESS) {
        const uploaded = res.data.data
        setValue(`contentInvoiceRepairs.${index}.imageUploads`, [...currentImages, ...uploaded])
      }
    })
  }

  useEffect(() => {
    if (!loadingAdd) {
      const newError = error as ErrorType<FieldCInvoiceRepair>
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

  useEffect(() => {
    if (!loadingUpdate) {
      const newError = errorUpdate as ErrorType<FieldCInvoiceRepair>
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
        isError: isErrorUpdate,
        isSuccess: isSuccessUpdate,
        loading: loadingUpdate,
        refetch: () => {
          handleClose()
          refetch()
        }
      })
    }
  }, [loadingUpdate])

  useEffect(() => {
    if (!open) {
      reset()
    }
    if (open && invoiceRepairId) {
      refetch()
    }
  }, [open, reset])

  useEffect(() => {
    if (!isLoading && fetchData?.data && invoiceRepairId) {
      const newData = fetchData?.data
      setValue('contentInvoiceRepairs', newData?.contentInvoiceRepairs || '')
      setValue('reasonRepair', newData?.reasonRepair || '')
      setValue('noteRepair', newData?.noteRepair || '')
      setValue('dateRepair', dayjs(newData?.dateRepair).toISOString())
      // setValue('noteRefund', newData?.noteRefund || '')
      // setValue('statusRefund', newData?.statusRefund)
    }
  }, [isLoading, fetchData, open])

  return (
    <CustomDialog
      title={invoiceRepairId ? 'Cập nhật invoice chỉnh sửa' : 'Tạo invoice chỉnh sửa'}
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >
      <form id='form-add-new-customer' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={gridSpacingForm}>
          <Grid item xs={12}>
            Ngày yêu cầu sửa đơn: {moment(dateEdit).format('DD/MM/YYYY').toString()}
          </Grid>
          <Grid item xs={12}>
            <MyTextField
              name={`reasonRepair`}
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
              name={`noteRepair`}
              control={control}
              errors={errors}
              title='Ghi chú sửa đơn'
              variant='outlined'
              size='small'
              placeholder='Nhập ghi chú sửa đơn'
              multiline
              rows={3}
              // require
            />
          </Grid>
          {fieldsInvoices?.map((field, index) => {
            const currentImages = watch(`contentInvoiceRepairs.${index}.imageUploads`) || []
            return (
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
                        name={`contentInvoiceRepairs.${index}.content`}
                        control={control}
                        errors={errors}
                        title='Nội dung'
                        variant='outlined'
                        size='small'
                        placeholder='Nhập nội dung'
                        multiline
                        rows={3}
                        require
                        messageErrors={errors?.contentInvoiceRepairs?.[index]?.content?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ReactDropzone
                        control={control}
                        errors={errors}
                        name={`contentInvoiceRepairs.${index}.imageUploads`}
                        maxImage={5}
                        onDropCallback={(e) => handleDropImage(e, index)}
                        disabled={loadingUploadImage}
                        accept={{
                          ...FILE_ACCEPT_TYPES.images
                        }}
                        // messageErrors={errors?.contentInvoiceRepairs?.[index]?.image?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        {currentImages.length > 0 &&
                          currentImages.map((file: ImageUploadInvoiceRepairType, idx: number) => {
                            const imageUrl = getUrlImage(file?.fileName || '', file?.path || '')
                            return (
                              <Grid item xs={3} key={file?.fileName || '' + idx}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    height: '183px',
                                    width: '100%',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    '&:hover .hover-actions': {
                                      opacity: 1
                                    }
                                  }}
                                >
                                  <Box
                                    component='img'
                                    src={imageUrl}
                                    alt={file.fileName}
                                    sx={{
                                      height: '100%',
                                      width: '100%',
                                      objectFit: 'cover',
                                      display: 'block'
                                    }}
                                  />
                                  <Box
                                    className='hover-actions'
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      p: 1,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 1,
                                      opacity: 0,
                                      transition: 'opacity 0.2s ease-in-out',
                                      backgroundColor: 'rgba(0,0,0,0.4)',
                                      borderBottomLeftRadius: 8
                                    }}
                                  >
                                    <IconButton
                                      size='small'
                                      href={imageUrl}
                                      target='_blank'
                                      // onClick={() => handleZoomImage(imageUrl)}
                                      sx={{ color: '#fff' }}
                                    >
                                      <ZoomInIcon fontSize='small' />
                                    </IconButton>
                                    {/* <IconButton
                                      size='small'
                                      component='a'
                                      sx={{ color: '#fff' }}
                                      onClick={() => downloadImage(file)}
                                    >
                                      <DownloadIcon fontSize='small' />
                                    </IconButton> */}
                                    <IconButton
                                      size='small'
                                      sx={{ color: '#fff' }}
                                      onClick={() => deleteImage(index, idx)}
                                    >
                                      <DeleteForeverIcon fontSize='small' />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Grid>
                            )
                          })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            )
          })}
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
