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

interface PartnerRow {
  id: number
  partnerCode: string
  partnerName: string
  address: string
  taxCode: string
  phoneNumber: string
  representativeName: string
  representativeTitle: string
  representativePhone: string
}

const PartnerPage = React.memo(() => {
  //   const navigate = useNavigate()
  //   const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

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

  console.log(openFormAdd)

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
      partnerCode: 'P001',
      partnerName: 'Công ty A',
      address: '123 Đường A',
      taxCode: '0101234567',
      phoneNumber: '0987654321',
      representativeName: 'Nguyễn Văn A',
      representativeTitle: 'Giám đốc',
      representativePhone: '0912345678'
    },
    {
      id: 2,
      partnerCode: 'P002',
      partnerName: 'Công ty B',
      address: '456 Đường B',
      taxCode: '0202345678',
      phoneNumber: '0978654321',
      representativeName: 'Trần Thị B',
      representativeTitle: 'Phó Giám đốc',
      representativePhone: '0923456789'
    },
    {
      id: 3,
      partnerCode: 'P003',
      partnerName: 'Công ty C',
      address: '789 Đường C',
      taxCode: '0303456789',
      phoneNumber: '0967543210',
      representativeName: 'Lê Văn C',
      representativeTitle: 'Trưởng phòng',
      representativePhone: '0934567890'
    }
    // Thêm các dòng dữ liệu khác theo yêu cầu
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
      { field: 'partnerCode', headerName: 'Mã đối tác', flex: 1 },
      { field: 'partnerName', headerName: 'Tên đơn vị', flex: 1 },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'taxCode', headerName: 'MST', flex: 1 },
      { field: 'phoneNumber', headerName: 'SĐT', flex: 1 },
      { field: 'representativeName', headerName: 'Người đại diện', flex: 1 },
      { field: 'representativeTitle', headerName: 'Chức danh NĐD', flex: 1 },
      { field: 'representativePhone', headerName: 'Số điện thoại NĐD', flex: 1 },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<PartnerRow, number>) => {
          console.log('param', param)

          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              // onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.Partner}/${params.id}`)}
            />,
            <GridActionsCellItem icon={<DeleteOutlinedIcon />} label='Delete' className='textPrimary' color='inherit' />
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
      <MainCard title={'Danh sách đối tác'}>
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
            filterMode='server'
            headerFilters={false}
          />
        </div>

        <FormAddEditPartner
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

export default PartnerPage
