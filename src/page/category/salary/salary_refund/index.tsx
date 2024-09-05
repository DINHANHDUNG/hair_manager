import AutorenewIcon from '@mui/icons-material/AutorenewOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import IconSearch from '@mui/icons-material/Search'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Chip, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
// import { useTheme } from '@mui/material/styles'
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
import { useSearchParams } from 'react-router-dom'
import { currency } from '../../../../app/hooks'
import { useDeleteSalaryRefundMutation, useGetListSalaryRefundQuery } from '../../../../app/services/salaryRefund'
import { STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import SelectColumn from '../../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../../components/toast'
import MainCard from '../../../../components/ui-component/cards/MainCard'
import { ChipCustom } from '../../../../components/ui-component/chipCustom'
import { gridSpacing } from '../../../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../../../help'
import { SalaryRefundType } from '../../../../types/salaryRefund'
import FilterTableRefundd from './FilterTableSalaryRefund'
import FormAddEditSalaryRefund from './FormAddEdit'
import FormChangeStatusSalaryRefund from './FormChangeStatusSalaryRefund'

const SalaryRefundPage = React.memo(() => {
  const dialogs = useDialogs()
  //   const navigate = useNavigate()
  // const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialStartDate = searchParams.get('dateFrom') || ''
  const initialEndDate = searchParams.get('dateTo') || ''
  const initialKey = searchParams.get('key') || 'nameStaff'
  const initialStatusRefund = searchParams.get('statusRefund') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })
  // const abc = { "phoneNumberStaff", "phoneNumberEmployee"}
  //Start filter
  const listFilter = [
    // { value: 'codeStaff', label: 'Mã nhân viên' },
    { value: 'nameStaff', label: 'Tên nhân viên' },
    { value: 'codeEmployee', label: 'Mã công nhân' },
    { value: 'nameEmployee', label: 'Tên công nhân' },
    { value: 'identificationCardStaff', label: 'Căn cước nhân viên' },
    { value: 'identificationCardEmployee', label: 'Căn cước công nhân' },
    { value: 'phoneNumberStaff', label: 'SĐT nhân viên' },
    { value: 'phoneNumberEmployee', label: 'SĐT công nhân' }
  ]
  const [openFilter, setOpenFilter] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [openFilterRefundd, setOpenFilterRefundd] = React.useState(false)
  const anchorRefunddRef = React.useRef<HTMLDivElement>(null)

  const handleClose = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilter(false)
  }

  const handleToggle = () => {
    setOpenFilter((prevOpen) => !prevOpen)
  }

  const handleCloseFilterRefundd = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorRefunddRef.current && anchorRefunddRef.current.contains(event.target as Node)) {
      return
    }
    setOpenFilterRefundd(false)
  }
  const handleToggleFilterRefundd = () => {
    setOpenFilterRefundd((prevOpen) => !prevOpen)
  }

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey,
    dateFrom: initialStartDate,
    dateTo: initialEndDate,
    statusRefund: initialStatusRefund
  })

  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<SalaryRefundType>()
  const [rowsData, setRowsData] = React.useState<SalaryRefundType[]>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openFormChangeStatusSalaryRefund, setOpenFormChangeStatusSalaryRefund] = React.useState(false)

  const {
    data: dataApiSalaryRefund,
    isLoading,
    refetch
  } = useGetListSalaryRefundQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      dateFrom: filters.dateFrom ? convertDateToApi(filters.dateFrom) : '',
      dateTo: filters.dateTo ? convertDateToApi(filters.dateTo) : ''
    })
  )

  const [deleteSalaryRefund, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteSalaryRefundMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiSalaryRefund?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
    setItemSelectedEidt({} as SalaryRefundType)
  }

  const handleClickOpenFormChangeStatusSalaryRefund = () => {
    setOpenFormChangeStatusSalaryRefund(true)
  }

  const handleCloseFormChangeStatusSalaryRefund = () => {
    setOpenFormChangeStatusSalaryRefund(false)
    setItemSelectedEidt({} as SalaryRefundType)
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const listRenderFilter = [
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    {
      key: 'statusRefund',
      label: `${STATUS_ADVANCE_SALARY.find((e) => e.value === initialStatusRefund)?.label || ''}`
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

  const prevOpen = React.useRef(openFilter)
  const prevOpenRefundd = React.useRef(openFilterRefundd)
  React.useEffect(() => {
    if (prevOpen.current === true && openFilter === false) {
      anchorRef?.current?.focus()
    }

    if (prevOpenRefundd.current === true && openFilterRefundd === false) {
      anchorRefunddRef?.current?.focus()
    }

    prevOpen.current = openFilter
    prevOpenRefundd.current = openFilterRefundd
  }, [openFilter, openFilterRefundd])

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
      deleteSalaryRefund({ ids: [Number(id)] })
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
        field: 'name',
        headerName: 'Tên nhân sự',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params.row?.salaryAdvance?.employeeId
            ? params?.row?.salaryAdvance?.employee?.name
            : params?.row?.salaryAdvance?.staffId
              ? params?.row?.salaryAdvance?.staff?.name
              : ''
      },
      {
        field: 'phoneNumber',
        headerName: 'Số điện thoại',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params?.row?.salaryAdvance?.employeeId
            ? params?.row?.salaryAdvance?.employee?.phoneNumber
            : params?.row?.salaryAdvance?.staffId
              ? params?.row?.salaryAdvance?.staff?.phoneNumber
              : ''
      },
      {
        field: 'money',
        headerName: 'Số tiền',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params.row.money ? currency(params.row.money) : ''
      },
      {
        field: 'date',
        headerName: 'Ngày ứng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params.row.dateRefund ? moment(params.row.dateRefund).format('DD/MM/YYYY') : ''
      },
      {
        field: 'statusRefund',
        headerName: 'TT hoàn ứng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) => {
          const show = STATUS_ADVANCE_SALARY.find((e) => e.value === params.row.statusRefund)
          return (
            <Chip
              size='medium'
              label={show?.label || ''}
              sx={{
                color: show?.color,
                bgcolor: show?.bg
              }}
            />
          )
        }
      },
      {
        field: 'noteRefund',
        headerName: 'Ghi chú',
        flex: 1
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<SalaryRefundType, number>) => {
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title='Đổi trạng thái ứng lương'>
                  <AutorenewIcon />
                </Tooltip>
              }
              label='Đổi trạng thái ứng lương'
              className='textPrimary'
              color='inherit'
              onClick={() => {
                setItemSelectedEidt(param.row)
                handleClickOpenFormChangeStatusSalaryRefund()
              }}
            />,
            <GridActionsCellItem
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
      dataApiSalaryRefund?.data?.rows?.map((row: SalaryRefundType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []
    setRowsData(updatedRows)
  }, [dataApiSalaryRefund])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <MainCard title={'Hoàn ứng nhân sự'} sx={{ height: '84%' }}>
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
            <Tooltip ref={anchorRef} title='Lọc theo trường'>
              <IconButton color='inherit' size='small' onClick={handleToggle}>
                <SettingsOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Lọc nâng cao' ref={anchorRefunddRef}>
              <IconButton color='inherit' size='small' onClick={handleToggleFilterRefundd}>
                <TuneOutlinedIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'}>
            {listRenderFilter?.map((val) => RenderFilter({ label: val.label, key: val.key }))}
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
            // otherProps={{
            //   getRowClassName: (params: GridRenderCellParams<SalaryRefundType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>

        <FormAddEditSalaryRefund
          itemSelectedEdit={itemSelectedEdit}
          itemSelectedSalaryAdvance={itemSelectedEdit?.salaryAdvance}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />

        <FormChangeStatusSalaryRefund
          itemSelectedEdit={itemSelectedEdit}
          open={openFormChangeStatusSalaryRefund}
          handleClose={handleCloseFormChangeStatusSalaryRefund}
          handleSave={() => {
            refetch()
            handleCloseFormChangeStatusSalaryRefund()
          }}
        />

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

        <FilterTableRefundd
          /* eslint-disable @typescript-eslint/no-explicit-any */
          handleComfirm={(value: any) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              ['statusRefund']: value.statusRefund,
              ['dateFrom']: value.date?.[0],
              ['dateTo']: value.date?.[1]
            }))
            setOpenFilterRefundd(false)
          }}
          value={filters}
          open={openFilterRefundd}
          anchorRef={anchorRefunddRef}
          handleClose={handleCloseFilterRefundd}
        />
      </MainCard>
    </>
  )
})

export default SalaryRefundPage

// const styleSalaryRefundPage = makeStyles({
//   CardContent: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' },
//   TextCard: { fontWeight: '500', fontSize: 13, marginBottom: 2 },
//   TextCardValue: { marginBottom: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
//   iconArrow: { marginRight: 2 },
//   CardContent1: (theme: Theme) => ({
//     backgroundColor: theme.palette.background.paper,
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     flexWrap: 'wrap'
//   })
// })
