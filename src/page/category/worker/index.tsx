import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Button, Collapse, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
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
import { useDialogs } from '@toolpad/core'
import moment from 'moment'
import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useGetListCompanyQuery } from '../../../app/services/company'
import {
  useDeleteEmployeeMutation,
  useGetListEmployeeQuery,
  useUploadFileEmployeeMutation
} from '../../../app/services/employee'
import { useGetStaticEmployeeDetailQuery } from '../../../app/services/statistic'
import { URL_FILE_EXCEL_EMPLOYEE } from '../../../common/apiKey'
import { STATUS_WORKING_EMPLOYEE } from '../../../common/contants'
import MyButton from '../../../components/button/MyButton'
import { CardContentBoxSection } from '../../../components/cardContentBoxSection'
import SelectColumn from '../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../components/toast'
import MainCard from '../../../components/ui-component/cards/MainCard'
import { VisuallyHiddenInput } from '../../../components/ui-component/visuallyHiddenInput'
import { gridSpacing } from '../../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../../help'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { CompanyType } from '../../../types/company'
import { EmployeeType, HistoryEmployeeType } from '../../../types/employee'
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
  const theme = useTheme()
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
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [rowsData, setRowsData] = React.useState<EmployeeType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openStatistics, setOpenStatistics] = React.useState(false)

  const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticEmployeeDetailQuery({})
  const countStatusFail = dataStaticStaffDetail?.data?.countStatusFail || 0 //Phỏng vấn trượt
  const countStatusInCustomer = dataStaticStaffDetail?.data?.countStatusInCustomer || 0 //Cho vendor mượn
  const countStatusInCompany = dataStaticStaffDetail?.data?.countStatusInCompany || 0 //Trong công ty
  const countStatusInHome = dataStaticStaffDetail?.data?.countStatusInHome || 0 //Chờ giao việc
  const countStatusOut = dataStaticStaffDetail?.data?.countStatusOut || 0 //Đã nghỉ việc
  const countStatusWaiting = dataStaticStaffDetail?.data?.countStatusWaiting || 0 //Chờ phỏng vấn

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
      dateTo: filters.dateTo ? convertDateToApi(filters.dateTo) : ''
    })
  )
  const [
    uploadFileEmployee,
    { isLoading: loadingUpload, isSuccess: isSuccessUpload, isError: isErrorUpload, error: ErrorUpload }
  ] = useUploadFileEmployeeMutation()

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['xlsx', 'xls']

      if (fileExtension && validExtensions.includes(fileExtension)) {
        const formData = new FormData()
        formData.append('file', file)
        uploadFileEmployee(formData)
      } else {
        Toast({ text: 'Vui lòng chọn file excel (xlsx, xls)', variant: 'error' })
      }
    }
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

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
      { field: 'code', headerName: 'Mã công nhân', flex: 1 },
      { field: 'name', headerName: 'Họ tên', flex: 1 },
      {
        field: 'birtday',
        headerName: 'Ngày sinh',
        flex: 1,
        renderCell: (params: GridRenderCellParams<EmployeeType, number>) =>
          params.row.birthDay ? moment(params.row.birthDay).format('DD/MM/YYYY') : ''
      },
      { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 1 },
      { field: 'identificationCard', headerName: 'Căn cước', flex: 1 },
      {
        field: 'statusWorking',
        headerName: 'Trạng thái',
        renderCell: (params: GridRenderCellParams<EmployeeType, number>) => {
          const label = STATUS_WORKING_EMPLOYEE.find((e) => e.value === params.row.statusWorking)?.label || ''
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
        field: 'employeeHistories',
        headerName: 'Làm việc tại',
        renderCell: (params: GridRenderCellParams<EmployeeType, number>) => {
          const histories = params.row.employeeHistories
            ? params.row.employeeHistories[params.row.employeeHistories.length - 1]
            : ({} as HistoryEmployeeType)
          const label = histories && histories.status === 'IN_COMPANY' ? histories.company.name : ''
          return label
        }
      },
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
      case 'email':
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
      if (isSuccess) {
        Toast({ text: successMessage, variant: 'success' })
        refetch()
        refetchStatic()
      }
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

  React.useEffect(() => {
    if (!loadingUpload) {
      const newError = ErrorUpload as {
        data: {
          errors: string
          message: string
          status: string
        }
      }
      handleMutation(
        loadingUpload,
        isErrorUpload,
        isSuccessUpload,
        'Tải lên thành công',
        ErrorUpload ? newError?.data?.message : 'Tải lên không thành công'
      )
    }
  }, [loadingUpload])

  return (
    <>
      <IconButton sx={{ padding: 0 }} onClick={() => setOpenStatistics(!openStatistics)}>
        {openStatistics ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Collapse in={openStatistics} timeout='auto' unmountOnExit>
        <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
          <CardContentBoxSection title={'Trong công ty'} content={countStatusInCompany} />
          <CardContentBoxSection title={'Cho vendor mượn'} content={countStatusInCustomer} />
          <CardContentBoxSection title={'Đã nghỉ việc'} content={countStatusOut} />
          <CardContentBoxSection title={'Chờ giao việc'} content={countStatusInHome} />
          <CardContentBoxSection title={'Chờ phỏng vấn'} content={countStatusWaiting} />
          <CardContentBoxSection title={'Phỏng vấn trượt'} content={countStatusFail} />
        </Grid>
      </Collapse>
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
              <MyButton component='label' role={undefined} variant='outlined' tabIndex={-1} sx={{ mr: 1 }}>
                Import file
                <VisuallyHiddenInput type='file' onChange={handleImport} ref={fileRef} />
              </MyButton>
              <Link to={URL_FILE_EXCEL_EMPLOYEE} target='_blank'>
                <MyButton component='label' variant='outlined' sx={{ mr: 1 }}>
                  Tải file mẫu
                </MyButton>
              </Link>
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
