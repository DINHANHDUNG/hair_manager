import { DoDisturbAlt, LibraryAddCheck } from '@mui/icons-material'
import IconSearch from '@mui/icons-material/Search'
import { Chip, Grid, OutlinedInput } from '@mui/material'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleMutation } from '../../app/hooks'
import { useGetListOrderQuery, useUpdateOrderCancelApprovalMutation } from '../../app/services/order'
import { OPTIONS_ORDER_KEY } from '../../common/contants'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import LoadingModal from '../../components/ui-component/LoadingModal'
import { gridSpacing } from '../../constants'
import { removeNullOrEmpty } from '../../help'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { EmployeeType } from '../../types/employee'
import { OrderType } from '../../types/order'
import FormAddEditInvoice from '../order/modalInvoice'
import FormReject from './FormReject'

const CancelOrderPage = React.memo(() => {
  const navigate = useNavigate()

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
  const [rowsData, setRowsData] = React.useState<EmployeeType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [modalInvoice, setModalInvoice] = React.useState(false)
  const [modalReject, setModalReject] = React.useState(false)
  const [orderId, setOrderId] = React.useState<number | undefined>()
  // const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticEmployeeDetailQuery({})
  const {
    data: dataApiOrder,
    isLoading: isLoadingOrder,
    refetch
  } = useGetListOrderQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      statusOrder: OPTIONS_ORDER_KEY.CANCEL
    })
  )
  const [
    approvalOrder,
    { isLoading: isLoadingApproval, isSuccess: isSuccessApproval, isError: isErrorApproval, error: errorApproval }
  ] = useUpdateOrderCancelApprovalMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiOrder?.data?.totalCount || 0

  //End filter

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleModalInvoice = () => {
    setModalInvoice(!modalInvoice)
  }

  const handleModalReject = (id?: number) => {
    setModalReject(!modalReject)
    setOrderId(id)
  }

  const handleClickOpenForm = () => {
    // setOpenFormAdd(true)
    navigate(`/${ROUTES.ORDER}/${ROUTES.ORDER_ADD}`)
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    console.log(rowSelectionModel, details)
  }

  const onRowClick = (params: GridRowParams) => {
    console.log('params', params.row)
    handleClickDetail()
  }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'code', headerName: 'Mã đơn hàng', flex: 1 },
      {
        field: 'amount',
        headerName: 'Số tiền cần thanh toán',
        flex: 1
      },
      {
        field: 'paidAmount',
        headerName: 'Số tiền đã thanh toán',
        flex: 1
      },
      {
        field: 'paymentStatus',
        headerName: 'Trạng thái thanh toán',
        flex: 1
      },
      {
        field: 'reasonCancel',
        headerName: 'Lý do từ chối',
        flex: 1
      },
      {
        field: 'sttAppr',
        headerName: 'Trạng thái duyệt',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const status = params.row.isDelete
          if (status === null) return null

          return (
            <Chip
              label={status ? 'Duyệt' : 'Từ chối'}
              sx={{
                backgroundColor: status ? '#4CAF50' : '#F44336',
                color: '#ffffff',
                fontWeight: 500
              }}
              size='small'
              variant='outlined'
            />
          )
        }
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        getActions: (params: GridRenderCellParams<any, number>) => {
          return params.row.isDelete === null
            ? [
                <GridActionsCellItem
                  icon={<LibraryAddCheck />}
                  label='Approver'
                  className='textPrimary'
                  color='inherit'
                  onClick={() =>
                    approvalOrder({
                      id: params.row.id,
                      isDelete: true
                    })
                  }
                />,
                <GridActionsCellItem
                  icon={<DoDisturbAlt />}
                  label='Delete'
                  className='textPrimary'
                  color='inherit'
                  onClick={() => handleModalReject(params.row.id)}
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
      case 'order':
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
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiOrder])

  return (
    <>
      <MainCard title={'Danh sách hủy'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder={'Tìm kiếm theo mã đơn hàng'}
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
            onRowClick={onRowClick}
            // checkboxSelection
            filterMode='server'
            headerFilters={false}
            totalCount={rowTotal}
            pinnedColumns={{ right: ['actions'] }}
          />
        </div>
      </MainCard>
      <FormAddEditInvoice handleClose={handleModalInvoice} open={modalInvoice} />
      <FormReject orderId={orderId} handleClose={handleModalReject} open={modalReject} />
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

export default CancelOrderPage
