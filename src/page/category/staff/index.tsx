import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Button, Grid, OutlinedInput } from '@mui/material'
import { useTheme } from '@mui/material/styles'
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../../components/ui-component/cards/MainCard'
import Chip from '../../../components/ui-component/extended/Chip'
import { gridSpacing } from '../../../constants'
import DetailStaffDrawer from './DetailStaffDrawer'
import FormAddStaff from './FormAddStaff'
import ROUTES from '../../../routers/helpersRouter/constantRouter'

interface StaffRow {
  id: number
  name: string
  age: number
  birtday: string
  sex: string
  address: string
  numberphone: string
  email: string
  typework: string
}

const StaffPage = React.memo(() => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  console.log('searchParams', searchParams.get('page'))

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialKeyword = searchParams.get('keyword') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    keyword: initialKeyword
  })

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
  }

  const rows: GridRowsProp = [
    {
      id: 1,
      name: 'Alice',
      age: 25,
      birtday: '20/10/2024',
      sex: 'Female',
      address: '123 Main St',
      numberphone: '123-456-7890',
      email: 'alice@example.com',
      typework: 'PartTime'
    },
    {
      id: 2,
      name: 'Bob',
      age: 30,
      birtday: '20/10/2024',
      sex: 'Male',
      address: '456 Elm St',
      numberphone: '987-654-3210',
      email: 'bob@example.com',
      typework: 'FullTime'
    },
    {
      id: 3,
      name: 'Charlie',
      age: 35,
      birtday: '20/10/2024',
      sex: 'Male',
      address: '789 Oak St',
      numberphone: '555-555-5555',
      email: 'charlie@example.com',
      typework: 'PartTime'
    },
    {
      id: 4,
      name: 'David',
      age: 28,
      birtday: '20/10/2024',
      sex: 'Male',
      address: '101 Pine St',
      numberphone: '444-444-4444',
      email: 'david@example.com',
      typework: 'FullTime'
    },
    {
      id: 5,
      name: 'Eve',
      age: 22,
      birtday: '20/10/2024',
      sex: 'Female',
      address: '202 Maple St',
      numberphone: '333-333-3333',
      email: 'eve@example.com',
      typework: 'PartTime'
    }
  ]

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
        width: 50,
        renderCell: (params: GridRenderCellParams) => {
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
          const { page, pageSize } = params.api.state.pagination.paginationModel
          return page * pageSize + (rowIndex + 1)
        }
      },
      { field: 'name', headerName: 'Họ tên', flex: 1 },
      { field: 'birtday', headerName: 'Ngày sinh', flex: 1 },
      { field: 'sex', headerName: 'Giới tính', flex: 1 },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'numberphone', headerName: 'Số điện thoại', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
      {
        field: 'typework',
        headerName: 'Hình thức',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffRow, number>) => {
          return (
            <Chip
              size='small'
              label={params.value}
              sx={{
                color: theme.palette.background.default,
                bgcolor: theme.palette.success.dark
              }}
            />
          )
        }
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRenderCellParams<StaffRow, number>) => {
          return [
            <GridActionsCellItem
              icon={<LockOpenOutlinedIcon />}
              label='Lock'
              className='textPrimary'
              color='inherit'
            />,
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}/${params.id}`)}
            />,
            <GridActionsCellItem icon={<DeleteOutlinedIcon />} label='Delete' className='textPrimary' color='inherit' />
          ]
        }
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      case 'numberphone':
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
    () => data.columns.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  React.useEffect(() => {
    // Update URL parameters when pagination model changes
    setSearchParams({
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
      keyword: filters.keyword
    })
  }, [paginationModel, filters, setSearchParams])

  return (
    <>
      <MainCard title={'Danh sách nhân viên'}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder='Tìm kiếm'
              value={filters?.['keyword']}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickOpenForm}>
                Thêm mới
              </Button>
            </div>
          </Grid>
        </Grid>

        <div style={{ width: '100%', overflow: 'auto', marginTop: '20px' }}>
          <TableDataGrid
            rows={rows}
            columns={columns}
            isLoading={false}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            onRowSelectionChange={onRowSelectionChange}
            onRowClick={onRowClick}
            // checkboxSelection
            filterMode='server'
            headerFilters={false}
          />
        </div>
        <DetailStaffDrawer isVisible={openDetail} changeVisible={handleClickDetail} />
        <FormAddStaff
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            console.log('save')
          }}
        />
      </MainCard>
    </>
  )
})

export default StaffPage
