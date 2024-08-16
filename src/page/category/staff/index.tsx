import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined'
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
import moment from 'moment'
import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useActiveStaffMutation, useDeleteStaffMutation, useGetListStaffQuery } from '../../../app/services/staff'
import { OPTIONGENDER, OPTIONTYPEWORK } from '../../../common/contants'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../components/toast'
import MainCard from '../../../components/ui-component/cards/MainCard'
import Chip from '../../../components/ui-component/extended/Chip'
import { gridSpacing } from '../../../constants'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { StaffType } from '../../../types/staff'
import DetailStaffDrawer from './DetailStaffDrawer'
import FormAddStaff from './FormAddStaff'
import { useDialogs } from '@toolpad/core'

const StaffPage = React.memo(() => {
  const navigate = useNavigate()
  const dialogs = useDialogs()
  const theme = useTheme()
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
  const [itemSelected, setItemSelected] = React.useState<StaffType>()
  const [rowsData, setRowsData] = React.useState<StaffType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

  const [deleteStaff, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteStaffMutation()
  const [activeStaff, { isLoading: loadingActive, isSuccess: isSuccessActive, isError: isErrorActive }] =
    useActiveStaffMutation()

  const {
    data: dataApiStaff,
    isLoading,
    refetch
  } = useGetListStaffQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiStaff?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
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
    setItemSelected(params.row)
    handleClickDetail()
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteStaff({ ids: [Number(id)] })
    }
  }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'name', headerName: 'Họ tên', flex: 1 },
      {
        field: 'birthDay',
        headerName: 'Ngày sinh',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffType, number>) =>
          params.row.birthDay ? moment(params.row.birthDay).format('DD/MM/YYYY') : ''
      },
      {
        field: 'gender',
        headerName: 'Giới tính',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffType, number>) => {
          const show = OPTIONGENDER.find((e) => e.value === params.row.gender)?.label
          return show || ''
        }
      },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
      {
        field: 'typeWorking',
        headerName: 'Hình thức',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffType, number>) => {
          const label = OPTIONTYPEWORK.find((e) => e.value === params.row.typeWorking)?.label || ''
          return (
            label && (
              <Chip
                size='small'
                label={label}
                sx={{
                  color: theme.palette.background.default,
                  bgcolor: theme.palette.success.dark
                }}
              />
            )
          )
        }
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRenderCellParams<StaffType, number>) => {
          return [
            <GridActionsCellItem
              icon={!params.row.isActive ? <LockOpenOutlinedIcon /> : <LockClockOutlinedIcon />}
              label='Lock'
              className='textPrimary'
              color='inherit'
              onClick={() => activeStaff({ staffId: Number(params.id), active: !params.row.isActive })}
            />,
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}/${params.id}`)}
            />,
            <GridActionsCellItem
              icon={<DeleteOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              onClick={() => handleDelete(params.row.id)}
            />
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
      case 'name':
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
    [data.columns, filters, dataApiStaff]
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
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  React.useEffect(() => {
    handleMutation(loadingActive, isErrorActive, isSuccessActive, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingActive])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiStaff?.data?.rows.map((row: StaffType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiStaff])

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
              value={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
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
          />
        </div>
        <DetailStaffDrawer
          isVisible={openDetail}
          changeVisible={handleClickDetail}
          staff={itemSelected || ({} as StaffType)}
        />
        <FormAddStaff
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />
        {/* <LoadingModal open={isLoading || isFetching} /> */}
      </MainCard>
    </>
  )
})

export default StaffPage
