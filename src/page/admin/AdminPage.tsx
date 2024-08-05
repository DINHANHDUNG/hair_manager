import {
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { GridRenderHeaderFilterProps } from '@mui/x-data-grid-pro'
import * as React from 'react'
import { CustomSelectFilterDataGrid } from '../../components/table-data-grid/CustomFilterDataGrid'
import CustomInputFilterDataGrid from '../../components/table-data-grid/CustomInputFilterDataGrid'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'
import { Box, Button, Grid, OutlinedInput, Tab, Tabs } from '@mui/material'
import { gridSpacing } from '../../constants'
import IconSearch from '@mui/icons-material/Search'
import SingleInputDateRangePicker from '../../components/dateTime/DateRangePickerShortCut'
import { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'
import MySnackbar from '../../components/snackbar/MySnackbar'
import { useSnackbar } from 'notistack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../routers/helpersRouter/constantRouter'

const AdminPage = React.memo(() => {
  const navigate = useNavigate()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 1
  })
  const [filters, setFilters] = React.useState<{ [field: string]: string }>({})
  const [tab, setTab] = React.useState(0)
  const [valueRangeDate, setValueRangeDate] = React.useState<DateRange<Dayjs> | undefined>(undefined)
  // dayjs('2022-04-17'),
  // dayjs('2022-04-21')
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickNotistack = () => {
    enqueueSnackbar('This is a default message!', {
      variant: 'success',
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
    })
  }

  const handleClickWithCustomContent = () => {
    const action = (key: string | number) => (
      <React.Fragment>
        <Button color='inherit' size='small' onClick={() => navigate(`/${ROUTES.ORDER}/${ROUTES.ORDER_DETAIL}`)}>
          UNDO
        </Button>
        <IconButton size='small' color='inherit' onClick={() => closeSnackbar(key)}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </React.Fragment>
    )
    enqueueSnackbar('This is a message with custom content.', {
      variant: 'info',
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      action
    })
  }
  // const handleClickVariant = (variant: 'success' | 'error' | 'warning' | 'info') => () => {
  //   enqueueSnackbar('This is a ' + variant + ' message!', { variant })
  // }

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 4) return
    setTab(newValue)
  }

  const rows: GridRowsProp = [
    { id: 18, username: 'Alice', age: 25, address: 'Charlie' },
    { id: 22, username: 'Bob', age: 30, address: 'David' },
    { id: 33, username: 'Charlie', age: 35, address: 'Eve' }
    // Thêm các hàng dữ liệu khác nếu cần
  ]

  // Hàm để cập nhật giá trị filter
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    console.log(rowSelectionModel, details)
  }

  const data = {
    columns: [
      // { field: 'id', headerName: 'ID' },
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
      { field: 'username', headerName: 'User Name' },
      { field: 'address', headerName: 'Địa chỉ' },
      { field: 'age', headerName: 'Tuổi' }
      // Thêm các cột khác nếu cần
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      case 'username':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomSelectFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
              data={[{ value: 'true', label: 'true' }]}
            />
          )
        }

      case 'address':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomInputFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
            />
          )
        }
      case 'age':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomInputFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
              type='number'
            />
          )
        }

      default:
        return {
          ...colDef,
          renderHeaderFilter: () => <></>
        }
    }
  }

  const columns: GridColDef[] = React.useMemo(
    () => data.columns.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  return (
    <MainCard>
      <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs variant='scrollable' value={tab} onChange={handleChangeTab} aria-label='basic tabs example'>
              <Tab label='Tất cả đơn hàng' {...a11yProps(0)} />
              <Tab label='Theo tháng' {...a11yProps(1)} />
              <Tab label='Theo tuần' {...a11yProps(2)} />
              <SingleInputDateRangePicker
                sx={{ pl: 2, pr: 2 }}
                value={valueRangeDate}
                setValue={(newValue) => setValueRangeDate(newValue)}
                variant='standard'
              />
            </Tabs>
          </Box>
        </Grid>
      </Grid>
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
            <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickWithCustomContent}>
              Thông báo
            </Button>
            <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClick}>
              Thêm mới
            </Button>
            <Button variant='outlined' color='error' onClick={handleClickNotistack}>
              Xóa
            </Button>
          </div>
        </Grid>
      </Grid>

      <div style={{ height: '65vh', width: '100%', overflow: 'auto' }}>
        <TableDataGrid
          rows={rows}
          columns={columns}
          isLoading={false}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onRowSelectionChange={onRowSelectionChange}
          checkboxSelection
          filterMode='server'
          headerFilters={true}
          // toolbarEnable={true}
          // handleSearchChange={(e) => setKeyword(e.target.value)}
          // searchValue={keyword}
        />
      </div>
      <MySnackbar open={open} message='Đây là một thông báo!' severity='success' onClose={handleClose} />
    </MainCard>
  )
})

export default AdminPage
