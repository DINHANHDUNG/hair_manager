import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Button, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import * as React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { currency } from '../../../../app/hooks'
import {
  useDeleteSalaryPayMutation,
  useGetListSalaryPayQuery,
  useUploadFileMutation
} from '../../../../app/services/salaryPay'
import { URL_FILE_EXCEL } from '../../../../common/apiKey'
import MyButton from '../../../../components/button/MyButton'
import SelectColumn from '../../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../../components/toast'
import MainCard from '../../../../components/ui-component/cards/MainCard'
import { VisuallyHiddenInput } from '../../../../components/ui-component/visuallyHiddenInput'
import { gridSpacing } from '../../../../constants'
import { removeNullOrEmpty } from '../../../../help'
import { SalaryPayType } from '../../../../types/SalaryPay'
import FormAddEditSalaryPay from './FormAddEdit'

const SalaryPayEmployee = React.memo(({ type }: { type: string }) => {
  const dialogs = useDialogs()
  const isStaff = type === 'STAFF'
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialMonth = searchParams.get('month') || dayjs().subtract(1, 'month').toString()
  const initialKey = searchParams.get('key') || isStaff ? 'nameStaff' : 'codeEmployee'

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const listFilterStaff = [
    { value: 'nameStaff', label: 'Tên nhân viên' },
    { value: 'identificationCardStaff', label: 'Căn cước nhân viên' }
  ]

  const listFilterEmployee = [
    { value: 'codeEmployee', label: 'Mã công nhân' },
    { value: 'nameEmployee', label: 'Tên công nhân' }
  ]
  //Start filter
  const [openFilter, setOpenFilter] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey,
    month: initialMonth
  })

  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<SalaryPayType>()
  const [rowsData, setRowsData] = React.useState<SalaryPayType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)

  const {
    data: dataApiSalaryPay,
    isLoading,
    refetch
  } = useGetListSalaryPayQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      object: type,
      month: filters?.month ? dayjs(filters.month).format('MM') : undefined,
      year: filters?.month ? dayjs(filters.month).format('YYYY') : undefined
    })
  )

  const [deleteSalaryPay, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteSalaryPayMutation()
  const [
    uploadFileSalaryPay,
    { isLoading: loadingUpload, isSuccess: isSuccessUpload, isError: isErrorUpload, error: ErrorUpload }
  ] = useUploadFileMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiSalaryPay?.data?.totalCount || 0

  const handleClose = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilter(false)
  }

  const handleToggle = () => {
    setOpenFilter((prevOpen) => !prevOpen)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['xlsx', 'xls']

      if (fileExtension && validExtensions.includes(fileExtension)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('object', type)
        uploadFileSalaryPay(formData)
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
    setItemSelectedEidt({} as SalaryPayType)
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const prevOpen = React.useRef(openFilter)

  React.useEffect(() => {
    if (prevOpen.current === true && openFilter === false) {
      anchorRef?.current?.focus()
    }

    prevOpen.current = openFilter
  }, [openFilter])

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
      deleteSalaryPay({ ids: [Number(id)] })
    }
  }

  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 50
      },
      {
        field: 'code',
        headerName: 'Mã nhân sự',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryPayType, number>) =>
          params.row.employeeId ? params.row.employee.name : params.row.staffId ? params.row.staff.name : ''
      },
      {
        field: 'name',
        headerName: 'Tên nhân sự',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryPayType, number>) =>
          params.row.employeeId ? params.row.employee.name : params.row.staffId ? params.row.staff.name : ''
      },
      {
        field: 'totalPayment',
        headerName: 'Cần thanh toán',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryPayType, number>) =>
          params.row.totalPayment ? currency(params.row.totalPayment) : ''
      },
      {
        field: 'totalMoney',
        headerName: 'Tổng lương',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryPayType, number>) =>
          params.row.totalMoney ? currency(params.row.totalMoney) : ''
      },
      {
        field: 'note',
        headerName: 'Ghi chú',
        flex: 1
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<SalaryPayType, number>) => {
          return [
            <GridActionsCellItem
              disabled={param.row.isPayment}
              icon={
                <Tooltip title='Thanh toán'>
                  <AttachMoneyOutlined />
                </Tooltip>
              }
              label='Thanh toán'
              className='textPrimary'
              color='inherit'
              // onClick={() => {
              //   setItemSelectedEidt(param.row)
              //   handleClickOpenFormChangeStatusSalaryPay()
              // }}
            />,
            <GridActionsCellItem
              disabled={param.row.isPayment}
              icon={
                <Tooltip title='Cập nhật'>
                  <EditOutlinedIcon />
                </Tooltip>
              }
              label='Sửa'
              className='textPrimary'
              color='inherit'
              onClick={() => {
                setItemSelectedEidt(param.row)
                handleClickOpenForm()
              }}
            />,
            <GridActionsCellItem
              disabled={param.row.isPayment}
              onClick={() => handleDelete(param.row.id)}
              icon={
                <Tooltip title='Xóa'>
                  <DeleteOutlinedIcon />
                </Tooltip>
              }
              label='Xóa'
              className='textPrimary'
              color='inherit'
              // showInMenu
            />
          ]
        }
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
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
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiSalaryPay?.data?.rows?.map((row: SalaryPayType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []
    setRowsData(updatedRows)
  }, [dataApiSalaryPay])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

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
      <MainCard title={`Thanh toán lương ${isStaff ? 'nhân viên' : 'công nhân'}`} sx={{ height: '84%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder='Tìm kiếm'
              defaultValue={filters?.['searchKey']}
              onChange={(e) => handleFilterChange('searchKey', e.target.value)}
              fullWidth
              sx={{ mr: 1 }}
            />
            <LocalizationProvider adapterLocale='vi' dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: {
                    size: 'small',
                    onKeyDown: (e) => e.preventDefault() // Ngăn không cho xóa bằng bàn phím
                  }
                }}
                value={dayjs(filters.month || new Date())}
                // format='MM'
                openTo='month'
                views={['month', 'year']}
                onChange={(e) => handleFilterChange('month', e?.toString() || '')}
              />
            </LocalizationProvider>

            <Tooltip ref={anchorRef} title='Lọc theo trường'>
              <IconButton color='inherit' size='small' onClick={handleToggle}>
                <SettingsOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <MyButton component='label' role={undefined} variant='outlined' tabIndex={-1} sx={{ mr: 1 }}>
                Import file
                <VisuallyHiddenInput type='file' onChange={handleImport} ref={fileRef} />
              </MyButton>
              <Link to={URL_FILE_EXCEL} target='_blank'>
                <MyButton component='label' variant='outlined' sx={{ mr: 1 }}>
                  Tải file mẫu
                </MyButton>
              </Link>
              <Button variant='outlined' sx={{ mr: 1 }}>
                Thanh toán
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
            checkboxSelection
            // otherProps={{
            //   getRowClassName: (params: GridRenderCellParams<SalaryPayType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>

        <FormAddEditSalaryPay
          itemSelectedEdit={itemSelectedEdit}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />

        <SelectColumn
          handleComfirm={(value) => {
            handleFilterChange('key', value)
            setOpenFilter(false)
          }}
          value={filters?.key}
          list={isStaff ? listFilterStaff : listFilterEmployee}
          open={openFilter}
          anchorRef={anchorRef}
          handleClose={handleClose}
        />
      </MainCard>
    </>
  )
})

export default SalaryPayEmployee
