import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Button, Grid, OutlinedInput, Tooltip } from '@mui/material'
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
import { useSearchParams } from 'react-router-dom'
import { handleMutation } from '../../../app/hooks'
import { useActiveStaffMutation, useDeleteStaffMutation, useGetListStaffQuery } from '../../../app/services/staff'
import { OPTIONSPOSITION } from '../../../common/contants'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../../constants'
import { StaffType } from '../../../types/staff'
import DetailStaffDrawer from './DetailStaffDrawer'
import FormAddStaff from './FormAddStaff'
import LoadingModal from '../../../components/ui-component/LoadingModal'

const StaffPage = React.memo(() => {
  const dialogs = useDialogs()
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
    // handleClickDetail()
    handleClickOpenForm()
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

  const handelActiveStaff = ({ staffId, active }: { staffId: number; active: boolean }) => {
    activeStaff({ staffId, active })
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
        field: 'identificationCard',
        headerName: 'Căn cước',
        flex: 1
      },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
      {
        field: 'chucvu',
        headerName: 'Chức vụ',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffType, number>) =>
          OPTIONSPOSITION.find((e) => e.value === params?.row?.role)?.label || ''
      },
      {
        field: 'account',
        headerName: 'Tài khoản',
        flex: 1,
        renderCell: (params: GridRenderCellParams<StaffType, number>) => params.row.account.username
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRenderCellParams<StaffType, number>) => {
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title={params.row.isActive ? 'Khóa nhân viên' : 'Mở khóa nhân viên'}>
                  {params.row.isActive ? <LockOpenOutlinedIcon /> : <LockClockOutlinedIcon />}
                </Tooltip>
              }
              label='Lock'
              className='textPrimary'
              color='inherit'
              onClick={() => handelActiveStaff({ staffId: Number(params.id), active: !params.row.isActive })}
            />,
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Edit'
              className='textPrimary'
              color='inherit'
              onClick={() => {
                setItemSelected(params.row)
                handleClickOpenForm()
              }}
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
    () => data.columns?.map((colDef) => renderColumn(colDef)),
    [data.columns, filters, dataApiStaff]
  )

  React.useEffect(() => {
    // Update URL parameters when pagination model changes
    setSearchParams({
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
      searchKey: filters.searchKey
    })
  }, [paginationModel, filters, setSearchParams])

  React.useEffect(() => {
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isError,
      isSuccess: isSuccess,
      loading: loadingDelete,
      refetch: () => refetch()
    })
  }, [loadingDelete])

  React.useEffect(() => {
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isErrorActive,
      isSuccess: isSuccessActive,
      loading: loadingActive,
      refetch: () => refetch()
    })
  }, [loadingActive])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiStaff?.data?.rows?.map((row: StaffType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiStaff])

  return (
    <>
      <MainCard title={'Danh sách nhân viên'} sx={{ height: '100%' }}>
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
            otherProps={{
              getRowClassName: (params: GridRenderCellParams<StaffType, number>) =>
                !params.row.isActive ? 'even' : 'odd'
            }}
            pagination
          />
        </div>
        <DetailStaffDrawer
          isVisible={openDetail}
          changeVisible={handleClickDetail}
          staff={itemSelected || ({} as StaffType)}
        />
        <FormAddStaff
          itemSelected={itemSelected}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />
        <LoadingModal open={isLoading || loadingActive || loadingDelete} />
      </MainCard>
    </>
  )
})

export default StaffPage
