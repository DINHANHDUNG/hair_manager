import {
  AutorenewOutlined as AutorenewIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  Search as IconSearch,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AddBoxOutlined as MoneyOutlined,
  SettingsOutlined as SettingsOutlinedIcon,
  TuneOutlined as TuneOutlinedIcon
} from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  IconButton,
  OutlinedInput,
  Theme,
  Tooltip,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import moment from 'moment'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { currency, useAppSelector } from '../../../../app/hooks'
import { authStore } from '../../../../app/selectedStore'
import { useDeleteSalaryAdvanceMutation, useGetListSalaryAdvanceQuery } from '../../../../app/services/salaryAdvance'
import { useGetStaticSalaryAdvanceQuery } from '../../../../app/services/statistic'
import { OPTION_COMPLETION, STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import SelectColumn from '../../../../components/filterTableCustom/SelectColumn'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../../components/toast'
import MainCard from '../../../../components/ui-component/cards/MainCard'
import { ChipCustom } from '../../../../components/ui-component/chipCustom'
import { gridSpacing, PERMISSION } from '../../../../constants'
import { convertDateToApi, removeNullOrEmpty } from '../../../../help'
import { SalaryAdvanceType } from '../../../../types/salaryAdvance'
import { SalaryRefundType } from '../../../../types/salaryRefund'
import FormAddEditSalaryRefund from '../salary_refund/FormAddEdit'
import FilterTableAdvanced from './FilterTableSalaryAdvance'
import FormAddEditSalaryAdvance from './FormAddEdit'
import FormChangeStatusSalaryAdvance from './FormChangeStatusSalaryAdvance'
import FormChangeStatusRefundMultiple from './FormChangeStatusSalaryRefundMultiple'

const SalaryAdvancePage = React.memo(() => {
  const theme = useTheme()
  const classes = styleSalaryAdvancePage(theme)
  const dialogs = useDialogs()
  const user = useAppSelector(authStore)?.user
  const checkPremisionRefund = [PERMISSION.ADMIN, PERMISSION.KETOAN]?.some(
    (e) => user?.role === e
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  const initialStartDate = searchParams.get('dateFrom') || ''
  const initialEndDate = searchParams.get('dateTo') || ''
  const initialKey = searchParams.get('key') || 'nameStaff'
  const initialStatusAdvance = searchParams.get('statusAdvance') || ''
  const initialIsRefund = searchParams.get('isRefund') || ''

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
  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const [openStatistics, setOpenStatistics] = React.useState(false)
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

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    key: initialKey,
    dateFrom: initialStartDate,
    dateTo: initialEndDate,
    statusAdvance: initialStatusAdvance,
    isRefund: initialIsRefund
  })
  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<SalaryAdvanceType>()
  const [rowsData, setRowsData] = React.useState<SalaryAdvanceType[]>()
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([])

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openFormAdd, setOpenFormAdd] = React.useState(false)
  const [openFormAddRefund, setOpenFormAddRefund] = React.useState(false)
  const [openFormChangeStatusSalaryAdvance, setOpenFormChangeStatusSalaryAdvance] = React.useState(false)
  const [openFormChangeRefundMultiple, setOpenFormChangeRefundMultiple] = React.useState(false)

  const {
    data: dataApiSalaryAdvance,
    isLoading,
    refetch
  } = useGetListSalaryAdvanceQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      dateFrom: filters.dateFrom ? convertDateToApi(filters.dateFrom) : '',
      dateTo: filters.dateTo ? convertDateToApi(filters.dateTo) : ''
    })
  )

  const [deleteSalaryAdvance, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteSalaryAdvanceMutation()

  const { data: dataStaticSalaryAdvance, refetch: refetchStatic } = useGetStaticSalaryAdvanceQuery({})
  const totalSalaryAdvance = dataStaticSalaryAdvance?.data?.totalSalaryAdvance || 0 //Đã ứng
  const totalSalaryRefund = dataStaticSalaryAdvance?.data?.totalSalaryRefund || 0 //Đã hoàn
  const totalSalaryRemaining = dataStaticSalaryAdvance?.data?.totalSalaryRemaining || 0 //Chưa ứng

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiSalaryAdvance?.data?.totalCount || 0

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    setOpenFormAdd(true)
  }

  const handleCloseForm = () => {
    setOpenFormAdd(false)
    setItemSelectedEidt({} as SalaryAdvanceType)
  }

  const handleClickOpenFormRefund = () => {
    setOpenFormAddRefund(true)
  }

  const handleCloseFormRefund = () => {
    setOpenFormAddRefund(false)
    setItemSelectedEidt({} as SalaryAdvanceType)
  }

  const handleClickOpenFormChangeStatusSalaryAdvance = () => {
    setOpenFormChangeStatusSalaryAdvance(true)
  }

  const handleCloseFormChangeStatusSalaryAdvance = () => {
    setOpenFormChangeStatusSalaryAdvance(false)
    setItemSelectedEidt({} as SalaryAdvanceType)
  }

  const handleFilterChange = React.useCallback(
    (field: string, value: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: value
      }))
    },
    [setFilters]
  )

  const listRenderFilter = [
    {
      key: 'date',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    {
      key: 'statusAdvance',
      label: `${STATUS_ADVANCE_SALARY.find((e) => e.value === initialStatusAdvance)?.label || ''}`
    },
    { key: 'isRefund', label: `${OPTION_COMPLETION.find((e) => e.value === initialIsRefund)?.label || ''}` }
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

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectionModel([...rowSelectionModel])
  }

  const resetCheckBox = () => {
    setSelectionModel([])
  }

  const handleClickRefundMultiple = () => {
    setOpenFormChangeRefundMultiple(true)
  }

  const handleCloseRefundMultiple = () => {
    setOpenFormChangeRefundMultiple(false)
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
      deleteSalaryAdvance({ ids: [Number(id)] })
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
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
          params.row.employeeId ? params.row.employee.name : params.row.staffId ? params.row.staff.name : ''
      },
      {
        field: 'phoneNumber',
        headerName: 'Số điện thoại',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
          params.row.employeeId
            ? params.row.employee.phoneNumber
            : params.row.staffId
              ? params.row.staff.phoneNumber
              : ''
      },
      {
        field: 'money',
        headerName: 'Số tiền',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
          params.row.money ? currency(params.row.money) : ''
      },
      {
        field: 'date',
        headerName: 'Ngày ứng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
          params.row.dateAdvance ? moment(params.row.dateAdvance).format('DD/MM/YYYY') : ''
      },
      {
        field: 'statusAdvance',
        headerName: 'Phê duyệt',
        // flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) => {
          const show = STATUS_ADVANCE_SALARY.find((e) => e.value === params.row.statusAdvance)
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
        field: 'isRefund',
        headerName: 'TT Hoàn ứng',
        align: 'center',
        renderCell: (params: GridRenderCellParams<SalaryAdvanceType, number>) => {
          const show = params.row.isRefund
          return show && <CheckCircleIcon sx={{ color: theme.palette.success.dark }} />
        }
      },
      {
        field: 'noteAdvance',
        headerName: 'Ghi chú',
        flex: 1
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        flex: 1,
        getActions: (param: GridRenderCellParams<SalaryAdvanceType, number>) => {
          return [
            checkPremisionRefund ? (
              <GridActionsCellItem
                icon={
                  <Tooltip title='Thêm hoàn ứng'>
                    <MoneyOutlined />
                  </Tooltip>
                }
                label='Thêm hoàn ứng'
                className='textPrimary'
                color='inherit'
                onClick={() => {
                  setItemSelectedEidt(param.row)
                  handleClickOpenFormRefund()
                }}
              />
            ) : (
              <> </>
            ),
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
                handleClickOpenFormChangeStatusSalaryAdvance()
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

  const CardContentBoxSection = ({ element }: { element: React.ReactNode }) => {
    return (
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Card
          sx={{
            bgcolor: theme.palette.background.paper,
            height: '100%'
          }}
        >
          <CardContent className={classes.CardContent}>{element}</CardContent>
        </Card>
      </Grid>
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
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiSalaryAdvance?.data?.rows?.map((row: SalaryAdvanceType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []
    setRowsData(updatedRows)
  }, [dataApiSalaryAdvance])

  React.useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  return (
    <>
      <IconButton sx={{ padding: 0 }} onClick={() => setOpenStatistics(!openStatistics)}>
        {openStatistics ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Collapse in={openStatistics} timeout='auto' unmountOnExit>
        <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
          <CardContentBoxSection
            element={
              <Grid item xs={12} sm={12} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography className={classes.TextCard} variant='subtitle1'>
                  {'Tổng tiền đã ứng'}
                </Typography>
                <Typography className={classes.TextCardValue} variant='h4'>
                  {currency(totalSalaryAdvance)}
                </Typography>
              </Grid>
            }
          />
          <CardContentBoxSection
            element={
              <Grid item xs={12} sm={12} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography className={classes.TextCard} variant='subtitle1'>
                  {'Tổng tiền đã hoàn'}
                </Typography>
                <Typography className={classes.TextCardValue} variant='h4'>
                  {currency(totalSalaryRefund)}
                </Typography>
              </Grid>
            }
          />
          <CardContentBoxSection
            element={
              <Grid item xs={12} sm={12} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography className={classes.TextCard} variant='subtitle1'>
                  {'Tổng tiền chưa ứng'}
                </Typography>
                <Typography className={classes.TextCardValue} variant='h4'>
                  {currency(totalSalaryRemaining)}
                </Typography>
              </Grid>
            }
          />
        </Grid>
      </Collapse>
      <MainCard title={'Ứng lương nhân sự'} sx={{ height: '84%' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{ mb: 2 }}>
            <OutlinedInput
              size='small'
              id='search-input'
              startAdornment={<IconSearch sx={{ mr: 1 }} />}
              placeholder='Tìm kiếm'
              value={filters?.searchKey}
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
              {selectionModel.length > 0 && (
                <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickRefundMultiple}>
                  Hoàn ứng
                </Button>
              )}
              <Button variant='outlined' onClick={handleClickOpenForm}>
                Thêm mới
              </Button>
            </div>
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
            rowSelectionModel={selectionModel}
            checkboxSelection
            // otherProps={{
            //   getRowClassName: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
            //     !params.row.isActive ? 'even' : 'odd'
            // }}
          />
        </div>

        <FormAddEditSalaryAdvance
          itemSelectedEdit={itemSelectedEdit}
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        />

        <FormAddEditSalaryRefund
          itemSelectedEdit={{} as SalaryRefundType}
          itemSelectedSalaryAdvance={itemSelectedEdit}
          open={openFormAddRefund}
          handleClose={handleCloseFormRefund}
          handleSave={() => {
            refetch()
            handleCloseFormRefund()
          }}
        />

        <FormChangeStatusSalaryAdvance
          itemSelectedEdit={itemSelectedEdit}
          open={openFormChangeStatusSalaryAdvance}
          handleClose={handleCloseFormChangeStatusSalaryAdvance}
          handleSave={() => {
            refetch()
            handleCloseFormChangeStatusSalaryAdvance()
          }}
        />

        <FormChangeStatusRefundMultiple
          ids={selectionModel ?? []}
          open={openFormChangeRefundMultiple}
          handleClose={handleCloseRefundMultiple}
          handleSave={() => {
            refetch()
            resetCheckBox()
            handleCloseRefundMultiple()
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

        <FilterTableAdvanced
          /* eslint-disable @typescript-eslint/no-explicit-any */
          handleComfirm={(value: any) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              ['isRefund']: value.isRefund,
              ['statusAdvance']: value.statusAdvance,
              ['dateFrom']: value.date?.[0],
              ['dateTo']: value.date?.[1]
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

export default SalaryAdvancePage

const styleSalaryAdvancePage = makeStyles({
  CardContent: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' },
  TextCard: { fontWeight: '500', fontSize: 13, marginBottom: 2 },
  TextCardValue: { marginBottom: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  iconArrow: { marginRight: 2 },
  CardContent1: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  })
})
