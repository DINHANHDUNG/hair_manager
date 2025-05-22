import { AddCircle, AddTask, BorderAll, FileDownload, HighlightOff, Verified } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import IconSearch from '@mui/icons-material/Search'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { Button, Grid, IconButton, OutlinedInput, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridCellParams,
  GridColDef,
  GridColumnGroupingModel,
  GridRenderCellParams,
  GridRenderEditCellParams,
  // GridRowParams,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid'
import { useGridApiRef } from '@mui/x-data-grid-pro'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import moment from 'moment'
import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { handleMutation, useHasPermission } from '../../app/hooks'
import { useGetListCustomerQuery } from '../../app/services/customer'
import {
  useDeleteOrderMutation,
  useGetListOrderQuery,
  useUpdateOrderMutation
  // useUploadFileOrderMutation
} from '../../app/services/order'
import {
  checkBg,
  checkColor,
  OPTIONS_ORDER_KEY,
  OPTIONS_STATUS_HISTORY_PROD,
  OPTIONS_STATUS_ORDER,
  OPTIONS_STATUS_QL_ORDER,
  OPTIONS_STATUS_SALE_ORDER
} from '../../common/contants'
import { VALIDATE } from '../../common/validate'
import { AutocompleteEditCell } from '../../components/table-data-grid/cellAutocomplete'
import { DateEditCell } from '../../components/table-data-grid/cellDate'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import { TextEditCell } from '../../components/table-data-grid/textEditCell'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing, PERMISSION } from '../../constants'
import { convertDataLabelAutoComplate, convertDateToApi, removeNullOrEmpty } from '../../help'
import { Perm_Invoice_Add, Perm_Order_Add, Perm_Order_Edit, Perm_Order_HistoryPrd_View } from '../../help/permission'
import { ErrorType } from '../../types'
import { FieldCOrder, OrderType } from '../../types/order'
import FilterTableAdvanced from './FilterTableAdvanced'
import InvoiceRepairDetailPanel from './InvoiceRepairDetailPanel'
import FormAddNewOrder from './modalAddNew'
import FormAddEditInvoice from './modalInvoice'
import ModalProductionHistory from './modalProductionHistory'

const ChipCustom = styled(Chip)(({ theme }) => ({
  color: theme.palette.background.default,
  backgroundColor: theme.palette.grey[500],
  marginRight: '5px',
  marginBottom: '5px',
  '& .MuiChip-label': {
    paddingRight: 5
  }
}))

const OrderPage = React.memo(() => {
  const apiRef = useGridApiRef()
  const permAdd = useHasPermission(Perm_Order_Add)
  const permEdit = useHasPermission(Perm_Order_Edit)
  const checkQL = useHasPermission([PERMISSION.QUANLY])
  const checkAD = useHasPermission([PERMISSION.ADMIN])
  const checkSale = useHasPermission([PERMISSION.SALE])
  const permHistoryProductionsView = useHasPermission(Perm_Order_HistoryPrd_View)
  const permInvoiceAdd = useHasPermission(Perm_Invoice_Add)
  const dialogs = useDialogs()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '0') || 0
  const initialPageSize = parseInt(searchParams.get('pageSize') || '10') || 10
  const initialSearchKey = searchParams.get('searchKey') || ''
  // const initialKey = searchParams.get('key') || 'code'
  const initialCode = searchParams.get('code') || ''

  const initialStartDate = searchParams.get('dateReceiveFrom') || ''
  const initialEndDate = searchParams.get('dateReceiveTo') || ''

  const initialStartDateDelivery = searchParams.get('dateDeliveryFrom') || ''
  const initialEndDateDelivery = searchParams.get('dateDeliveryTo') || ''

  const initialStatusOrder = searchParams.get('statusOrder') || ''
  const initialName = searchParams.get('customerName') || ''

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: initialPageSize,
    page: initialPage
  })

  const [filters, setFilters] = React.useState<{ [field: string]: string }>({
    searchKey: initialSearchKey,
    // key: initialKey,
    code: initialCode,
    dateReceiveFrom: initialStartDate,
    dateReceiveTo: initialEndDate,
    dateDeliveryFrom: initialStartDateDelivery,
    dateDeliveryTo: initialEndDateDelivery,
    statusOrder: initialStatusOrder,
    customerName: initialName
  })
  // const fileRef = React.useRef<HTMLInputElement>(null)
  const [rowsData, setRowsData] = React.useState<OrderType[]>()
  const [itemSelectedEdit, setItemSelectedEidt] = React.useState<OrderType>()

  const [openDetail, setOpenDetail] = React.useState(false)
  const [openStatistics, setOpenStatistics] = React.useState(false)
  const [modalInvoice, setModalInvoice] = React.useState(false)
  const [modalAddOrder, setModalAddOrder] = React.useState(false)
  const [modalProductionHistory, setModalProductionHistory] = React.useState(false)

  // const { data: dataStaticStaffDetail, refetch: refetchStatic } = useGetStaticOrderDetailQuery({})
  // const countStatusFail = dataStaticStaffDetail?.data?.countStatusFail || 0 //Phỏng vấn trượt
  // const countStatusInCustomer = dataStaticStaffDetail?.data?.countStatusInCustomer || 0 //Cho vendor mượn
  // const countStatusInCompany = dataStaticStaffDetail?.data?.countStatusInCompany || 0 //Trong công ty
  // const countStatusInHome = dataStaticStaffDetail?.data?.countStatusInHome || 0 //Chờ giao việc
  // const countStatusOut = dataStaticStaffDetail?.data?.countStatusOut || 0 //Đã nghỉ việc
  // const countStatusWaiting = dataStaticStaffDetail?.data?.countStatusWaiting || 0 //Chờ phỏng vấn

  const { data: dataApiCustomer } = useGetListCustomerQuery({ isActive: true })
  const dataOptionCustomer = convertDataLabelAutoComplate({
    data: dataApiCustomer?.data?.rows || [],
    key: 'name',
    value: 'id'
  })
  const [
    updateOrder,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateOrderMutation()
  const [deleteOrder, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteOrderMutation()

  const {
    data: dataApiOrder,
    isLoading,
    refetch
  } = useGetListOrderQuery(
    removeNullOrEmpty({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      ...filters,
      dateReceiveFrom: filters.dateReceiveFrom ? convertDateToApi(filters.dateReceiveFrom) : '',
      dateReceiveTo: filters.dateReceiveTo ? convertDateToApi(filters.dateReceiveTo) : '',
      dateDeliveryFrom: filters.dateDeliveryFrom ? convertDateToApi(filters.dateDeliveryFrom) : '',
      dateDeliveryTo: filters.dateDeliveryTo ? convertDateToApi(filters.dateDeliveryTo) : ''
    }),
    {
      refetchOnMountOrArgChange: true
    }
  )
  // const [
  //   uploadFileOrder,
  //   { isLoading: loadingUpload, isSuccess: isSuccessUpload, isError: isErrorUpload, error: ErrorUpload }
  // ] = useUploadFileOrderMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApiOrder?.data?.totalCount || 0

  //Start filter

  const [openFilterAdvanced, setOpenFilterAdvanced] = React.useState(false)
  const anchorAdvancedRef = React.useRef<HTMLDivElement>(null)

  const handleModalInvoice = () => {
    setModalInvoice(!modalInvoice)
  }

  const handleModalAddOrder = () => {
    if (!modalAddOrder === false) setItemSelectedEidt({} as OrderType)
    setModalAddOrder(!modalAddOrder)
  }

  const handleModalEditInfoOrder = () => {
    setModalAddOrder(!modalAddOrder)
  }

  const handleModalProductionHistory = () => {
    if (!modalProductionHistory === false) setItemSelectedEidt({} as OrderType)
    setModalProductionHistory(!modalProductionHistory)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteOrder({ ids: [Number(id)] })
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

  const prevOpenAdvanced = React.useRef(openFilterAdvanced)
  React.useEffect(() => {
    if (prevOpenAdvanced.current === true && openFilterAdvanced === false) {
      anchorAdvancedRef?.current?.focus()
    }

    // prevOpen.current = openFilter
    prevOpenAdvanced.current = openFilterAdvanced
  }, [openFilterAdvanced])

  //End filter

  // const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase()
  //     const validExtensions = ['xlsx', 'xls']

  //     if (fileExtension && validExtensions.includes(fileExtension)) {
  //       const formData = new FormData()
  //       formData.append('file', file)
  //       uploadFileOrder(formData)
  //     } else {
  //       Toast({ text: 'Vui lòng chọn file excel (xlsx, xls)', variant: 'error' })
  //     }
  //   }
  //   if (fileRef.current) {
  //     fileRef.current.value = ''
  //   }
  // }

  const handleClickDetail = () => {
    setOpenDetail(!openDetail)
  }

  const handleClickOpenForm = () => {
    // setOpenFormAdd(true)
    handleModalAddOrder()
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

  const onRowClick = () => {
    handleClickDetail()
  }

  const changeSttOrder = (id: number, status: string) => {
    updateOrder({ id: id, statusOrder: status })
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getChangedFields = (newRow: any, oldRow: any) => {
    return Object.keys(newRow).find((key) => newRow[key] !== oldRow[key])
  }

  const processRowUpdate = React.useCallback((newRow: any, oldRow: any) => {
    // So sánh hoặc xử lý dữ liệu tại đây
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      // Cập nhật dữ liệu lên server tại đây nếu muốn (ví dụ gọi API update)
      const changedFields = getChangedFields(newRow, oldRow)
      const payload = { ...newRow }

      // if (changedFields?.includes('statusOrder') && payload.statusOrder === OPTIONS_ORDER_KEY.CANCEL) {
      //   //Call api xoá
      //   deleteOrder({ ids: [Number(newRow.id)] })
      //   return newRow
      // }

      if (changedFields?.includes('customerId')) {
        payload.customerId = newRow.customerId ? Number(newRow.customerId) : null
      }
      if (changedFields?.includes('discount')) {
        payload.discount = newRow.discount ? Number(newRow.discount) : null
      }

      updateOrder(payload)
    }

    return newRow // Quan trọng: phải return lại row đã cập nhật
  }, [])
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const data = {
    columns: [
      {
        field: 'order',
        headerName: 'No.',
        width: 30
      },
      { field: 'code', headerName: 'Mã đơn hàng', editable: checkSale, renderEditCell: TextEditCell }, //Sell
      {
        field: 'customerId',
        headerName: 'Khách hàng',
        editable: checkSale,
        renderEditCell: (params: GridRenderEditCellParams) => (
          <AutocompleteEditCell {...params} options={dataOptionCustomer} />
        ),
        renderCell: (params: GridRenderCellParams<OrderType, number>) => params.row?.customer?.name || ''
      }, //Sell

      {
        field: 'customerPhone',
        headerName: 'Số điện thoại',
        editable: checkSale,
        preProcessEditCellProps: (params: GridRenderEditCellParams) => {
          const isValidPhone = VALIDATE.phoneRelaxed // ví dụ: bắt đầu bằng 0 và 10 số
          return {
            ...params.props,
            error: !isValidPhone
          }
        },
        renderEditCell: TextEditCell
      }, //Sell

      {
        field: 'customerAddress',
        headerName: 'Địa chỉ',
        editable: checkSale,
        renderEditCell: TextEditCell
      }, //Sell

      {
        field: 'historyProductions',
        headerName: 'Lịch sử sản xuất',
        // renderCell: (params: GridRenderCellParams<OrderType, number>) =>
        //   params.row.historyProductions.length > 0 ? params.row.historyProductions?.[0]?.status : ''
        renderCell: (params: GridRenderCellParams) => {
          const status = params.row.historyProductions.length > 0 ? params.row.historyProductions?.[0]?.status : ''
          const checkStatus = OPTIONS_STATUS_HISTORY_PROD.find((e) => e.value === status?.toString())
          const label =
            moment(params?.row?.historyProductions?.[0]?.date).format('DD/MM').toString() + ' ' + checkStatus?.label
          if (!checkStatus) return null

          return (
            <Chip
              label={label}
              sx={{
                backgroundColor: checkBg(checkStatus.value),
                color: checkColor(checkStatus.value),
                fontWeight: 500
              }}
              size='small'
              // variant='outlined'
            />
          )
        }
      }, //QL

      {
        field: 'statusOrder',
        headerName: 'Trạng thái bán hàng',
        editable: checkSale,
        renderEditCell: (params: GridRenderEditCellParams) => (
          <AutocompleteEditCell {...params} options={checkQL ? OPTIONS_STATUS_QL_ORDER : OPTIONS_STATUS_SALE_ORDER} />
        ),
        renderCell: (params: GridRenderCellParams) => {
          const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
          if (!status) return null

          return (
            <Chip
              label={status.label}
              sx={{
                backgroundColor: checkBg(status.value),
                color: checkColor(status.value),
                fontWeight: 500
              }}
              size='small'
              variant='outlined'
            />
          )
        }
      }, //QL

      {
        field: 'statusManufacture',
        headerName: 'Trạng thái sản xuất',
        editable: checkQL,
        renderEditCell: (params: GridRenderEditCellParams) => (
          <AutocompleteEditCell {...params} options={OPTIONS_STATUS_QL_ORDER} />
        ),
        renderCell: (params: GridRenderCellParams) => {
          const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
          if (!status) return null

          return (
            <Chip
              label={status.label}
              sx={{
                backgroundColor: checkBg(status.value),
                color: checkColor(status.value),
                fontWeight: 500
              }}
              size='small'
              variant='outlined'
            />
          )
        }
      }, //QL

      {
        field: 'dateReceive',
        headerName: 'Ngày xưởng nhận đơn',
        editable: checkQL,
        renderCell: (params: GridRenderCellParams<OrderType, number>) =>
          params.row.dateReceive ? dayjs(params.row.dateReceive).format('DD/MM/YYYY') : '',
        renderEditCell: DateEditCell
      },

      {
        field: 'dateEstimateDelivery',
        headerName: 'Ngày dự kiến xuất',
        editable: checkQL,
        renderCell: (params: GridRenderCellParams<OrderType, number>) =>
          params.row.dateEstimateDelivery ? dayjs(params.row.dateEstimateDelivery).format('DD/MM/YYYY') : '',
        renderEditCell: DateEditCell
      }, //QL

      {
        field: 'dateDelivery',
        headerName: 'Ngày thực tế giao',
        editable: checkQL,
        renderCell: (params: GridRenderCellParams<OrderType, number>) =>
          params.row.dateDelivery ? dayjs(params.row.dateDelivery).format('DD/MM/YYYY') : '',
        renderEditCell: DateEditCell
      }, //QL

      { field: 'rate', headerName: 'Đánh giá sx', editable: checkQL, renderEditCell: TextEditCell }, //QL
      // {
      //   field: 'discount',
      //   headerName: 'Tiền discount',
      //   editable: permEdit,
      //   renderEditCell: TextEditCell,
      //   renderCell: (params: GridRenderCellParams<OrderType, number>) =>
      //     params.row.discount ? formatNumber(Number(params.row.discount)) : ''
      // },

      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        getActions: (params: GridRenderCellParams<OrderType, number>) => [
          permEdit ? (
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label='Edit'
              className='textPrimary'
              color='inherit'
              onClick={() => {
                setItemSelectedEidt(params.row)
                handleModalEditInfoOrder()
              }}
            />
          ) : (
            <></>
          ),
          // <GridActionsCellItem
          //   icon={<VisibilityOutlinedIcon />} //Dùng cho xem invoid mở file PDF
          //   label='Eye'
          //   className='textPrimary'
          //   color='inherit'
          //   // onClick={handleModalEditInfoOrder}
          // />,
          <GridActionsCellItem
            onClick={() => handleDelete(params.row.id)}
            icon={<DeleteOutlinedIcon />}
            label='Delete'
            className='textPrimary'
            color='inherit'
          />,
          checkSale ? (
            <GridActionsCellItem
              icon={<HighlightOff />}
              label='Hủy đơn'
              onClick={() => changeSttOrder(params.row.id, OPTIONS_ORDER_KEY.CANCEL)}
              showInMenu
            />
          ) : (
            <></>
          ), //Truyền id và stt cancel
          permInvoiceAdd ? (
            <GridActionsCellItem
              icon={<AddCircle />}
              label='Tạo invoice'
              onClick={() => {
                setItemSelectedEidt(params.row)
                handleModalInvoice()
              }}
              showInMenu
            />
          ) : (
            <></>
          ),
          checkQL ? (
            <GridActionsCellItem
              icon={<BorderAll />}
              label='Đã nhận hàng cần sửa'
              onClick={() => changeSttOrder(params.row.id, OPTIONS_ORDER_KEY.RECEIVED_ORDER_REPAIR)}
              showInMenu
            />
          ) : (
            <></>
          ),
          checkSale ? (
            <GridActionsCellItem
              icon={<AddTask />}
              label='Nhận hàng'
              onClick={() => changeSttOrder(params.row.id, OPTIONS_ORDER_KEY.RECEIVED)}
              showInMenu
            />
          ) : (
            <></>
          ),
          checkSale ? (
            <GridActionsCellItem
              icon={<Verified />}
              label='Hoàn thành'
              onClick={() => changeSttOrder(params.row.id, OPTIONS_ORDER_KEY.DONE)}
              showInMenu
            />
          ) : (
            <></>
          ),
          <GridActionsCellItem
            icon={<FileDownload />}
            label='Tải đơn'
            // onClick={() => handleModalInvoice()}
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
        { field: 'order_edit_date_note' },
        { field: 'dateReceive2' }
      ]
    }
  ]

  const onCellDoubleClick = (param: GridCellParams) => {
    if (param.field === 'historyProductions' && permHistoryProductionsView) {
      setItemSelectedEidt(param.row)
      handleModalProductionHistory()
    }
  }

  const columns: GridColDef[] = React.useMemo(() => {
    const filteredColumns = data.columns.filter((col) => {
      // Chỉ sale được xem
      if ((checkQL || checkAD) && ['discount', 'customerPhone'].includes(col.field)) return false
      // if (checkSale && ['statusManufacture'].includes(col.field)) return false
      // if (checkQL && ['statusOrder'].includes(col.field)) return false
      return true
    })

    return filteredColumns.map((colDef) => renderColumn(colDef))
  }, [data.columns, filters])

  const listRenderFilter = [
    { key: 'customerName', label: initialName || '' },
    {
      key: 'dateReceive',
      label:
        initialStartDate && initialEndDate
          ? `${moment(initialStartDate).format('DD/MM/YYYY')} ~ ${moment(initialEndDate).format('DD/MM/YYYY')}`
          : ''
    },
    {
      key: 'dateDelivery',
      label:
        initialStartDateDelivery && initialEndDateDelivery
          ? `${moment(initialStartDateDelivery).format('DD/MM/YYYY')} ~ ${moment(initialEndDateDelivery).format('DD/MM/YYYY')}`
          : ''
    },
    {
      key: 'statusOrder',
      label: initialStatusOrder ? OPTIONS_STATUS_ORDER.find((e) => e.value === initialStatusOrder)?.label : ''
    },
    {
      key: 'code',
      label: initialCode || ''
    }
  ]

  const RenderFilter = ({ label, key }: { label: string; key: string }) => {
    const handleClose = () => {
      if (key === 'dateReceive') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['dateReceiveTo']: '',
          ['dateReceiveFrom']: ''
        }))
        return
      }
      if (key === 'dateDelivery') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ['dateDeliveryTo']: '',
          ['dateDeliveryFrom']: ''
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

  React.useEffect(() => {
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError: isError,
      isSuccess: isSuccess,
      loading: loadingDelete,
      refetch: () => null
    })
  }, [loadingDelete])

  React.useEffect(() => {
    if (!loadingUpdate) {
      const newError = errorUpdate as ErrorType<FieldCOrder>

      handleMutation({
        successMessage: 'Thao tác thành công',
        errorMessage: newError && !newError?.data?.keyError ? newError?.data?.message : 'Thao tác không thành công',
        isError: isErrorUpdate,
        isSuccess: isSuccessUpdate,
        loading: loadingUpdate,
        refetch: () => null
      })
    }
  }, [loadingUpdate])

  React.useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApiOrder?.data?.rows?.map((row: OrderType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApiOrder])

  return (
    <>
      <IconButton sx={{ padding: 0 }} onClick={() => setOpenStatistics(!openStatistics)}>
        {openStatistics ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      {/* <Collapse in={openStatistics} timeout='auto' unmountOnExit>
        <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
          <CardContentBoxSection title={'Tổng đợn'} content={countStatusInCompany} />
          <CardContentBoxSection title={'Đơn huỷ'} content={countStatusInCustomer} />
          <CardContentBoxSection title={'Đang sản xuất'} content={countStatusOut} />
          <CardContentBoxSection title={'Đóng gói'} content={countStatusFail} />
          <CardContentBoxSection title={'Chờ giao'} content={countStatusWaiting} />
          <CardContentBoxSection title={'Đã gửi hàng'} content={countStatusInHome} />
        </Grid>
      </Collapse> */}
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
              {permAdd && (
                <Button variant='outlined' sx={{ mr: 1 }} onClick={handleClickOpenForm}>
                  Thêm mới
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} display={'flex'} flexWrap={'wrap'} flexDirection={'row'} alignItems={'center'}>
            {listRenderFilter.map((val) => RenderFilter({ label: val?.label || '', key: val?.key }))}
          </Grid>
        </Grid>
        <div style={{ width: '100%', overflow: 'auto', marginTop: '20px' }}>
          <TableDataGrid
            // key={rowTotal}
            // editMode="cell"
            apiRef={apiRef}
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
            onCellClick={onCellDoubleClick}
            otherProps={{
              columnGroupingModel: columnGroupingModel
            }}
            pinnedColumns={{ right: ['actions'] }}
            getDetailPanelContent={(row) =>
              row.invoiceRepairs?.length > 0 ? <InvoiceRepairDetailPanel data={row.invoiceRepairs} /> : null
            }
            getDetailPanelHeight={(row) => (row.invoiceRepairs?.length > 0 ? row.invoiceRepairs.length * 60 + 100 : 0)}
            pagination
            // isRowExpandable={(params) => params.row.invoiceRepairs?.length > 0}
          />
        </div>
        {/* <FormAddEditWorker
          open={openFormAdd}
          handleClose={handleCloseForm}
          handleSave={() => {
            refetch()
            handleCloseForm()
          }}
        /> */}
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

      <FormAddEditInvoice
        handleClose={() => {
          handleModalInvoice()
          refetch()
        }}
        open={modalInvoice}
        orderId={itemSelectedEdit?.id}
      />
      <FormAddNewOrder itemSelectedEdit={itemSelectedEdit} handleClose={handleModalAddOrder} open={modalAddOrder} />
      <ModalProductionHistory
        itemSelectedEdit={itemSelectedEdit}
        handleClose={handleModalProductionHistory}
        open={modalProductionHistory}
      />

      <FilterTableAdvanced
        /* eslint-disable @typescript-eslint/no-explicit-any */
        handleComfirm={(value: any) => {
          setFilters((prevFilters) => ({
            ...prevFilters,
            ['customerName']: value.customerName,
            ['statusOrder']: value.statusOrder,
            ['dateReceiveFrom']: value.dateReceive?.[0],
            ['dateReceiveTo']: value.dateReceive?.[1],
            ['dateDeliveryFrom']: value.dateDelivery?.[0],
            ['dateDeliveryTo']: value.dateDelivery?.[1],
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
