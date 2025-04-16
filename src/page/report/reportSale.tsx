import CloseIcon from '@mui/icons-material/Close'
import IconSearch from '@mui/icons-material/Search'
import { Box, Button, Grid, IconButton, OutlinedInput, Tooltip, Typography } from '@mui/material'
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
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import FilterTableAdvanced from './FilterTableAdvanced'
import { ChipCustom } from '../../components/ui-component/chipCustom'
import moment from 'moment'

const ReportTotalSalePage = React.memo(() => {
  const dialogs = useDialogs()

  //   const navigate = useNavigate()
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

  const [rowsData, setRowsData] = React.useState<any[]>()

  const [openDetail, setOpenDetail] = React.useState(false)

  const [openFilter, setOpenFilter] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const anchorAdvancedRef = React.useRef<HTMLDivElement>(null)

  const handleCloseFilterAdvanced = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorAdvancedRef.current && anchorAdvancedRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilterAdvanced(false)
  }

  const handleToggleFilterAdvanced = () => {
    setOpenFilterAdvanced((prevOpen) => !prevOpen)
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
    data: dataApiPartner,
    isLoading,
    refetch
  } = useGetListPartnerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiPartner?.data?.totalCount || 0

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
      totalKg: 58.2,
      Totalmoney: 1150,
      TotalAmountReceived: 1100,
      TotalWantage: 50
    },
    {
      id: 2,
      order: 2,
      sale: 'Trần Thị B',
      totalOrder: 3,
      totalKg: 31.6,
      Totalmoney: 690,
      TotalAmountReceived: 690,
      TotalWantage: 0
    },
    {
      id: 3,
      order: 3,
      sale: 'Lê Văn C',
      totalOrder: 7,
      totalKg: 74.8,
      Totalmoney: 1485,
      TotalAmountReceived: 1350,
      TotalWantage: 135
    }
  ]

  const totalSummaryRow = {
    id: 4,
    order: 'Tổng kết',
    sale: '',
    totalOrder: fakeData.reduce((sum, r) => sum + r.totalOrder, 0),
    totalKg: fakeData.reduce((sum, r) => sum + r.totalKg, 0),
    Totalmoney: fakeData.reduce((sum, r) => sum + r.Totalmoney, 0),
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
      { field: 'totalKg', headerName: 'Tổng kg', flex: 1 },
      { field: 'Totalmoney', headerName: 'Tổng Tiền đơn (USD)', flex: 1 },
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
      fakeData?.map((row: any, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData([...updatedRows, totalSummaryRow])
  }, [fakeData])

  const prevOpen = React.useRef(openFilter)
  const prevOpenAdvanced = React.useRef(openFilterAdvanced)
  React.useEffect(() => {
    if (prevOpen.current === true && openFilter === false) {
      anchorRef?.current?.focus()
    }

    if (prevOpenAdvanced.current === true && openFilterAdvanced === false) {
      anchorAdvancedRef?.current?.focus()
    }

    prevOpen.current = openFilter
    prevOpenAdvanced.current = openFilterAdvanced
  }, [openFilter, openFilterAdvanced])

  return (
    <>
      <MainCard title={'Báo cáo doanh thu theo sale'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder='Tìm kiếm'
              value={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
              fullWidth
            />
            <Tooltip title='Lọc nâng cao' ref={anchorAdvancedRef}>
              <IconButton color='inherit' size='small' onClick={handleToggleFilterAdvanced}>
                <TuneOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button variant='outlined' sx={{ mr: 1 }}>
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
            //   getRowClassName: (params: GridRenderCellParams<PartnerType, number>) =>
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

export default ReportTotalSalePage
