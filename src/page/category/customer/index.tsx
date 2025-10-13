import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import { Box, Button, Grid, IconButton, OutlinedInput, Tooltip, Typography } from '@mui/material'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { IconAB2 } from '@tabler/icons-react'
import { useDialogs } from '@toolpad/core'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHasPermission } from '../../../app/hooks'
import { useDeleteCustomerMutation, useGetListCustomerQuery } from '../../../app/services/customer'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../components/toast'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../../constants'
import { openNewTab } from '../../../help/localHelp'
import { Perm_Customer_Add, Perm_Customer_Edit } from '../../../help/permission'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { CustomerType } from '../../../types/customer'
import ChangeAccountStaff from './ChangeStaff'
import FormAddEditCustomer from './FormAddEdit'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { ChipCustom } from '../../../components/ui-component/chipCustom'
import CloseIcon from '@mui/icons-material/Close'
import FilterTableAdvanced from './FilterTableAdvanced'
import { useGetListStaffQuery } from '../../../app/services/staff'
import { StaffType } from '../../../types/staff'

const CustomerPage = React.memo(() => {
  const dialogs = useDialogs()
  const permAdd = useHasPermission(Perm_Customer_Add)
  const permEdit = useHasPermission(Perm_Customer_Edit)
  // const navigate = useNavigate()
  //   const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialStaffId = searchParams.get('staffId') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    staffId: initialStaffId
  })

  console.log('filters', filters)

  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<CustomerType>()
  const [rowsData, setRowsData] = React.useState<CustomerType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openFormChangeStaff, setOpenFormChangeStaff] = React.useState(false)

  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const anchorAdvancedRef = React.useRef<HTMLDivElement>(null)
  const {
    data: dataApiCustomer,
    isLoading,
    refetch
  } = useGetListCustomerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...filters
  })

  const { data: dataApiStaff } = useGetListStaffQuery({})
  const listStaff =
    dataApiStaff?.data?.rows?.map((e: StaffType) => ({ ...e, value: e.id.toString(), label: e.name })) || []

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

  const onCellDoubleClick = (param: GridCellParams) => {
    if (param.field === 'orders') {
      const code = param?.row?.orders?.[0]?.code
      code &&
        openNewTab(`/${ROUTES.ORDER}/${ROUTES.DEFAULT}`, {
          page: 0,
          pageSize: 10,
          // code: code || '',
          customerName: param?.row?.name || ''
        })
    }
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

  const handleCloseFilterAdvanced = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorAdvancedRef.current && anchorAdvancedRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilterAdvanced(false)
  }

  const handleToggleFilterAdvanced = () => {
    setOpenFilterAdvanced((prevOpen) => !prevOpen)
  }

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
      {
        field: 'orders',
        headerName: 'Đơn hàng',
        flex: 1,
        // renderCell: (params: GridRenderCellParams<CustomerType, number>) =>
        //   params.row?.orders?.length > 0 ? params.row.orders?.[0]?.code : ''

        renderCell: (params: GridRenderCellParams<CustomerType, number>) => {
          const code = params.row?.orders?.[0]?.code
          return code ? (
            <Typography
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {code}
            </Typography>
          ) : (
            ''
          )
        }
      },
      // { field: 'gender', headerName: 'Giới tính', flex: 1 },
      // { field: 'note', headerName: 'Ghi chú', flex: 1 },
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

  const listRenderFilter = [
    { key: 'staffId ', label: listStaff?.find((opt: StaffType) => opt?.id?.toString() === initialStaffId)?.label || '' }
  ]

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
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
      searchKey: filters.searchKey,
      staffId: filters.staffId
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

  const prevOpenAdvanced = React.useRef(openFilterAdvanced)
  React.useEffect(() => {
    if (prevOpenAdvanced.current === true && openFilterAdvanced === false) {
      anchorAdvancedRef?.current?.focus()
    }

    // prevOpen.current = openFilter
    prevOpenAdvanced.current = openFilterAdvanced
  }, [openFilterAdvanced])

  return (
    <>
      <MainCard title={'Danh sách khách hàng'} sx={{ height: '100%' }}>
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
            {permAdd && (
              <div>
                <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickOpenForm}>
                  Thêm mới
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'}>
            {listRenderFilter.map((val) => RenderFilter({ label: val?.label || '', key: val?.key }))}
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
            onCellClick={onCellDoubleClick}
            otherProps={{
              getRowClassName: (params: GridRenderCellParams<CustomerType, number>) =>
                !params.row.isActive ? 'even' : 'odd'
            }}
            pagination
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

        <FilterTableAdvanced
          /* eslint-disable @typescript-eslint/no-explicit-any */
          listStaff={listStaff}
          handleComfirm={(value: any) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              ['staffId']: value.staffId
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

export default CustomerPage
