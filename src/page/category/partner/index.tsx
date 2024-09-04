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
import FormAddEditPartner from './FormAddEdit'
import { PartnerType } from '../../../types/partner'
import { useDialogs } from '@toolpad/core'
import { useDeletePartnerMutation, useGetListPartnerQuery } from '../../../app/services/partner'
import Toast from '../../../components/toast'

const PartnerPage = React.memo(() => {
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
  const [rowsData, setRowsData] = React.useState<PartnerType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

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

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
    setItemSelectedEidt({} as PartnerType)
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
      deletePartner({ ids: [Number(id)] })
    }
  }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 50
      },
      { field: 'code', headerName: 'Mã vendor', flex: 1 },
      { field: 'name', headerName: 'Tên đơn vị', flex: 1 },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'taxCode', headerName: 'MST', flex: 1 },
      { field: 'phoneNumber', headerName: 'SĐT', flex: 1 },
      { field: 'representativeName', headerName: 'Người đại diện', flex: 1 },
      { field: 'representativePosition', headerName: 'Chức danh NĐD', flex: 1 },
      { field: 'representativePhone', headerName: 'Số điện thoại NĐD', flex: 1 },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<PartnerType, number>) => {
          return [
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
            />,
            <GridActionsCellItem
              onClick={() => handleDelete(param.row.id)}
              icon={<DeleteOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              disabled={!param.row.isActive}
            />
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
      dataApiPartner?.data?.rows?.map((row: PartnerType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiPartner])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <MainCard title={'Danh sách vendor'} sx={{ height: '100%' }}>
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
              getRowClassName: (params: GridRenderCellParams<PartnerType, number>) =>
                !params.row.isActive ? 'even' : 'odd'
            }}
          />
        </div>

        <FormAddEditPartner
          itemSelectedEdit={itemSelectedEdit}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />
      </MainCard>
    </>
  )
})

export default PartnerPage
