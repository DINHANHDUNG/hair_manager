import { Button, Grid, Typography } from '@mui/material'
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
import { formatNumber, useCreateSearchParams, useQueryParam } from '../../app/hooks'
import { useGetListReportOrderQuery, useLazyExportDetailOrderQuery } from '../../app/services/report'
import MonthPickerField from '../../components/dateTime/MonthPickerField'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import { TextEditCell } from '../../components/table-data-grid/textEditCell'
import Toast from '../../components/toast'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../constants'
import { removeNullOrEmpty } from '../../help'
import { ReportOrderType } from '../../types/report'
import FilterTableAdvanced from './FilterTableAdvanced'

const ReportTotalPage = React.memo(() => {
  //   const navigate = useNavigate()
  //   const theme = useTheme()
  const [, setSearchParams] = useSearchParams()
  const [month, setMonth] = React.useState<Dayjs | null>(dayjs())

  const initialPage = useQueryParam('page', 0)
  const initialPageSize = useQueryParam('pageSize', 10)
  const initialSearchKey = useQueryParam('searchKey', '')

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
  const rowTotal = dataApiOrder?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  // const handleFilterChange = (field: string, value: string) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [field]: value
  //   }))
  // }

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    console.log(rowSelectionModel, details)
  }

  const onRowClick = (params: GridRowParams) => {
    console.log('params', params.row)
    handleClickDetail()
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getChangedFields = (newRow: any, oldRow: any) => {
    return Object.keys(newRow).find((key) => newRow[key] !== oldRow[key])
  }

  const processRowUpdate = React.useCallback((newRow: any, oldRow: any) => {
    // So sánh hoặc xử lý dữ liệu tại đây
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      // Cập nhật dữ liệu lên server tại đây nếu muốn (ví dụ gọi API update)
      const changedFields = getChangedFields(newRow, oldRow)
      const payload = { ...newRow }

      if (changedFields?.includes('moneyPay1')) {
        payload.moneyPay1 = newRow.moneyPay1 ? Number(newRow.moneyPay1) : null
      }
      if (changedFields?.includes('moneyPay2')) {
        payload.moneyPay2 = newRow.moneyPay2 ? Number(newRow.moneyPay2) : null
      }
      if (changedFields?.includes('moneyPay3')) {
        payload.moneyPay3 = newRow.moneyPay3 ? Number(newRow.moneyPay3) : null
      }

      // updateOrder(payload)
    }

    return newRow
  }, [])
  /* eslint-enable @typescript-eslint/no-explicit-any */

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

  // const RenderFilter = ({ label, key }: { label: string; key: string }) => {
  //   const handleClose = () => {
  //     if (key === 'date') {
  //       setFilters((prevFilters) => ({
  //         ...prevFilters,
  //         ['dateTo']: '',
  //         ['dateFrom']: ''
  //       }))
  //       return
  //     }
  //     handleFilterChange(key, '')
  //   }
  //   return (
  //     label?.length > 0 && (
  //       <ChipCustom
  //         size='medium'
  //         label={
  //           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 0 }}>
  //             {label}
  //             <IconButton color='inherit' size='small' onClick={handleClose}>
  //               <CloseIcon fontSize='inherit' />
  //             </IconButton>
  //           </Box>
  //         }
  //       />
  //     )
  //   )
  // }

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

        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.dateOrder ? moment(params.row.dateOrder).format('DD/MM') : ''
      },
      { field: 'code', headerName: 'Đơn số' },
      {
        field: 'totalWeight',
        headerName: 'Số kg',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.totalWeight ? formatNumber(Number(params.row.totalWeight)) : ''
      },
      {
        field: 'totalPrice',
        headerName: 'Tiền hàng (USD)',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.totalPrice ? formatNumber(Number(params.row.totalPrice)) : ''
      },
      {
        field: 'discount',
        headerName: 'Discount',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.discount ? formatNumber(Number(params.row.discount)) : ''
      },
      {
        field: 'feeShip',
        headerName: 'Tiền ship (USD)',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.feeShip ? formatNumber(Number(params.row.feeShip)) : ''
      },
      {
        field: 'feeWig',
        headerName: 'Wig Fee/ Fast production',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.feeWig ? formatNumber(Number(params.row.feeWig)) : ''
      },
      {
        field: 'feePaypal',
        headerName: 'Paypal Free',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.feePaypal ? formatNumber(Number(params.row.feePaypal)) : ''
      },
      {
        field: 'totalOrder',
        headerName: 'Tổng tiền đơn (USD)',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.totalOrder ? formatNumber(Number(params.row.totalOrder)) : ''
      },

      {
        field: 'moneyPay1',
        headerName: 'Lần 1',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row?.isApprove1 && params.row.moneyPay1 ? formatNumber(Number(params.row.moneyPay1)) : '',
        editable: false,
        renderEditCell: TextEditCell

        //Danh sách thanh toán giống báo cáo chỉ cho sửa 1 2 3, pttt, tk nhận (Phân quyền chỉ sale)
        //Check isApprove1 true Thanh toán thì chọn màu
        //Nếu isApprove1 fasle hoặc null thì cho sửa
        //Tồn tại id thì sửa không tồn tại thì thêm mới

        //Danh sách phê duyệt (Phân quyền chỉ admin)
        //Phê duyệt hỏi trước xem đồng ý không
      },
      {
        field: 'moneyPay2',
        headerName: 'Lần 2',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row?.isApprove2 && params.row.moneyPay2 ? formatNumber(Number(params.row.moneyPay2)) : ''
      },
      {
        field: 'moneyPay3',
        headerName: 'Lần 3',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row?.isApprove3 && params.row.moneyPay3 ? formatNumber(Number(params.row.moneyPay3)) : ''
      },
      {
        field: 'moneyReceived',
        headerName: 'Số tiền thực nhận',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.moneyReceived ? formatNumber(Number(params.row.moneyReceived)) : ''
      }, //moneyReceived
      {
        field: 'moneyDebt',
        headerName: 'Số tiền khách thiếu (USD)',
        renderCell: (params: GridRenderCellParams<ReportOrderType, number>) =>
          params.row.moneyDebt ? formatNumber(Number(params.row.moneyDebt)) : ''
      }, //moneyDebt
      { field: 'methodPayment', headerName: 'Phương thức TT' }, //methodPayment
      { field: 'bankAccount', headerName: 'Tài khoản nhận' }, //bankAccount
      {
        field: 'status',
        headerName: 'Tình trạng thanh toán' //statusPayment
        // renderCell: (params: GridRenderCellParams<ReportOrderType, number>) => 'Đã trả hết'
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
          children: [{ field: 'moneyPay1' }, { field: 'moneyPay2' }, { field: 'moneyPay3' }]
        },
        { field: 'moneyReceived' },
        { field: 'moneyDebt' },
        { field: 'methodPayment' },
        { field: 'bankAccount' },
        { field: 'status' }
      ]
    }
  ]

  const columns: GridColDef[] = React.useMemo(
    () => data.columns?.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  React.useEffect(() => {
    const params = useCreateSearchParams(paginationModel, filters)
    setSearchParams(params)
  }, [paginationModel, filters, setSearchParams])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiOrder?.data?.rows?.map((row: ReportOrderType, index: number) => ({
        ...row,
        id: row.id,
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
            //Sửa trong bảng
            onCellClick={() => null}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Row update error:', error)
            }}
            pagination
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
