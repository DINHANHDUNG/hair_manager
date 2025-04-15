import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Button, Grid, OutlinedInput, Typography } from '@mui/material'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../constants'
import { PartnerType } from '../../types/partner'
import { useDialogs } from '@toolpad/core'
import { useDeletePartnerMutation, useGetListPartnerQuery } from '../../app/services/partner'
import Toast from '../../components/toast'
import { IconAB2 } from '@tabler/icons-react'
import moment from 'moment'
import { GridColumnGroupingModel } from '@mui/x-data-grid'

const ReportTotalPage = React.memo(() => {
  const dialogs = useDialogs()
  //   const navigate = useNavigate()
  //   const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey
  })

  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<PartnerType>()
  const [rowsData, setRowsData] = React.useState<PartnerType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openFormChangeStaff, setOpenFormChangeStaff] = React.useState(false)

  const {
    data: dataApiPartner,
    isLoading,
    refetch
  } = useGetListPartnerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const [deletePartner, { isLoading: loadingDelete, isSuccess, isError }] = useDeletePartnerMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiPartner?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
    setItemSelectedEidt({} as PartnerType)
  }

  const handleClickOpenFormChangeStaff = () => {
    setOpenFormChangeStaff(true)
  }

  const handleCloseFormChangeStaff = () => {
    setOpenFormChangeStaff(false)
    setItemSelectedEidt({} as PartnerType)
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

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deletePartner({ ids: [Number(id)] })
    }
  }

  const fakeData = [
    {
      id: 1,
      order: 1,
      sale: 'Nguyễn Văn A',
      date: '2025-04-10',
      code: 'ORD001',
      kg: 12,
      money: 240,
      discount: 10,
      moneyShip: 15,
      wigFee: 5,
      paypalFree: 3,
      moneyTotal: 253,
      refunMoney: 150,
      amountReceived: 253,
      wantage: 0,
      payment: 'Chuyển khoản',
      receivingAccount: 'VCB - 123456789',
      status: 'done'
    },
    {
      id: 2,
      order: 2,
      sale: 'Trần Thị B',
      date: '2025-04-12',
      code: 'ORD002',
      kg: 8.5,
      money: 170,
      discount: 5,
      moneyShip: 10,
      wigFee: 0,
      paypalFree: 2,
      moneyTotal: 177,
      refunMoney: 100,
      amountReceived: 177,
      wantage: 0,
      payment: 'Tiền mặt',
      receivingAccount: 'Techcombank - 987654321',
      status: 'done'
    },
    {
      id: 3,
      order: 3,
      sale: 'Lê Văn C',
      date: '2025-04-14',
      code: 'ORD003',
      kg: 5,
      money: 100,
      discount: 0,
      moneyShip: 8,
      wigFee: 2,
      paypalFree: 1,
      moneyTotal: 109,
      refunMoney: 50,
      amountReceived: 100,
      wantage: 9,
      payment: 'Paypal',
      receivingAccount: 'Paypal - levan@example.com',
      status: 'partial'
    }
  ]

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'sale', headerName: 'Tên khách hàng' },
      {
        field: 'date',
        headerName: 'Ngày',

        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
      },
      { field: 'code', headerName: 'Đơn số' },
      { field: 'kg', headerName: 'Số kg' },
      { field: 'money', headerName: 'Tiền hàng (USD)' },
      { field: 'discount', headerName: 'Discount' },
      { field: 'moneyShip', headerName: 'Tiền ship (USD)' },
      { field: 'wigFee', headerName: 'Wig Fee/ Fast production' },
      { field: 'paypalFree', headerName: 'Paypal Free' },
      { field: 'moneyTotal', headerName: 'Tổng tiền đơn (USD)' },

      {
        field: 'refunMoney1',
        headerName: 'Lần 1',
        renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      {
        field: 'refunMoney2',
        headerName: 'Lần 2',
        renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      {
        field: 'refunMoney3',
        headerName: 'Lần 3',
        renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      { field: 'amountReceived', headerName: 'Số tiền thực nhận' },
      { field: 'wantage', headerName: 'Số tiền khách thiếu (USD)' },
      { field: 'payment', headerName: 'Phương thức TT' },
      { field: 'receivingAccount', headerName: 'Tài khoản nhận' },
      {
        field: 'status',
        headerName: 'Tài khoản nhận',
        renderCell: (params: GridRenderCellParams<any, number>) => 'Đã trả hết'
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      case 'phoneNumber':
      case 'representativePhone':
        return {
          ...colDef,
          minWidth: 150
        }
      default:
        return {
          ...colDef,
          minWidth: 120
        }
    }
  }

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: 'Thông tin các đơn hàng',
      description: 'Thông tin các đơn hàng',
      renderHeaderGroup: (params) => <Typography variant='h6' textAlign={'center'} fontSize={18}>{params.description}</Typography>,

      children: [
        { field: 'order' },
        { field: 'sale' },
        { field: 'date' },
        { field: 'code' },
        { field: 'kg' },
        { field: 'money' },
        { field: 'discount' },
        { field: 'moneyShip' },
        { field: 'wigFee' },
        { field: 'paypalFree' },
        { field: 'moneyTotal' }
      ]
    },
    {
      groupId: 'Thông tin thanh toán',
      description: 'Thông tin thanh toán',
      renderHeaderGroup: (params) => <Typography variant='h6' textAlign={'center'} fontSize={18}>{params.description}</Typography>,

      children: [
        {
          groupId: 'Số tiền đã trả',
          description: 'Số tiền đã trả',
          children: [{ field: 'refunMoney1' }, { field: 'refunMoney2' }, { field: 'refunMoney3' }]
        },
        { field: 'amountReceived' },
        { field: 'wantage' },
        { field: 'payment' },
        { field: 'receivingAccount' },
        { field: 'status' }
      ]
    }
  ]

  const columns: GridColDef[] = React.useMemo(
    () => data.columns?.map((colDef) => renderColumn(colDef)),
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
      isSuccess && Toast({ text: successMessage, variant: 'success' }) && refetch()
    }
  }

  React.useEffect(() => {
    // Update URL parameters when pagination model changes
    setSearchParams({
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
      searchKey: filters.searchKey
    })
  }, [paginationModel, filters, setSearchParams])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      fakeData?.map((row: any, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [fakeData])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <MainCard title={'Báo cáo chi tiết đơn hàng'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder='Tìm kiếm'
              value={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button variant='outlined' sx={{ mr: 1 }}>
                Xuất excel
              </Button>
            </div>
          </Grid>
        </Grid>

        <div style={{ width: '100%', overflow: 'auto', marginTop: '20px' }}>
          <TableDataGrid
            rows={rows}
            columns={columns}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={(model) => {
              setPaginationModel(model)
            }}
            onRowSelectionChange={onRowSelectionChange}
            onRowClick={onRowClick}
            filterMode='server'
            headerFilters={false}
            totalCount={rowTotal}
            otherProps={{
              columnGroupingModel: columnGroupingModel
            }}
            // otherProps={{
            //   getRowClassName: (params: GridRenderCellParams<PartnerType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>
      </MainCard>
    </>
  )
})

export default ReportTotalPage
