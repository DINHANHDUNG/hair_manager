import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Button, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import { styled, useTheme } from '@mui/material/styles'
import { Box } from '@mui/system'
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
import { OPTIONSTTWORKER } from '../../../common/contants'
import SelectColumn from '../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../../constants'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import FilterTableAdvanced from './FilterTableAdvanced'
import FormAddEditWorker from './FormAddEditWorker'

const ChipCustom = styled(Chip)(({ theme }) => ({
  color: theme.palette.background.default,
  backgroundColor: theme.palette.grey[500],
  marginRight: '5px',
  marginBottom: '5px',
  '& .MuiChip-label': {
    paddingRight: 5
  }
}))

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

const WorkerPage = React.memo(() => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialKeyword = searchParams.get('keyword') || ''
  const initialKey = searchParams.get('key') || 'code'
  const initialStartAge = searchParams.get('startAge') || ''
  const initialEndAge = searchParams.get('endAge') || ''
  const initialStartDate = searchParams.get('startDate') || ''
  const initialEndDate = searchParams.get('endDate') || ''
  const initialStatus = searchParams.get('status') || ''
  const initialCompany = searchParams.get('company') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    keyword: initialKeyword,
    key: initialKey,
    startAge: initialStartAge,
    endAge: initialEndAge,
    startDate: initialStartDate,
    endDate: initialEndDate,
    status: initialStatus,
    company: initialCompany
  })

  console.log('filters', filters)

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

  //Start filter
  const listFilter = [
    { value: 'code', label: 'Mã nhân viên' },
    { value: 'name', label: 'Tên nhân viên' },
    { value: 'identityNumber', label: 'Căn cước công dân' }
  ]
  const [openFilter, setOpenFilter] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const anchorAdvancedRef = React.useRef<HTMLDivElement>(null)

  const handleClose = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilter(false)
  }

  const handleToggle = () => {
    setOpenFilter((prevOpen) => !prevOpen)
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

  //End filter

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
      typework: 'Đang phỏng vấn'
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
      typework: 'Chờ phỏng vấn'
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
      typework: 'Đã làm'
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
      typework: 'Đã làm'
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
        headerName: 'Tình trạng',
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
              icon={<EditOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.WORKER}/${params.id}`)}
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

  const listCompany = [
    { value: '1', label: 'Công ty 1' },
    { value: '2', label: 'Công ty 2' }
  ]

  const listRenderFilter = [
    { key: 'age', label: initialStartAge && initialEndAge ? `${initialStartAge} tuổi ~ ${initialEndAge} tuổi` : '' },
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    { key: 'status', label: `${OPTIONSTTWORKER.find((e) => e.value === initialStatus)?.label || ''}` },
    { key: 'company', label: `${listCompany.find((e) => e.value === initialCompany)?.label || ''}` }
  ]

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
      if (key === 'age') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['endAge']: '',
          ['startAge']: ''
        }))
        return
      }
      if (key === 'date') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['endDate']: '',
          ['startDate']: ''
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

  return (
    <>
      <MainCard title={'Danh sách công nhân'}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder={'Tìm kiếm'}
              value={filters?.['keyword']}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              fullWidth
            />
            <Tooltip ref={anchorRef} title='Lọc theo trường'>
              <IconButton color='inherit' size='small' onClick={handleToggle}>
                <SettingsOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Lọc nâng cao' ref={anchorAdvancedRef}>
              <IconButton color='inherit' size='small' onClick={handleToggleFilterAdvanced}>
                <TuneOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickOpenForm}>
                Thêm mới
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
            isLoading={false}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            onRowSelectionChange={onRowSelectionChange}
            onRowClick={onRowClick}
            checkboxSelection
            filterMode='server'
            headerFilters={false}
          />
        </div>
        <FormAddEditWorker
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            console.log('save')
          }}
        />
      </MainCard>
      <SelectColumn
        handleComfirm={(value) => {
          handleFilterChange('key', value)
          setOpenFilter(false)
        }}
        value={filters?.key}
        list={listFilter}
        open={openFilter}
        anchorRef={anchorRef}
        handleClose={handleClose}
      />

      <FilterTableAdvanced
        /* eslint-disable @typescript-eslint/no-explicit-any */
        handleComfirm={(value: any) => {
          setFilters((prevFilters) => ({
            ...prevFilters,
            ['company']: value.company,
            ['status']: value.status,
            ['startDate']: value.date?.[0],
            ['endDate']: value.date?.[1],
            ['startAge']: value.age?.[0],
            ['endAge']: value.age?.[1]
          }))
          setOpenFilterAdvanced(false)
        }}
        value={filters}
        open={openFilterAdvanced}
        anchorRef={anchorAdvancedRef}
        handleClose={handleCloseFilterAdvanced}
      />
    </>
  )
})

export default WorkerPage
