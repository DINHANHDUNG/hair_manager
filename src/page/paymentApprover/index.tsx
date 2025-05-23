import { LibraryAddCheck } from '@mui/icons-material'
import IconSearch from '@mui/icons-material/Search'
import { Grid, OutlinedInput } from '@mui/material'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatNumber, handleMutation } from '../../app/hooks'
import { useApproverPaymentMutation, useGetListPaymentQuery } from '../../app/services/payment'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import LoadingModal from '../../components/ui-component/LoadingModal'
import { gridSpacing } from '../../constants'
import { removeNullOrEmpty } from '../../help'
import { OrderType } from '../../types/order'
import { OrderPaymentType } from '../../types/orderPayment'

const PaymentApproverPage = React.memo(() => {
  // const navigate = useNavigate()

  const dialogs = useDialogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialKey = searchParams.get('key') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey
  })
  const [rowsData, setRowsData] = React.useState<OrderPaymentType[]>()

  // const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticEmployeeDetailQuery({})
  const {
    data: dataApiOrder,
    isLoading: isLoadingOrder,
    refetch
  } = useGetListPaymentQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters
    })
  )
  const [approvalOrder, { isLoading: isLoadingApproval, isSuccess: isSuccessApproval, isError: isErrorApproval }] =
    useApproverPaymentMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiOrder?.data?.totalCount || 0

  //End filter

  // const handleClickOpenForm = () => {
  //   // setOpenFormAdd(true)
  //   navigate(`/${ROUTES.ORDER}/${ROUTES.ORDER_ADD}`)
  // }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    console.log(rowSelectionModel, details)
  }

  // const onRowClick = (params: GridRowParams) => {
  //   console.log('params', params.row)
  // }

  const data = {
    columns: [
      {
        field: 'stt',
        headerName: 'No.',
        width: 30
      },
      {
        field: 'code',
        headerName: 'Mã đơn hàng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<OrderPaymentType, number>) =>
          params?.row?.orderId ? params?.row?.order?.code : ''
      },

      {
        field: 'money',
        headerName: 'Số tiền',
        flex: 1,
        renderCell: (params: GridRenderCellParams<OrderPaymentType, number>) =>
          params.row.money ? formatNumber(Number(params.row.money)) : ''
      },
      {
        field: 'methodPayment',
        headerName: 'Phương thức thanh toán',
        flex: 1
      },
      {
        field: 'bankAccount',
        headerName: 'Ngân hàng',
        flex: 1
      },
      {
        field: 'datePayment',
        headerName: 'Ngày thanh toán',
        flex: 1,
        renderCell: (params: GridRenderCellParams<OrderPaymentType, number>) =>
          params.row.datePayment ? dayjs(params.row.datePayment).format('DD/MM/YYYY') : ''
      },
      // {
      //   field: 'sttAppr',
      //   headerName: 'Trạng thái duyệt',
      //   flex: 1,
      //   renderCell: (params: GridRenderCellParams) => {
      //     const status = params.row.isDelete
      //     if (status === null) return null

      //     return (
      //       <Chip
      //         label={status ? 'Duyệt' : 'Từ chối'}
      //         sx={{
      //           backgroundColor: status ? '#4CAF50' : '#F44336',
      //           color: '#ffffff',
      //           fontWeight: 500
      //         }}
      //         size='small'
      //         variant='outlined'
      //       />
      //     )
      //   }
      // },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        getActions: (params: GridRenderCellParams<OrderPaymentType, number>) => {
          return !params.row.isApprove
            ? [
                <GridActionsCellItem
                  icon={<LibraryAddCheck />}
                  label='Approver'
                  className='textPrimary'
                  color='inherit'
                  onClick={() => handleApprover(params.row.id)}
                />
              ]
            : []
        }
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      // case 'numberphone':
      //   return {
      //     ...colDef,
      //     minWidth: 150
      //   }
      // case 'email':
      //   return {
      //     ...colDef,
      //     minWidth: 150
      //   }
      case 'stt':
        return {
          ...colDef,
          width: 30
        }
      default:
        return {
          ...colDef,
          minWidth: 150
        }
    }
  }

  const columns: GridColDef[] = React.useMemo(
    () => data.columns.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  const handleApprover = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn phê duyệt đơn này không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      approvalOrder({ id: id })
    }
  }

  React.useEffect(() => {
    // Tạo một object params rỗng
    const params: { [key: string]: string } = {}

    // Tạo một mảng các trường cần kiểm tra
    const fields = {
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
      ...filters
    } as { [key: string]: string } // Sử dụng type assertion

    // Lặp qua các trường và chỉ thêm vào params nếu trường đó hợp lệ
    Object.keys(fields).forEach((field) => {
      const value = fields[field]
      if (value) {
        params[field] = value
      }
    })

    setSearchParams(params)
  }, [paginationModel, filters, setSearchParams])

  React.useEffect(() => {
    if (!isLoadingApproval) {
      handleMutation({
        successMessage: 'Thao tác thành công',
        errorMessage: 'Thao tác không thành công',
        isError: isErrorApproval,
        isSuccess: isSuccessApproval,
        loading: isLoadingApproval,
        refetch
      })
    }
  }, [isLoadingApproval])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiOrder?.data?.rows?.map((row: OrderType, index: number) => ({
        ...row,
        stt: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiOrder])

  return (
    <>
      <MainCard title={'Danh sách phê duyệt'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder={'Tìm kiếm...'}
              value={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
              fullWidth
            />
            {/* <Tooltip ref={anchorRef} title='Lọc theo trường'>
              <IconButton color='inherit' size='small' onClick={handleToggle}>
                <SettingsOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip> */}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              {/* <MyButton component='label' role={undefined} variant='outlined' tabIndex={-1} sx={{ mr: 1 }}>
                Import file
                <VisuallyHiddenInput type='file' onChange={handleImport} ref={fileRef} />
              </MyButton>
              <Link to={URL_FILE_EXCEL_EMPLOYEE} target='_blank'>
                <MyButton component='label' variant='outlined' sx={{ mr: 1 }}>
                  Tải file mẫu
                </MyButton>
              </Link> */}
            </div>
          </Grid>
        </Grid>

        <div style={{ width: '100%', overflow: 'auto', marginTop: '20px' }}>
          <TableDataGrid
            // key={rowTotal}
            rows={rows}
            columns={columns}
            isLoading={isLoadingOrder}
            paginationModel={paginationModel}
            setPaginationModel={(model) => {
              setPaginationModel(model)
            }}
            onRowSelectionChange={onRowSelectionChange}
            // onRowClick={onRowClick}
            // checkboxSelection
            filterMode='server'
            headerFilters={false}
            totalCount={rowTotal}
            pinnedColumns={{ right: ['actions'] }}
            pagination
          />
        </div>
      </MainCard>
      {/* <SelectColumn
        handleComfirm={(value) => {
          handleFilterChange('key', value)
          setOpenFilter(false)
        }}
        value={filters?.key}
        list={listFilter}
        open={openFilter}
        anchorRef={anchorRef}
        handleClose={handleClose}
      /> */}
      <LoadingModal open={isLoadingOrder} />
    </>
  )
})

export default PaymentApproverPage
