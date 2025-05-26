import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, IconButton, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import SubmitButton from '../../../components/button/SubmitButton'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import SubCard from '../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../constants'
//Icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { handleMutation, useHasPermission } from '../../../app/hooks'
import {
  useAddOrderHistoryMutation,
  useGetListInvoiceHistoryQuery,
  useGetListOrderHistoryQuery,
  useUpdateOrderHistoryMutation
} from '../../../app/services/order'
import { OPTIONS_STATUS_HISTORY_PROD } from '../../../common/contants'
import MyAutocompleteFreeSolo from '../../../components/select/MyAutocompleteFreeSolo'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../components/toast'
import { Perm_Order_HistoryPrd_Add } from '../../../help/permission'
import { ErrorType } from '../../../types'
import { InvoiceRepairType } from '../../../types/invoiceRepair'
import { FieldCOrderHistory, HistoryProductionType, OrderType } from '../../../types/order'

interface Props {
  open: boolean
  handleClose: () => void
  itemSelectedEdit?: OrderType
  itemSelectedInvoice?: InvoiceRepairType
  refetch?: () => void
}

type FormValues = {
  date?: string
  status: string
}

const validationSchema = yup.object({
  status: yup.string().required('Trường này là bắt buộc').max(255, 'Độ dài không được quá 255'),

  // date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
  date: yup.string()
})

export default function ModalProductionHistory(Props: Props) {
  const { open, handleClose, itemSelectedEdit, itemSelectedInvoice, refetch } = Props
  const permAdd = useHasPermission(Perm_Order_HistoryPrd_Add)
  const idOrder = itemSelectedEdit?.id
  const idInvoice = itemSelectedInvoice?.id
  // const dialogs = useDialogs()
  const {
    data: fetchData,
    isLoading,
    refetch: refetchOrder
  } = useGetListOrderHistoryQuery(
    {
      orderId: idOrder || 0
    },
    {
      skip: !idOrder
    }
  )

  const {
    data: fetchDataInvoice,
    isLoading: isLoadingInvoice,
    refetch: refetchInvoice
  } = useGetListInvoiceHistoryQuery(
    {
      idInvoice: idInvoice || 0
    },
    {
      skip: !idInvoice
    }
  )

  const [addOrder, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddOrderHistoryMutation()
  const [
    updateOrder,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateOrderHistoryMutation()
  // const [deleteOrder, { isLoading: loadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete }] =
  //   useDeleteOrderHistoryMutation()

  // const listData = fetchData?.data as Array<HistoryProductionType>

  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [rowsData, setRowsData] = useState<HistoryProductionType[]>()
  const rows: GridRowsProp = rowsData || []
  const rowTotal = 0

  const data = [
    {
      field: 'order',
      headerName: 'No.',
      // flex: 1,
      width: 50
    },
    {
      field: 'date',
      headerName: 'Ngày',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<HistoryProductionType, number>) =>
        params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
    },
    {
      field: 'status',
      headerName: 'Nội dung',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.row.status || ''
        return status
      }
    }
    // {
    //   field: 'actions',
    //   headerName: 'Hành động',
    //   type: 'actions',
    //   flex: 1,
    //   minWidth: 150,
    //   getActions: (param: GridRenderCellParams<HistoryProductionType, number>) => [
    //     <GridActionsCellItem
    //       icon={<EditOutlinedIcon />}
    //       label='edit'
    //       className='textPrimary'
    //       color='inherit'
    //       onClick={() => editItem(param.row)}
    //     />,
    //     <GridActionsCellItem
    //       onClick={() => handleDelete(param.row.id)}
    //       icon={<DeleteOutlinedIcon />}
    //       label='Delete'
    //       className='textPrimary'
    //       color='inherit'
    //     />
    //   ]
    // }
  ]

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      default:
        return colDef
    }
  }

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data])

  const addItem = () => {
    setIdUpdate(0)
    reset()
    // clearErrors()
    // scrollFormAddEdit()
  }

  // const handleDelete = async (id: number) => {
  //   const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
  //     title: 'Xác nhận lại',
  //     okText: 'Có',
  //     cancelText: 'Hủy'
  //   })
  //   if (confirmed) {
  //     deleteOrder({ ids: [Number(id)] })
  //   }
  // }

  // const editItem = (item: HistoryProductionType) => {
  //   setIdUpdate(item.id)
  //   setValue('date', dayjs(item.date).toString())
  //   setValue('status', item.status)
  //   clearErrors()
  //   // scrollFormAddEdit()
  // }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    // clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // const date = moment(data.date).startOf('day')
    const date = moment().startOf('day')
    const isoDateStr = date?.toISOString()
    const newData = { ...data, date: isoDateStr, orderId: idOrder || null, invoiceRepairId: idInvoice || null }
    if (idUpdate && idUpdate > 0) {
      updateOrder({ ...newData, id: idUpdate })
      return
    }
    addOrder({ ...newData })
  }

  useEffect(() => {
    reset()
  }, [open])

  useEffect(() => {
    if (!isLoading) {
      // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
      const updatedRows =
        fetchData?.data?.map((row: HistoryProductionType, index: number) => ({
          ...row,
          order: paginationModel.page * paginationModel.pageSize + index + 1
        })) || []

      setRowsData(updatedRows)
    }
  }, [fetchData, isLoading])

  useEffect(() => {
    if (!isLoadingInvoice) {
      // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
      const updatedRows =
        fetchDataInvoice?.data?.map((row: HistoryProductionType, index: number) => ({
          ...row,
          order: paginationModel.page * paginationModel.pageSize + index + 1
        })) || []

      setRowsData(updatedRows)
    }
  }, [fetchDataInvoice, isLoadingInvoice])

  useEffect(() => {
    if (!loadingAdd) {
      const newError = error as ErrorType<FieldCOrderHistory>
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
        refetch: () => {
          reset()
          refetch?.()
          idOrder && refetchOrder()
          idInvoice && refetchInvoice()
        }
      })
    }
  }, [loadingAdd])

  useEffect(() => {
    if (!loadingUpdate) {
      const newError = errorUpdate as ErrorType<FieldCOrderHistory>
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
          refetchOrder()
          refetch?.()
        }
      })
    }
  }, [loadingUpdate])

  // useEffect(() => {
  //   handleMutation({
  //     successMessage: 'Thao tác thành công',
  //     errorMessage: 'Thao tác không thành công',
  //     isError: isErrorDelete,
  //     isSuccess: isSuccessDelete,
  //     loading: loadingDelete,
  //     refetch: () => {
  //       refetchOrder()
  //     }
  //   })
  // }, [loadingDelete])

  return (
    <CustomDialog
      title={idOrder ? 'Lịch sử sản xuất' : 'Lịch sử sửa đơn'}
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
    >
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={permAdd ? 8 : 12} xl={permAdd ? 8 : 12} sx={{ mb: 3 }}>
          <SubCard
            title={
              <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
                <Typography variant='h5'>{idOrder ? 'Lịch sử sản xuất' : 'Lịch sử sửa đơn'}</Typography>

                {permAdd && (
                  <div>
                    <IconButton color='inherit' size='small' onClick={() => addItem()}>
                      <AddCircleOutlineIcon fontSize='inherit' />
                    </IconButton>
                    {/* <IconButton color='inherit' size='small' onClick={() => setTypeList(!typeList)}>
                    {typeList ? <FormatListNumberedRtlIcon fontSize='inherit' /> : <AppsIcon fontSize='inherit' />}
                  </IconButton> */}
                  </div>
                )}
              </Grid>
            }
          >
            <TableDataGrid
              rows={rows}
              columns={columns}
              isLoading={false}
              paginationModel={paginationModel}
              setPaginationModel={(model) => {
                setPaginationModel(model)
              }}
              // onRowSelectionChange={onRowSelectionChange}
              // onRowClick={onRowClick}
              // checkboxSelection
              otherProps={{
                getRowHeight: () => 'auto'
              }}
              filterMode='server'
              headerFilters={false}
              totalCount={rowTotal}
            />
          </SubCard>
        </Grid>
        {permAdd && (
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4} sx={{ mb: 3 }}>
            <SubCard title={`${idUpdate ? 'Cập nhật' : 'Thêm'} lịch sử sản xuất`}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={gridSpacingForm}>
                  {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                    <MyDatePicker
                      name='date'
                      control={control}
                      label='Ngày'
                      errors={errors}
                      variant='outlined'
                      //   defaultValue={dayjs()}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <MyAutocompleteFreeSolo
                      name={`status`}
                      control={control}
                      errors={errors}
                      options={OPTIONS_STATUS_HISTORY_PROD ?? []}
                      // title='Nội dung'
                      label='Nội dung'
                      placeholder='Chọn nội dung'
                      size='small'
                      fullWidth
                      require
                      onChange={(_, v) => {
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        const selectedValue = v as any // Ép kiểu cho giá trị v
                        /* eslint-enable @typescript-eslint/no-explicit-any */
                        setValue(`status`, selectedValue ? selectedValue?.label?.toString() : '') // set đúng giá trị của `value`
                      }}
                    />
                  </Grid>
                  {permAdd && (
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
                      <SubmitButton
                        variant='contained'
                        sx={{ float: 'right' }}
                        loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
                      >
                        {idUpdate ? 'Cập nhật' : 'Thêm'}
                      </SubmitButton>
                    </Grid>
                  )}
                </Grid>
              </form>
            </SubCard>
          </Grid>
        )}
      </Grid>
    </CustomDialog>
  )
}
