import { yupResolver } from '@hookform/resolvers/yup'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { Chip, Grid, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { STATUS_WORKING_EMPLOYEE } from '../../../../common/contants'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import MyTextField from '../../../../components/input/MyTextField'
import MySelect from '../../../../components/select/MySelect'
import { CustomTimelineItem } from '../../../../components/timeLine/CustomTimelineItem'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../../constants'
//Icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AppsIcon from '@mui/icons-material/Apps'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl'
import Timeline from '@mui/lab/Timeline'

import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import moment from 'moment'
import { convertDataLabel, handleMutation } from '../../../../app/hooks'
import { useGetListCompanyQuery } from '../../../../app/services/company'
import {
  useAddHistoryEmployeeMutation,
  useDeleteHistoryEmployeeMutation,
  useGetListHistoryEmployeeQuery,
  useUpdateHistoryEmployeeMutation
} from '../../../../app/services/employee'
import { useGetListCustomerQuery } from '../../../../app/services/customer'
import MyAutocomplete from '../../../../components/select/MyAutocomplete'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import { EmployeeType, HistoryEmployeeType } from '../../../../types/employee'
import { CompanyType } from '../../../../types/company'
import { CustomerType } from '../../../../types/customer'

type Field = 'date' | 'note' | 'status'

type FormValues = {
  companyId?: object | undefined
  customerId?: object | undefined
  note?: string
  employeeCode?: string
  status: string
  date: string
}

const validationSchema = yup.object({
  note: yup.string().max(255, 'Độ dài không được quá 255'),
  employeeCode: yup
    .string()
    .max(255, 'Độ dài không được quá 255')
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .matches(VALIDATE.noSpace, 'Vui lòng nhập đúng định dạng, viết liền không dấu'),
  status: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc'),
  companyId: yup.lazy((_, context) => {
    if (context.parent.status === 'IN_COMPANY') {
      return yup.object().required('Trường này là bắt buộc')
    }
    return yup.object().optional()
  }),
  customerId: yup.lazy((_, context) => {
    if (context.parent.status === 'IN_PARTNER') {
      return yup.object().required('Trường này là bắt buộc')
    }
    return yup.object().optional()
  }),
  date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
})

const renderContentLeft = (item: HistoryEmployeeType) => {
  return (
    <>
      <Typography variant='h6' color='GrayText'>
        {item.date
          ? dayjs(item.date)
              .locale('vi')
              .format('dddd')
              ?.replace(/^\w/, (c) => c.toUpperCase())
          : ''}
      </Typography>
      <Typography variant='caption' color='GrayText'>
        {item.date ? dayjs(item.date).format('DD/MM/YYYY') : ''}
      </Typography>
    </>
  )
}

const renderContentRight = (item: HistoryEmployeeType) => {
  const labelStatus = STATUS_WORKING_EMPLOYEE.find((e) => e.value === item.status)?.label || ''
  return (
    <>
      <Typography variant='h6' color='black'>
        {`${item.note}`}
      </Typography>
      <Typography variant='caption' color='GrayText'>
        {labelStatus}{' '}
        {`${item?.companyId ? ` | ${item?.company?.name}` : ''}${item?.customerId ? ` | ${item?.customer?.name}` : ''}${item?.employeeCode ? ` | ${item?.employeeCode}` : ''}`}
      </Typography>
    </>
  )
}

const renderColumn = (colDef: { field: string; headerName: string }) => {
  switch (colDef.field) {
    default:
      return colDef
  }
}

interface Props {
  dataEmployee: EmployeeType
  reloadData?: () => void
}

export default function TabWorkProgress(Props: Props) {
  const { dataEmployee } = Props
  const theme = useTheme()
  const dialogs = useDialogs()
  const myFormRef = useRef<Element | null>(null)
  const [typeList, setTypeList] = useState(false)
  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [rowsData, setRowsData] = useState<HistoryEmployeeType[]>()

  const { data: dataApiCustomer } = useGetListCustomerQuery({})
  const { data: dataApiCompany } = useGetListCompanyQuery({})

  const dataOptionCompany = convertDataLabel({ data: dataApiCompany?.data?.rows || [], key: 'name', value: 'id' })
  const dataOptionCustomer = convertDataLabel({ data: dataApiCustomer?.data?.rows || [], key: 'name', value: 'id' })

  const {
    data: dataApi,
    isLoading,
    refetch
  } = useGetListHistoryEmployeeQuery({
    employeeId: dataEmployee.id
  })
  const [deleteHistoryEmployee, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteHistoryEmployeeMutation()
  const [addHistoryEmployee, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddHistoryEmployeeMutation()
  const [
    updateHistoryEmployee,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateHistoryEmployeeMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApi?.data?.length || 0

  const data = [
    {
      field: 'order',
      headerName: 'No.',
      // flex: 1,
      width: 50
    },
    {
      field: 'date',
      headerName: 'Ngày',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<HistoryEmployeeType, number>) =>
        params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
    },
    { field: 'note', headerName: 'Nội dung', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<HistoryEmployeeType, number>) => {
        const label = STATUS_WORKING_EMPLOYEE.find((e) => e.value === params.row.status)?.label || ''
        const company = params?.row?.companyId ? ` | ${params?.row?.company?.name ?? ''}` : ''
        const customer = params?.row?.customerId ? ` | ${params?.row?.customer?.name ?? ''}` : ''
        return (
          label && (
            <Chip
              size='small'
              label={label + company + customer}
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
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 150,
      getActions: (param: GridRenderCellParams<HistoryEmployeeType, number>) => {
        return [
          <GridActionsCellItem
            icon={<EditOutlinedIcon />}
            label='edit'
            className='textPrimary'
            color='inherit'
            onClick={() => editItem(param.row)}
          />,
          <GridActionsCellItem
            onClick={() => handleDelete(param.row.id)}
            icon={<DeleteOutlinedIcon />}
            label='Delete'
            className='textPrimary'
            color='inherit'
          />
        ]
      }
    }
  ]

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data])

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const statusValue = watch('status')

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const company = data?.companyId as CompanyType
    const customer = data?.customerId as CustomerType
    const date = moment(data.date).startOf('day')
    const isoDateStr = date?.toISOString()
    if (idUpdate) {
      updateHistoryEmployee({
        ...data,
        employeeId: dataEmployee.id,
        date: isoDateStr,
        id: idUpdate,
        customerId: customer?.id,
        companyId: company?.id
      })
    } else {
      addHistoryEmployee({
        ...data,
        employeeId: dataEmployee.id,
        date: isoDateStr,
        customerId: customer?.id,
        companyId: company?.id
      })
    }
    setIdUpdate(0)
    reset()
    setIdUpdate(0)
    // handleSave(data)
  }

  const editItem = (item: HistoryEmployeeType) => {
    setIdUpdate(item.id)
    setValue('date', dayjs(item.date).toString())
    setValue('note', item.note)
    setValue('status', item.status)
    if (item.companyId) {
      setValue('companyId', { ...item.company, label: item.company.name, value: item.company.id })
    }
    if (item.customerId) {
      setValue('customerId', { ...item.customer, label: item.customer.name, value: item.customer.id })
    }
    clearErrors()
    scrollFormAddEdit()
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteHistoryEmployee({ ids: [Number(id)] })
    }
  }

  const addItem = () => {
    setIdUpdate(0)
    setValue('date', dayjs('2022-04-17T15:30').toString())
    reset()
    clearErrors()
    scrollFormAddEdit()
  }

  const scrollFormAddEdit = () => {
    if (myFormRef.current) {
      myFormRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleFormMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    error: unknown,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!loading && isError) {
      const newError = error as {
        data: {
          errors: string
          keyError: Field
          message: string
          status: string
        }
      }
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation({
      successMessage,
      errorMessage,
      isError,
      isSuccess,
      loading,
      refetch: () => {
        refetch()
        reset()
      }
    })
  }

  useEffect(() => {
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError,
      isSuccess,
      loading: loadingDelete,
      refetch
    })
  }, [loadingDelete])

  useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApi?.data?.map((row: HistoryEmployeeType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApi])

  useEffect(() => {
    handleFormMutation(loadingAdd, isErrorAdd, isSuccessAdd, error, 'Thêm mới thành công', 'Thêm mới không thành công')
  }, [loadingAdd])

  useEffect(() => {
    handleFormMutation(
      loadingUpdate,
      isErrorUpdate,
      isSuccessUpdate,
      errorUpdate,
      'Cập nhật thành công',
      'Cập nhật không thành công'
    )
  }, [loadingUpdate])

  return (
    <Grid container spacing={gridSpacingForm}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 3 }}>
        <SubCard
          title={
            <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
              <Typography variant='h5'>Quá trình làm việc </Typography>
              <div>
                <IconButton color='inherit' size='small' onClick={() => addItem()}>
                  <AddCircleOutlineIcon fontSize='inherit' />
                </IconButton>
                <IconButton color='inherit' size='small' onClick={() => setTypeList(!typeList)}>
                  {typeList ? <FormatListNumberedRtlIcon fontSize='inherit' /> : <AppsIcon fontSize='inherit' />}
                </IconButton>
              </div>
            </Grid>
          }
        >
          {typeList ? (
            <TableDataGrid
              rows={rows}
              columns={columns}
              isLoading={isLoading}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              // onRowSelectionChange={onRowSelectionChange}
              // onRowClick={onRowClick}
              // checkboxSelection
              otherProps={{
                getRowHeight: () => 'auto'
              }}
              filterMode='server'
              headerFilters={false}
              totalCount={rowTotal}
            />
          ) : (
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2
                }
              }}
            >
              {dataApi?.data &&
                [...dataApi.data]
                  ?.reverse()
                  ?.map((task, index) => (
                    <CustomTimelineItem
                      key={index}
                      leftContent={renderContentLeft(task)}
                      rightContent={renderContentRight(task)}
                      icon={task.icon}
                    />
                  ))}
            </Timeline>
          )}
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 3 }}>
        <SubCard title={`${idUpdate ? 'Cập nhật' : 'Thêm'} quá trình làm việc`}>
          <form ref={(ref) => (myFormRef.current = ref)} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacingForm}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MyTextField
                  name='employeeCode'
                  control={control}
                  label='Mã công nhân'
                  errors={errors}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MySelect
                  name='status'
                  control={control}
                  label='Trạng thái'
                  errors={errors}
                  options={STATUS_WORKING_EMPLOYEE}
                  variant='outlined'
                />
              </Grid>
              {statusValue === 'IN_COMPANY' && (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyAutocomplete
                    name='companyId'
                    control={control}
                    label='Chọn công ty'
                    errors={errors}
                    options={dataOptionCompany}
                    isOptionEqualToValue={(option, value) => {
                      return option.value === value.value
                    }}
                  />
                </Grid>
              )}
              {statusValue === 'IN_PARTNER' && (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyAutocomplete
                    name='customerId'
                    control={control}
                    label='Chọn vendor'
                    errors={errors}
                    options={dataOptionCustomer}
                    isOptionEqualToValue={(option, value) => {
                      return option.value === value.value
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MyDatePicker
                  name='date'
                  control={control}
                  label='Ngày'
                  errors={errors}
                  variant='outlined'
                  //   defaultValue={dayjs()}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MyTextField
                  multiline
                  rows={4}
                  name='note'
                  control={control}
                  label='Mô tả'
                  errors={errors}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
                <SubmitButton
                  variant='contained'
                  sx={{ float: 'right' }}
                  loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
                >
                  {idUpdate ? 'Cập nhật' : 'Thêm'}
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        </SubCard>
      </Grid>
    </Grid>
  )
}
