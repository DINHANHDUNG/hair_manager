import { AddCircle, FileDownload, Preview } from '@mui/icons-material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Grid, OutlinedInput } from '@mui/material'
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
import moment from 'moment'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHasPermission } from '../../app/hooks'
import { useDeleteInvoiceRepairMutation, useGetListInvoiceRepairQuery } from '../../app/services/invoiceRepair'
import { checkBg, checkColor, OPTIONS_STATUS_ORDER } from '../../common/contants'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../components/toast'
import MainCard from '../../components/ui-component/cards/MainCard'
import Chip from '../../components/ui-component/extended/Chip'
import { gridSpacing } from '../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../help'
import { Perm_Invoice_Add, Perm_Invoice_Edit } from '../../help/permission'
import { InvoiceRepairType } from '../../types/invoiceRepair'
import FormAddEditInvoice from '../order/modalInvoice'

const RequestEditOrderPage = React.memo(() => {
  const permAdd = useHasPermission(Perm_Invoice_Add)
  const permEdit = useHasPermission(Perm_Invoice_Edit)
  // const navigate = useNavigate()

  const dialogs = useDialogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  // const initialKey = searchParams.get('key') || 'code'

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })
  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<InvoiceRepairType>()
  const [orderId, setOrderId] = React.useState<number | undefined>()
  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey
    // key: initialKey
  })
  const [rowsData, setRowsData] = React.useState<InvoiceRepairType[]>()
  const [openDetail, setOpenDetail] = React.useState(false)
  const [modalInvoice, setModalInvoice] = React.useState(false)
  // const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticInvoiceRepairDetailQuery({})

  const [deleteInvoiceRepair, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteInvoiceRepairMutation()
  const {
    data: dataApiInvoiceRepair,
    isLoading,
    refetch
  } = useGetListInvoiceRepairQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      dateFrom: filters.dateFrom ? convertDateToApi(filters.dateFrom) : '',
      dateTo: filters.dateTo ? convertDateToApi(filters.dateTo) : ''
    })
  )

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiInvoiceRepair?.data?.totalCount || 0

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteInvoiceRepair({ ids: [Number(id)] })
    }
  }

  //End filter

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleModalInvoice = (value?: InvoiceRepairType) => {
    if (!modalInvoice === false) {
      setOrderId(undefined)
      setItemSelectedEidt({} as InvoiceRepairType)
      setModalInvoice(!modalInvoice)
      return
    }
    setOrderId(value?.orderId)
    setModalInvoice(!modalInvoice)
  }

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

  const onRowClick = (params: GridRowParams) => {
    console.log('params', params.row)
    handleClickDetail()
  }

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
        renderCell: (params: GridRenderCellParams<InvoiceRepairType, number>) => params.row.code || ''
      },
      {
        field: 'reasonRepair',
        headerName: 'Lý do sửa đơn',
        flex: 1
      },
      {
        field: 'statusOrder',
        headerName: 'Tình trạng bán hàng',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
          if (!status) return null

          return (
            <Chip
              label={status.label}
              sx={{
                backgroundColor: checkBg(status.value),
                color: checkColor(status.value),
                fontWeight: 500
              }}
              size='small'
              variant='outlined'
            />
          )
        }
      },
      {
        field: 'statusManufacture',
        headerName: 'Tình trạng sản xuất',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
          if (!status) return null

          return (
            <Chip
              label={status.label}
              sx={{
                backgroundColor: checkBg(status.value),
                color: checkColor(status.value),
                fontWeight: 500
              }}
              size='small'
              variant='outlined'
            />
          )
        }
      },

      {
        field: 'dateRequest',
        headerName: 'Ngày yêu cầu sửa',
        flex: 1,
        renderCell: (params: GridRenderCellParams<InvoiceRepairType, number>) =>
          params.row.dateRepair ? moment(params.row.dateRepair).format('DD/MM/YYYY') : ''
      },

      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',

        getActions: (params: GridRenderCellParams<InvoiceRepairType, number>) => {
          return [
            permEdit ? (
              <GridActionsCellItem
                icon={<EditOutlinedIcon />}
                label='Edit'
                className='textPrimary'
                color='inherit'
                // onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.WORKER}/${params.id}`)}
                onClick={() => {
                  setItemSelectedEidt(params.row)
                  handleModalInvoice(params.row)
                }}
              />
            ) : (
              <></>
            ),
            <GridActionsCellItem
              onClick={() => handleDelete(params.row.id)}
              icon={<DeleteOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
            />,
            permAdd ? (
              <GridActionsCellItem
                icon={<AddCircle />}
                label='Tạo invoice'
                onClick={() => handleModalInvoice(params.row)}
                showInMenu
              />
            ) : (
              <></>
            ),
            <GridActionsCellItem
              icon={<Preview />}
              label='Preview'
              //  onClick={() => handleModalInvoice()}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<FileDownload />}
              label='Tải đơn'
              // onClick={() => handleModalInvoice()}
              showInMenu
            />
          ]
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

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      if (isSuccess) {
        Toast({ text: successMessage, variant: 'success' })
        refetch()
        // refetchStatic()
      }
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
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiInvoiceRepair?.data?.rows?.map((row: InvoiceRepairType, index: number) => ({
        ...row,
        stt: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiInvoiceRepair])

  return (
    <>
      <MainCard title={'Danh sách yêu cầu sửa'} sx={{ height: '100%' }}>
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
            isLoading={isLoading}
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
            pagination
          />
        </div>
      </MainCard>
      <FormAddEditInvoice
        handleClose={handleModalInvoice}
        open={modalInvoice}
        orderId={orderId}
        itemSelectedEdit={itemSelectedEdit}
      />
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
    </>
  )
})

export default RequestEditOrderPage
