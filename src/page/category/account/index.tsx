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
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../../constants'
// import DetailStaffDrawer from './DetailStaffDrawer'
import { IconLockAccess } from '@tabler/icons-react'
import { useGetListAccountQuery } from '../../../app/services/auth'
import { OPTIONSPOSITION } from '../../../common/contants'
import ChangePassword from '../../../components/dialog/ChangePassword'
import { AccountType } from '../../../types/account'
import FormAddAccount from './FormAddAccount'

const AccountManagerPage = React.memo(() => {
  // const navigate = useNavigate()
  // const dialogs = useDialogs()

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
  const [itemSelected, setItemSelected] = React.useState<AccountType>()
  const [rowsData, setRowsData] = React.useState<AccountType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

  const [openModalChangePass, setOpenModalChangePass] = React.useState(false)

  // const [deleteStaff, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteStaffMutation()

  const {
    data: dataListAcccout,
    isLoading,
    refetch
  } = useGetListAccountQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataListAcccout?.data?.totalCount || 0

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

  // const handleDelete = async (id: number) => {
  //   const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
  //     title: 'Xác nhận lại',
  //     okText: 'Có',
  //     cancelText: 'Hủy'
  //   })
  //   if (confirmed) {
  //     deleteStaff({ ids: [Number(id)] })
  //   }
  // }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      {
        field: 'username',
        headerName: 'Tài khoản',
        flex: 1,
        renderCell: (params: GridRenderCellParams<AccountType, number>) => params.row.username
      },
      // {
      //   field: 'birthDay',
      //   headerName: 'Ngày sinh',
      //   flex: 1,
      //   renderCell: (params: GridRenderCellParams<AccountType, number>) =>
      //     params.row.birthDay ? moment(params.row.birthDay).format('DD/MM/YYYY') : ''
      // },
      // {
      //   field: 'identificationCard',
      //   headerName: 'Căn cước',
      //   flex: 1
      // },
      // {
      //   field: 'address',
      //   headerName: 'Địa chỉ',
      //   flex: 1,
      //   renderCell: (params: GridRenderCellParams<AccountType, number>) => params.row.address
      // },
      // { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
      {
        field: 'chucvu',
        headerName: 'Nhân viên',
        flex: 1,
        renderCell: (params: GridRenderCellParams<AccountType, number>) => params?.row?.staff?.name
      },
      {
        field: 'account',
        headerName: 'Loại tài khoản',
        flex: 1,
        renderCell: (params: GridRenderCellParams<AccountType, number>) =>
          OPTIONSPOSITION.find((e) => e.value === params?.row?.role)?.label || ''
      },
      // { field: 'email', headerName: 'Email', flex: 1 },
      // {
      //   field: 'typeWorking',
      //   headerName: 'Hình thức',
      //   flex: 1,
      //   renderCell: (params: GridRenderCellParams<AccountType, number>) => {
      //     const label = OPTIONTYPEWORK.find((e) => e.value === params.row.typeWorking)?.label || ''
      //     return (
      //       label && (
      //         <Chip
      //           size='small'
      //           label={label}
      //           sx={{
      //             color: theme.palette.background.default,
      //             bgcolor: theme.palette.success.dark
      //           }}
      //         />
      //       )
      //     )
      //   }
      // },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRenderCellParams<AccountType, number>) => {
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title={'Đổi mật khẩu'}>
                  <IconLockAccess />
                </Tooltip>
              }
              label='Lock'
              className='textPrimary'
              color='inherit'
              onClick={() => {
                setOpenModalChangePass(true)
                setItemSelected(params.row)
              }}
            />
            // <GridActionsCellItem
            //   icon={<EditOutlinedIcon />}
            //   label='Delete'
            //   className='textPrimary'
            //   color='inherit'
            //   onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}/${params.id}`)}
            // />,
            // <GridActionsCellItem
            //   icon={<DeleteOutlinedIcon />}
            //   label='Delete'
            //   className='textPrimary'
            //   color='inherit'
            //   onClick={() => handleDelete(params.row.id)}
            // />
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
    [data.columns, filters, dataListAcccout]
  )

  React.useEffect(() => {
    // Update URL parameters when pagination model changes
    setSearchParams({
      page: paginationModel.page.toString(),
      pageSize: paginationModel.pageSize.toString(),
      searchKey: filters.searchKey
    })
  }, [paginationModel, filters, setSearchParams])

  // React.useEffect(() => {
  //   handleMutation({
  //     successMessage: 'Thao tác thành công',
  //     errorMessage: 'Thao tác không thành công',
  //     isError: isError,
  //     isSuccess: isSuccess,
  //     loading: loadingDelete,
  //     refetch: () => refetch()
  //   })
  // }, [loadingDelete])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataListAcccout?.data?.rows?.map((row: AccountType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataListAcccout])

  return (
    <>
      <MainCard title={'Danh sách tài khoản'} sx={{ height: '100%' }}>
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
            pagination
          />
        </div>
        <FormAddAccount
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />
        {/* <LoadingModal open={isLoading || isFetching} /> */}
        <ChangePassword
          accountId={itemSelected?.id}
          handleClose={() => setOpenModalChangePass(false)}
          open={openModalChangePass}
        />
      </MainCard>
    </>
  )
})

export default AccountManagerPage
