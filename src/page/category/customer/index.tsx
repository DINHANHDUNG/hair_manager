import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Button, Grid, OutlinedInput } from '@mui/material'
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
import FormAddEditCustomer from './FormAddEdit'
import { CustomerType } from '../../../types/customer'
import { useDialogs } from '@toolpad/core'
import { useDeleteCustomerMutation, useGetListCustomerQuery } from '../../../app/services/customer'
import Toast from '../../../components/toast'
import { IconAB2 } from '@tabler/icons-react'
import ChangeAccountStaff from './ChangeStaff'
import { useHasPermission } from '../../../app/hooks'
import { Perm_Customer_Add, Perm_Customer_Edit } from '../../../help/permission'

const CustomerPage = React.memo(() => {
  const dialogs = useDialogs()
  const permAdd = useHasPermission(Perm_Customer_Add)
  const permEdit = useHasPermission(Perm_Customer_Edit)
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

  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<CustomerType>()
  const [rowsData, setRowsData] = React.useState<CustomerType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openFormChangeStaff, setOpenFormChangeStaff] = React.useState(false)

  const {
    data: dataApiCustomer,
    isLoading,
    refetch
  } = useGetListCustomerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const [deleteCustomer, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteCustomerMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiCustomer?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
    setItemSelectedEidt({} as CustomerType)
  }

  const handleClickOpenFormChangeStaff = () => {
    setOpenFormChangeStaff(true)
  }

  const handleCloseFormChangeStaff = () => {
    setOpenFormChangeStaff(false)
    setItemSelectedEidt({} as CustomerType)
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
      deleteCustomer({ ids: [Number(id)] })
    }
  }

  // const fakeData = [
  //   {
  //     id: 1,
  //     order: 1,
  //     name: 'Nguyễn Văn A',
  //     phoneNumber: '84901234567',
  //     email: 'nguyenvana@example.com',
  //     address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
  //     gender: 'Nam',
  //     note: 'Khách hàng lâu năm',
  //     isActive: true
  //   },
  //   {
  //     id: 2,
  //     order: 2,
  //     name: 'Trần Thị B',
  //     phoneNumber: '84907654321',
  //     email: 'tranthib@example.com',
  //     address: '456 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
  //     gender: 'Nữ',
  //     note: 'Ưu tiên liên hệ buổi sáng',
  //     isActive: false
  //   },
  //   {
  //     id: 3,
  //     order: 3,
  //     name: 'Lê Văn C',
  //     phoneNumber: '84888888888',
  //     email: 'levanc@example.com',
  //     address: '789 Đường Trường Chinh, Tân Bình, TP.HCM',
  //     gender: 'Nam',
  //     note: 'Khách mới',
  //     isActive: true
  //   }
  // ]

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'name', headerName: 'Tên khách hàng', flex: 1 },
      { field: 'phoneNumber', headerName: 'Mã định danh (Whatsapp)', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      // { field: 'gender', headerName: 'Giới tính', flex: 1 },
      { field: 'note', headerName: 'Ghi chú', flex: 1 },
      {
        field: 'staff',
        headerName: 'Nhân viên',
        flex: 1,
        renderCell: (params: GridRenderCellParams<CustomerType, number>) => {
          const name = params.row?.account?.staff?.name || ''
          const username = params.row?.account?.username || ''
          return name + (username ? ` (${username})` : '')
        }
      },

      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<CustomerType, number>) => {
          return [
            permEdit ? (
              <GridActionsCellItem
                icon={<IconAB2 />}
                label='Edit'
                className='textPrimary'
                color='inherit'
                onClick={() => {
                  setItemSelectedEidt(param.row)
                  handleClickOpenFormChangeStaff()
                }}
                disabled={!param.row.isActive}
              />
            ) : (
              <></>
            ),
            permEdit ? (
              <GridActionsCellItem
                icon={<EditOutlinedIcon />}
                label='Edit'
                className='textPrimary'
                color='inherit'
                onClick={() => {
                  setItemSelectedEidt(param.row)
                  handleClickOpenForm()
                }}
                disabled={!param.row.isActive}
              />
            ) : (
              <></>
            ),
            permEdit ? (
              <GridActionsCellItem
                onClick={() => handleDelete(param.row.id)}
                icon={<DeleteOutlinedIcon />}
                label='Delete'
                className='textPrimary'
                color='inherit'
                disabled={!param.row.isActive}
              />
            ) : (
              <></>
            )
          ]
        }
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
      dataApiCustomer?.data?.rows?.map((row: CustomerType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiCustomer])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <MainCard title={'Danh sách khách hàng'} sx={{ height: '100%' }}>
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
            {permAdd && (
              <div>
                <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickOpenForm}>
                  Thêm mới
                </Button>
              </div>
            )}
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
              getRowClassName: (params: GridRenderCellParams<CustomerType, number>) =>
                !params.row.isActive ? 'even' : 'odd'
            }}
          />
        </div>

        <FormAddEditCustomer
          itemSelectedEdit={itemSelectedEdit}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />

        <ChangeAccountStaff
          itemSelectedEdit={itemSelectedEdit}
          open={openFormChangeStaff}
          handleClose={handleCloseFormChangeStaff}
          handleSave={() => {
            refetch()
            handleCloseFormChangeStaff()
          }}
        />
      </MainCard>
    </>
  )
})

export default CustomerPage
