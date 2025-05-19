import CloseIcon from '@mui/icons-material/Close'
import IconSearch from '@mui/icons-material/Search'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Box, Button, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
import { GridCallbackDetails, GridColDef, GridRowParams, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid'
import moment from 'moment'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetListCustomerQuery } from '../../app/services/customer'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import { ChipCustom } from '../../components/ui-component/chipCustom'
import { gridSpacing } from '../../constants'
import FilterTableAdvanced from './FilterTableAdvanced'
import dayjs, { Dayjs } from 'dayjs'
import Toast from '../../components/toast'
import { useLazyExportBySaleOrderQuery, useLazyExportDetailOrderQuery } from '../../app/services/report'
import MonthPickerField from '../../components/dateTime/MonthPickerField'

const ReportTotalSalePage = React.memo(() => {
  //   const navigate = useNavigate()

  const [exportExcelDetail] = useLazyExportBySaleOrderQuery()
  //   const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialStartDate = searchParams.get('dateFrom') || ''
  const initialEndDate = searchParams.get('dateTo') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    dateFrom: initialStartDate,
    dateTo: initialEndDate
  })
  const [month, setMonth] = React.useState<Dayjs | null>(dayjs())
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [rowsData, setRowsData] = React.useState<any[]>()
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const [openDetail, setOpenDetail] = React.useState(false)

  // const [openFilter, setOpenFilter] = React.useState(false)
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
      const selectedMonth = month || dayjs()
      const monthCV = selectedMonth.format('MM-YYYY') // không cần moment
      const result = await exportExcelDetail({ month: monthCV }).unwrap()

      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `ChiTietDonHang_Sale${monthCV}.xlsx`
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

  const listRenderFilter = [
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    }
  ]

  const {
    data: dataApiCustomer,
    isLoading
    // refetch
  } = useGetListCustomerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiCustomer?.data?.totalCount || 0

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

  const fakeData = [
    {
      id: 1,
      order: 1,
      sale: 'Nguyễn Văn A',
      totalOrder: 5,
      totalWeight: 58.2,
      totalPrice: 1150,
      TotalAmountReceived: 1100,
      TotalWantage: 50
    },
    {
      id: 2,
      order: 2,
      sale: 'Trần Thị B',
      totalOrder: 3,
      totalWeight: 31.6,
      totalPrice: 690,
      TotalAmountReceived: 690,
      TotalWantage: 0
    },
    {
      id: 3,
      order: 3,
      sale: 'Lê Văn C',
      totalOrder: 7,
      totalWeight: 74.8,
      totalPrice: 1485,
      TotalAmountReceived: 1350,
      TotalWantage: 135
    }
  ]

  const totalSummaryRow = {
    id: 4,
    order: 'Tổng kết',
    sale: '',
    totalOrder: fakeData.reduce((sum, r) => sum + r.totalOrder, 0),
    totalWeight: fakeData.reduce((sum, r) => sum + r.totalWeight, 0),
    totalPrice: fakeData.reduce((sum, r) => sum + r.totalPrice, 0),
    TotalAmountReceived: fakeData.reduce((sum, r) => sum + r.TotalAmountReceived, 0),
    TotalWantage: fakeData.reduce((sum, r) => sum + r.TotalWantage, 0)
  }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'sale', headerName: 'Tên nhân viên', flex: 1 },

      { field: 'totalOrder', headerName: 'Tổng số đơn', flex: 1 },
      { field: 'totalWeight', headerName: 'Tổng kg', flex: 1 },
      { field: 'totalPrice', headerName: 'Tổng Tiền đơn (USD)', flex: 1 },
      { field: 'TotalAmountReceived', headerName: 'Thực nhận', flex: 1 },
      { field: 'TotalWantage', headerName: 'Chưa nhận (USD)', flex: 1 }
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

  const columns: GridColDef[] = React.useMemo(
    () => data.columns?.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

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
      fakeData?.map((row, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData([...updatedRows, totalSummaryRow])
  }, [fakeData])

  // const prevOpen = React.useRef(openFilter)
  const prevOpenAdvanced = React.useRef(openFilterAdvanced)
  React.useEffect(() => {
    // if (prevOpen.current === true && openFilter === false) {
    //   anchorRef?.current?.focus()
    // }

    if (prevOpenAdvanced.current === true && openFilterAdvanced === false) {
      anchorAdvancedRef?.current?.focus()
    }

    // prevOpen.current = openFilter
    prevOpenAdvanced.current = openFilterAdvanced
    // }, [openFilter, openFilterAdvanced])
  }, [openFilterAdvanced])

  return (
    <>
      <MainCard title={'Báo cáo doanh thu theo sale'} sx={{ height: '100%' }}>
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
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'}>
            {listRenderFilter.map((val) => RenderFilter({ label: val.label, key: val.key }))}
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

            // otherProps={{
            //   getRowId: (row: any) => row.id
            //   // columnGroupingModel: columnGroupingModel
            // }}
            // otherProps={{
            //   getRowClassName: (params: GridRenderCellParams<CustomerType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>

        <FilterTableAdvanced
          /* eslint-disable @typescript-eslint/no-explicit-any */
          handleComfirm={(value: any) => {
            /* eslint-enable @typescript-eslint/no-explicit-any */
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

export default ReportTotalSalePage
