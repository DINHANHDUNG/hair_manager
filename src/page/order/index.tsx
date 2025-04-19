import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Autocomplete, Button, Collapse, Grid, IconButton, OutlinedInput, TextField, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import { styled, useTheme } from '@mui/material/styles'
import { Box, maxWidth } from '@mui/system'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import moment from 'moment'
import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useGetListCompanyQuery } from '../../app/services/company'
import {
  useDeleteEmployeeMutation,
  useGetListEmployeeQuery,
  useUploadFileEmployeeMutation
} from '../../app/services/employee'
import { useGetStaticEmployeeDetailQuery } from '../../app/services/statistic'
import { URL_FILE_EXCEL_EMPLOYEE } from '../../common/apiKey'
import { STATUS_WORKING_EMPLOYEE } from '../../common/contants'
import MyButton from '../../components/button/MyButton'
import { CardContentBoxSection } from '../../components/cardContentBoxSection'
import SelectColumn from '../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../components/toast'
import MainCard from '../../components/ui-component/cards/MainCard'
import { VisuallyHiddenInput } from '../../components/ui-component/visuallyHiddenInput'
import { gridSpacing } from '../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../help'
import ROUTES from '../../routers/helpersRouter/constantRouter'
import { CompanyType } from '../../types/company'
import { EmployeeType, HistoryEmployeeType } from '../../types/employee'
import FilterTableAdvanced from './FilterTableAdvanced'
import FormAddEditWorker from './FormAddEditWorker'
import { GridColumnGroupingModel } from '@mui/x-data-grid'
import { DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AutocompleteEditCell } from '../../components/table-data-grid/cellAutocomplete'
import { TextEditCell } from '../../components/table-data-grid/textEditCell'
import { DateEditCell } from '../../components/table-data-grid/cellDate'
import { AddCircle, AddTask, BorderAll, HighlightOff, Verified } from '@mui/icons-material'
import FormAddEditInvoice from './modalInvoice'
import FormAddNewOrder from './modalAddNew'
import FormEditInfoOrder from './modalEditInfoOrder'

const ChipCustom = styled(Chip)(({ theme }) => ({
  color: theme.palette.background.default,
  backgroundColor: theme.palette.grey[500],
  marginRight: '5px',
  marginBottom: '5px',
  '& .MuiChip-label': {
    paddingRight: 5
  }
}))

const customerOptions = [
  { label: 'Khách A', value: 'a' },
  { label: 'Khách B', value: 'b' },
  { label: 'Khách C', value: 'c' }
]

const statusSX = [
  { value: 'Đang chia hàng', label: 'Đang chia hàng' },
  { value: 'Đã gửi lace', label: 'Đã gửi lace' },
  { value: 'Đang làm màu', label: 'Đang làm màu' },
  { value: 'Đang tẩy màu', label: 'Đang tẩy màu' },
  { value: 'Đang xử lý mềm mượt', label: 'Đang xử lý mềm mượt' }
]

const statusOrder = [
  { value: 'Đang sản xuất', label: 'Đang sản xuất' },
  { value: 'Đã đóng gói', label: 'Đã đóng gói' },
  { value: 'Chờ giao', label: 'Chờ giao' }
]

const OrderPage = React.memo(() => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dialogs = useDialogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialKey = searchParams.get('key') || 'code'
  const initialCode = searchParams.get('code') || ''

  const initialStartDate = searchParams.get('dateFrom') || ''
  const initialEndDate = searchParams.get('dateTo') || ''
  const initialPhone = searchParams.get('phoneNumber') || ''
  const initialName = searchParams.get('name') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey,
    code: initialCode,
    dateFrom: initialStartDate,
    dateTo: initialEndDate,
    phoneNumber: initialPhone,
    name: initialName
  })
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [rowsData, setRowsData] = React.useState<EmployeeType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openStatistics, setOpenStatistics] = React.useState(false)
  const [modalInvoice, setModalInvoice] = React.useState(false)
  const [modalAddOrder, setModalAddOrder] = React.useState(false)
  const [modalEditInfoOrder, setModalEditInfoOrder] = React.useState(false)

  const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticEmployeeDetailQuery({})
  const countStatusFail = dataStaticStaffDetail?.data?.countStatusFail || 0 //Phỏng vấn trượt
  const countStatusInPartner = dataStaticStaffDetail?.data?.countStatusInPartner || 0 //Cho vendor mượn
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

  const handleModalInvoice = () => {
    setModalInvoice(!modalInvoice)
  }

  const handleModalAddOrder = () => {
    setModalAddOrder(!modalAddOrder)
  }

  const handleModalEditInfoOrder = () => {
    setModalEditInfoOrder(!modalEditInfoOrder)
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
    // setOpenFormAdd(true)
    handleModalAddOrder()
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

  const processRowUpdate = React.useCallback((newRow: any, oldRow: any) => {
    // So sánh hoặc xử lý dữ liệu tại đây
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      // Cập nhật dữ liệu lên server tại đây nếu muốn (ví dụ gọi API update)
      console.log('Updated row:', newRow)
    }

    return newRow // Quan trọng: phải return lại row đã cập nhật
  }, [])

  const fakeData = [
    {
      id: 1,
      order: 1,
      code: 'DH001',
      customer: 'c',
      numberPhone: '0999888746',
      address: 'Yên Phong',
      customer_Progress: 'Đang chia hàng',
      status_Progress: 'Đang sản xuất',
      birthDay: '2025-04-10', // dùng chung cho các cột có renderCell là birthDay
      rate: 'Tốt',
      statusWorking: 'COMPLETED',
      order_edit: 'Sửa cổ áo',
      order_edit_pull: '2025-04-11',
      statusWorking2: 'Đang sản xuất',
      order_edit_date_push: '2025-04-13',
      order_edit_note: 'Giao lại đúng hạn',
      discount: '30'
    },
    {
      id: 2,
      order: 2,
      code: 'DH002',
      customer: 'b',
      numberPhone: '0999888746',
      address: 'Yên Phong',
      customer_Progress: 'Đang gửi lace',
      status_Progress: 'Đã đóng gói',
      birthDay: '2025-04-09',
      rate: 'Khá',
      statusWorking: 'IN_PROGRESS',
      order_edit: 'Chỉnh chiều dài',
      order_edit_pull: '2025-04-10',
      statusWorking2: 'Đang sản xuất',
      order_edit_date_push: '2025-04-12',
      order_edit_note: 'Cần kiểm tra lại',
      discount: '30'
    },
    {
      id: 3,
      order: 3,
      code: 'DH003',
      customer: 'c',
      numberPhone: '0999888746',
      address: 'Yên Phong',
      customer_Progress: 'Đang làm màu',
      status_Progress: 'Chờ giao',
      birthDay: '2025-04-08',
      rate: 'Trung bình',
      statusWorking: 'PENDING',
      order_edit: '',
      order_edit_pull: '',
      statusWorking2: 'Đang sản xuất',
      order_edit_date_push: '',
      order_edit_note: '',
      discount: '30'
    }
  ]

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'code', headerName: 'Mã đơn hàng', editable: true },

      {
        field: 'customer',
        headerName: 'Khách hàng',
        editable: true,
        renderEditCell: (params: GridRenderEditCellParams) => (
          <AutocompleteEditCell {...params} options={customerOptions} />
        )
      },

      {
        field: 'numberPhone',
        headerName: 'Số điện thoại',
        editable: true,
        preProcessEditCellProps: (params: GridRenderEditCellParams) => {
          const isValidPhone = /^0\d{9}$/.test(params.props.value) // ví dụ: bắt đầu bằng 0 và 10 số
          return {
            ...params.props,
            error: !isValidPhone
          }
        },
        renderEditCell: TextEditCell
      },

      {
        field: 'address',
        headerName: 'Địa chỉ',
        editable: true,
        renderEditCell: TextEditCell
      },

      {
        field: 'customer_Progress',
        headerName: 'Tình trạng sản xuất',
        editable: true,
        renderEditCell: (params: GridRenderEditCellParams) => <AutocompleteEditCell {...params} options={statusSX} />
      },

      {
        field: 'status_Progress',
        headerName: 'Tình trạng đơn hàng',
        editable: true,
        renderEditCell: (params: GridRenderEditCellParams) => <AutocompleteEditCell {...params} options={statusOrder} />
      },

      {
        field: 'name',
        headerName: 'Ngày xưởng nhận đơn',
        editable: true,
        renderCell: (params: any) => (params.row.name ? dayjs(params.row.name).format('DD/MM/YYYY') : ''),
        renderEditCell: DateEditCell
      },

      {
        field: 'birthDay',
        headerName: 'Ngày dự kiến xuất',
        editable: true,
        renderCell: (params: any) => (params.row.birthDay ? dayjs(params.row.birthDay).format('DD/MM/YYYY') : ''),
        renderEditCell: DateEditCell
      },

      {
        field: 'birthDay2',
        headerName: 'Ngày thực tế giao',
        editable: true,
        renderCell: (params: any) => (params.row.birthDay2 ? dayjs(params.row.birthDay2).format('DD/MM/YYYY') : ''),
        renderEditCell: DateEditCell
      },

      { field: 'rate', headerName: 'Đánh giá sx', editable: true, renderEditCell: TextEditCell },
      { field: 'discount', headerName: 'Tiền discount', editable: true, renderEditCell: TextEditCell },

      { field: 'order_edit', headerName: 'Đơn sửa', editable: true, renderEditCell: TextEditCell },

      {
        field: 'order_edit_pull',
        headerName: 'Ngày xưởng nhận',
        editable: true,
        renderCell: (params: any) =>
          params.row.order_edit_pull ? dayjs(params.row.order_edit_pull).format('DD/MM/YYYY') : '',
        renderEditCell: DateEditCell
      },

      {
        field: 'statusWorking2',
        headerName: 'Trạng thái',
        editable: true,
        renderEditCell: (params: GridRenderEditCellParams) => <AutocompleteEditCell {...params} options={statusOrder} />
      },

      {
        field: 'order_edit_date_push',
        headerName: 'Ngày xưởng giao lại',
        editable: true,
        renderCell: (params: any) =>
          params.row.order_edit_date_push ? dayjs(params.row.order_edit_date_push).format('DD/MM/YYYY') : '',
        renderEditCell: DateEditCell
      },

      {
        field: 'order_edit_note',
        headerName: 'Ghi chú',
        editable: true,
        renderEditCell: TextEditCell
      },

      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        getActions: (params: GridRenderCellParams<EmployeeType, number>) => [
          <GridActionsCellItem
            icon={<EditOutlinedIcon />}
            label='Edit'
            className='textPrimary'
            color='inherit'
            onClick={handleModalEditInfoOrder}
          />,
          <GridActionsCellItem
            onClick={() => handleDelete(params.row.id)}
            icon={<DeleteOutlinedIcon />}
            label='Delete'
            className='textPrimary'
            color='inherit'
          />,
          <GridActionsCellItem
            icon={<HighlightOff />}
            label='Hủy đơn'
            // onClick={() => handleView(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<AddCircle />}
            label='Tạo invoice'
            onClick={() => handleModalInvoice()}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<BorderAll />}
            label='Đã nhận hàng cần sửa'
            // onClick={() => handleCopy(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<AddTask />}
            label='Nhận hàng'
            // onClick={() => handleCopy(params.row)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<Verified />}
            label='Hoàn thành'
            // onClick={() => handleCopy(params.row)}
            showInMenu
          />
        ]
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      // case 'numberphone':
      //   return {
      //     ...colDef,
      //     minWidth: 150
      //   }
      // case 'email':
      //   return {
      //     ...colDef,
      //     minWidth: 150
      //   }
      case 'order':
        return {
          ...colDef,
          width: 30
        }
      default:
        return {
          ...colDef,
          minWidth: 200
        }
    }
  }

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: 'Theo dõi đơn sửa',
      description: 'Theo dõi đơn sửa',
      children: [
        { field: 'order_edit' },
        { field: 'order_edit_pull' },
        { field: 'statusWorking2' },
        { field: 'order_edit_date_push' },
        { field: 'order_edit_date_note' }
      ]
    }
  ]

  const columns: GridColDef[] = React.useMemo(
    () => data.columns.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  const listRenderFilter = [
    { key: 'name', label: initialName || '' },
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    { key: 'phoneNumber', label: initialPhone || '' },
    {
      key: 'code',
      label: initialCode || ''
    }
  ]

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
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
      fakeData?.map((row: any, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [fakeData])

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
          <CardContentBoxSection title={'Tổng đợn'} content={countStatusInCompany} />
          <CardContentBoxSection title={'Đơn huỷ'} content={countStatusInPartner} />
          <CardContentBoxSection title={'Đang sản xuất'} content={countStatusOut} />
          <CardContentBoxSection title={'Đóng gói'} content={countStatusFail} />
          <CardContentBoxSection title={'Chờ giao'} content={countStatusWaiting} />
          <CardContentBoxSection title={'Đã gửi hàng'} content={countStatusInHome} />
        </Grid>
      </Collapse>
      <MainCard title={'Danh sách đơn'} sx={{ height: '100%' }}>
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
            {/* <Tooltip ref={anchorRef} title='Lọc theo trường'>
              <IconButton color='inherit' size='small' onClick={handleToggle}>
                <SettingsOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip> */}
            <Tooltip title='Lọc nâng cao' ref={anchorAdvancedRef}>
              <IconButton color='inherit' size='small' onClick={handleToggleFilterAdvanced}>
                <TuneOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              {/* <MyButton component='label' role={undefined} variant='outlined' tabIndex={-1} sx={{ mr: 1 }}>
                Import file
                <VisuallyHiddenInput type='file' onChange={handleImport} ref={fileRef} />
              </MyButton>
              <Link to={URL_FILE_EXCEL_EMPLOYEE} target='_blank'>
                <MyButton component='label' variant='outlined' sx={{ mr: 1 }}>
                  Tải file mẫu
                </MyButton>
              </Link> */}
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
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Row update error:', error)
            }}
            otherProps={{
              columnGroupingModel: columnGroupingModel
            }}
            pinnedColumns={{ right: ['actions'] }}
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

      {/* <SelectColumn
        handleComfirm={(value) => {
          handleFilterChange('key', value)
          setOpenFilter(false)
        }}
        value={filters?.key}
        list={listFilter}
        open={openFilter}
        anchorRef={anchorRef}
        handleClose={handleClose}
      /> */}

      <FormAddEditInvoice handleClose={handleModalInvoice} open={modalInvoice} />
      <FormAddNewOrder handleClose={handleModalAddOrder} open={modalAddOrder} />
      <FormEditInfoOrder handleClose={handleModalEditInfoOrder} open={modalEditInfoOrder} />

      <FilterTableAdvanced
        /* eslint-disable @typescript-eslint/no-explicit-any */
        handleComfirm={(value: any) => {
          setFilters((prevFilters) => ({
            ...prevFilters,
            ['name']: value.name,
            ['phoneNumber']: value.phoneNumber,
            ['dateFrom']: value.date?.[0],
            ['dateTo']: value.date?.[1],
            ['code']: value.code
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

export default OrderPage
