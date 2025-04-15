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

const ReportTotalSalePage = React.memo(() => {
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
  const [rowsData, setRowsData] = React.useState<any[]>()

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
  };

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'sale', headerName: 'Tên khách hàng', flex: 1 },

      { field: 'totalOrder', headerName: 'Tổng số đơn', flex: 1 },
      { field: 'totalKg', headerName: 'Tổng kg', flex: 1 },
      { field: 'Totalmoney', headerName: 'Tổng Tiền đơn (USD)', flex: 1 },
      { field: 'TotalAmountReceived', headerName: 'Thực nhận', flex: 1 },
      { field: 'TotalWantage', headerName: 'Chưa nhận (USD)' , flex: 1}
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

    setRowsData([...updatedRows, totalSummaryRow])
  }, [fakeData])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <MainCard title={'Báo cáo doanh thu theo sale'} sx={{ height: '100%' }}>
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
      </MainCard>
    </>
  )
})

export default ReportTotalSalePage
