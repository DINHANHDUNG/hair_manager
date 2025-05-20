import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import {
  GridCallbackDetails,
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import dayjs, { Dayjs } from 'dayjs'
import moment from 'moment'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import MonthPickerField from '../../components/dateTime/MonthPickerField'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import { ChipCustom } from '../../components/ui-component/chipCustom'
import { gridSpacing } from '../../constants'
import FilterTableAdvanced from './FilterTableAdvanced'
import { useGetListReportOrderQuery, useLazyExportDetailOrderQuery } from '../../app/services/report'
import Toast from '../../components/toast'
import { removeNullOrEmpty } from '../../help'
import { formatNumber } from '../../app/hooks'
import { ReportOrderType } from '../../types/report'

const ReportTotalPage = React.memo(() => {
  //   const navigate = useNavigate()
  //   const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [month, setMonth] = React.useState<Dayjs | null>(dayjs())

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
  const [rowsData, setRowsData] = React.useState<ReportOrderType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)

  const selectedMonth = month || dayjs()
  const monthCV = selectedMonth.format('MM-YYYY') // không cần momentÇ
  const {
    data: dataApiOrder,
    isLoading
    // refetch
  } = useGetListReportOrderQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      month: monthCV
    })
  )

  const [exportExcelDetail] = useLazyExportDetailOrderQuery()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiOrder?.data?.length || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
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

  // const anchorRef = React.useRef<HTMLDivElement>(null)
  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const anchorAdvancedRef = React.useRef<HTMLDivElement>(null)

  const handleCloseFilterAdvanced = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorAdvancedRef.current && anchorAdvancedRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilterAdvanced(false)
  }

  const exportExcel = async () => {
    try {
      const result = await exportExcelDetail({ month: monthCV }).unwrap()

      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `ChiTietDonHang_${monthCV}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      Toast({
        text: 'Thao tác thành công',
        variant: 'success'
      })
    } catch (error) {
      Toast({
        text: 'Đã xảy ra lỗi vui lòng thử lại',
        variant: 'error'
      })
    }
  }

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
      if (key === 'date') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['dateTo']: '',
          ['dateFrom']: ''
        }))
        return
      }
      handleFilterChange(key, '')
    }
    return (
      label?.length > 0 && (
        <ChipCustom
          size='medium'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 0 }}>
              {label}
              <IconButton color='inherit' size='small' onClick={handleClose}>
                <CloseIcon fontSize='inherit' />
              </IconButton>
            </Box>
          }
        />
      )
    )
  }

  // const fakeData = [
  //   {
  //     id: 1,
  //     order: 1,
  //     sale: 'Nguyễn Văn A',
  //     date: '2025-04-10',
  //     code: 'ORD001',
  //     kg: 12,
  //     money: 240,
  //     discount: 10,
  //     moneyShip: 15,
  //     wigFee: 5,
  //     paypalFree: 3,
  //     moneyTotal: 253,
  //     refunMoney: 150,
  //     amountReceived: 253,
  //     wantage: 0,
  //     payment: 'Chuyển khoản',
  //     receivingAccount: 'VCB - 123456789',
  //     status: 'done'
  //   },
  //   {
  //     id: 2,
  //     order: 2,
  //     sale: 'Trần Thị B',
  //     date: '2025-04-12',
  //     code: 'ORD002',
  //     kg: 8.5,
  //     money: 170,
  //     discount: 5,
  //     moneyShip: 10,
  //     wigFee: 0,
  //     paypalFree: 2,
  //     moneyTotal: 177,
  //     refunMoney: 100,
  //     amountReceived: 177,
  //     wantage: 0,
  //     payment: 'Tiền mặt',
  //     receivingAccount: 'Techcombank - 987654321',
  //     status: 'done'
  //   },
  //   {
  //     id: 3,
  //     order: 3,
  //     sale: 'Lê Văn C',
  //     date: '2025-04-14',
  //     code: 'ORD003',
  //     kg: 5,
  //     money: 100,
  //     discount: 0,
  //     moneyShip: 8,
  //     wigFee: 2,
  //     paypalFree: 1,
  //     moneyTotal: 109,
  //     refunMoney: 50,
  //     amountReceived: 100,
  //     wantage: 9,
  //     payment: 'Paypal',
  //     receivingAccount: 'Paypal - levan@example.com',
  //     status: 'partial'
  //   }
  // ]

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'customerName', headerName: 'Tên khách hàng' },
      {
        field: 'dateOrder',
        headerName: 'Ngày',

        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.dateOrder ? moment(params.row.dateOrder).format('DD/MM') : ''
      },
      { field: 'code', headerName: 'Đơn số' },
      {
        field: 'totalWeight',
        headerName: 'Số kg',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.totalWeight ? formatNumber(Number(params.row.totalWeight)) : ''
      },
      {
        field: 'totalPrice',
        headerName: 'Tiền hàng (USD)',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.totalPrice ? formatNumber(Number(params.row.totalPrice)) : ''
      },
      {
        field: 'discount',
        headerName: 'Discount',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.discount ? formatNumber(Number(params.row.discount)) : ''
      },
      {
        field: 'feeShip',
        headerName: 'Tiền ship (USD)',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.feeShip ? formatNumber(Number(params.row.feeShip)) : ''
      },
      {
        field: 'feeWig',
        headerName: 'Wig Fee/ Fast production',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.feeWig ? formatNumber(Number(params.row.feeWig)) : ''
      },
      {
        field: 'feePaypal',
        headerName: 'Paypal Free',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.feePaypal ? formatNumber(Number(params.row.feePaypal)) : ''
      },
      {
        field: 'totalOrder',
        headerName: 'Tổng tiền đơn (USD)',
        renderCell: (params: GridRenderCellParams<any, number>) =>
          params.row.totalOrder ? formatNumber(Number(params.row.totalOrder)) : ''
      },

      {
        field: 'refunMoney1',
        headerName: 'Lần 1'
        // renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      {
        field: 'refunMoney2',
        headerName: 'Lần 2'
        // renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      {
        field: 'refunMoney3',
        headerName: 'Lần 3'
        // renderCell: (params: GridRenderCellParams<any, number>) => '200USD'
      },
      { field: 'amountReceived', headerName: 'Số tiền thực nhận' },
      { field: 'wantage', headerName: 'Số tiền khách thiếu (USD)' },
      { field: 'payment', headerName: 'Phương thức TT' },
      { field: 'receivingAccount', headerName: 'Tài khoản nhận' },
      {
        field: 'status',
        headerName: 'Tài khoản nhận'
        // renderCell: (params: GridRenderCellParams<any, number>) => 'Đã trả hết'
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
      renderHeaderGroup: (params) => (
        <Typography variant='h6' textAlign={'center'} fontSize={18}>
          {params.description}
        </Typography>
      ),

      children: [
        { field: 'order' },
        { field: 'customerName' },
        { field: 'dateOrder' },
        { field: 'code' },
        { field: 'totalWeight' },
        { field: 'totalPrice' },
        { field: 'discount' },
        { field: 'feeShip' },
        { field: 'feeWig' },
        { field: 'feePaypal' },
        { field: 'totalOrder' }
      ]
    },
    {
      groupId: 'Thông tin thanh toán',
      description: 'Thông tin thanh toán',
      renderHeaderGroup: (params) => (
        <Typography variant='h6' textAlign={'center'} fontSize={18}>
          {params.description}
        </Typography>
      ),

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
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiOrder?.data?.map((row: any, index: number) => ({
        ...row,
        id: index + Math.floor(Math.random() * (10.5 + 1)),
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiOrder])

  return (
    <>
      <MainCard title={'Báo cáo chi tiết đơn hàng'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <MonthPickerField value={month} setValue={setMonth} />
          </Grid>
          <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button variant='outlined' sx={{ mr: 1 }} onClick={exportExcel}>
                Xuất excel
              </Button>
            </div>
          </Grid>
        </Grid>
        {/* <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'}>
            {listRenderFilter.map((val) => RenderFilter({ label: val.label, key: val.key }))}
          </Grid>
        </Grid> */}
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
            //   getRowClassName: (params: GridRenderCellParams<ReportOrderType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>

        <FilterTableAdvanced
          /* eslint-disable @typescript-eslint/no-explicit-any */
          handleComfirm={(value: any) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              ['dateFrom']: value.date?.[0],
              ['dateTo']: value.date?.[1]
            }))
            setOpenFilterAdvanced(false)
          }}
          value={filters}
          open={openFilterAdvanced}
          anchorRef={anchorAdvancedRef}
          handleClose={handleCloseFilterAdvanced}
        />
      </MainCard>
    </>
  )
})

export default ReportTotalPage
