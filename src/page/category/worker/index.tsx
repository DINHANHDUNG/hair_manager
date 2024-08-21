import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Button, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
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
import { useDialogs } from '@toolpad/core'
import moment from 'moment'
import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetListCompanyQuery } from '../../../app/services/company'
import { useDeleteEmployeeMutation, useGetListEmployeeQuery } from '../../../app/services/employee'
import { OPTIONGENDER, STATUS_WORKING_EMPLOYEE } from '../../../common/contants'
import SelectColumn from '../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../components/toast'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../../help'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { CompanyType } from '../../../types/company'
import { EmployeeType } from '../../../types/employee'
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

const WorkerPage = React.memo(() => {
  const navigate = useNavigate()
  // const theme = useTheme()
  const dialogs = useDialogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialKey = searchParams.get('key') || 'code'
  const initialStartAge = searchParams.get('ageFrom') || ''
  const initialEndAge = searchParams.get('ageTo') || ''
  const initialStartDate = searchParams.get('dateFrom') || ''
  const initialEndDate = searchParams.get('dateTo') || ''
  const initialStatus = searchParams.get('statusWorking') || ''
  const initialCompany = searchParams.get('companyId') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey,
    ageFrom: initialStartAge,
    ageTo: initialEndAge,
    dateFrom: initialStartDate,
    dateTo: initialEndDate,
    statusWorking: initialStatus,
    companyId: initialCompany
  })
  const [rowsData, setRowsData] = React.useState<EmployeeType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const { data: dataApiCompany } = useGetListCompanyQuery({
    page: 1
  })
  const listCompany =
    dataApiCompany?.data?.rows?.map((e: CompanyType) => ({ ...e, value: e.id.toString(), label: e.name })) || []
  const [deleteEmployee, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteEmployeeMutation()
  const {
    data: dataApiEmployee,
    isLoading,
    refetch
  } = useGetListEmployeeQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      dateFrom: filters.dateFrom ? convertDateToApi(filters.dateFrom) : '',
      dateTo: filters.dateTo ? convertDateToApi(filters.dateFrom) : ''
    })
  )

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiEmployee?.data?.totalCount || 0

  //Start filter
  const listFilter = [
    { value: 'code', label: 'Mã công nhân' },
    { value: 'name', label: 'Tên công nhân' },
    { value: 'identificationCard', label: 'Căn cước công dân' },
    { value: 'phoneNumber', label: 'Số điện thoại' }
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

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteEmployee({ ids: [Number(id)] })
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
        width: 50
      },
      { field: 'name', headerName: 'Họ tên', flex: 1 },
      {
        field: 'birtday',
        headerName: 'Ngày sinh',
        flex: 1,
        renderCell: (params: GridRenderCellParams<EmployeeType, number>) =>
          params.row.birthDay ? moment(params.row.birthDay).format('DD/MM/YYYY') : ''
      },
      {
        field: 'gender',
        headerName: 'Giới tính',
        flex: 1,
        renderCell: (params: GridRenderCellParams<EmployeeType, number>) => {
          const show = OPTIONGENDER.find((e) => e.value === params.row.gender)?.label
          return show || ''
        }
      },
      { field: 'address', headerName: 'Địa chỉ', flex: 1 },
      { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
      // {
      //   field: 'typework',
      //   headerName: 'Tình trạng',
      //   flex: 1,
      //   renderCell: (params: GridRenderCellParams<EmployeeType, number>) => {
      //     return (
      //       <Chip
      //         size='small'
      //         label={params.value}
      //         sx={{
      //           color: theme.palette.background.default,
      //           bgcolor: theme.palette.success.dark
      //         }}
      //       />
      //     )
      //   }
      // },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRenderCellParams<EmployeeType, number>) => {
          return [
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
              onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.WORKER}/${params.id}`)}
            />,
            <GridActionsCellItem
              onClick={() => handleDelete(params.row.id)}
              icon={<DeleteOutlinedIcon />}
              label='Delete'
              className='textPrimary'
              color='inherit'
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

  const listRenderFilter = [
    { key: 'age', label: initialStartAge && initialEndAge ? `${initialStartAge} tuổi ~ ${initialEndAge} tuổi` : '' },
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    { key: 'statusWorking', label: `${STATUS_WORKING_EMPLOYEE.find((e) => e.value === initialStatus)?.label || ''}` },
    {
      key: 'companyId',
      label: `${listCompany.find((e: CompanyType) => e.value === initialCompany)?.label || ''}`
    }
  ]

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
      if (key === 'age') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['ageTo']: '',
          ['ageFrom']: ''
        }))
        return
      }
      if (key === 'date') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['dateTo']: '',
          ['dateFrom']: ''
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

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiEmployee?.data?.rows?.map((row: EmployeeType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiEmployee])

  return (
    <>
      <MainCard title={'Danh sách công nhân'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder={'Tìm kiếm'}
              value={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
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
        <FormAddEditWorker
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
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
            ['companyId']: value.company,
            ['statusWorking']: value.status,
            ['dateFrom']: value.date?.[0],
            ['dateTo']: value.date?.[1],
            ['ageFrom']: value.age?.[0],
            ['ageTo']: value.age?.[1]
          }))
          setOpenFilterAdvanced(false)
        }}
        value={filters}
        open={openFilterAdvanced}
        anchorRef={anchorAdvancedRef}
        listCompany={listCompany}
        handleClose={handleCloseFilterAdvanced}
      />
    </>
  )
})

export default WorkerPage
