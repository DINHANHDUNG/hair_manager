import { yupResolver } from '@hookform/resolvers/yup'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { Chip, Grid, IconButton, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { OPTIONSTATUSWORK, OPTIONTYPEWORK } from '../../../../common/contants'
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
import { handleMutation } from '../../../../app/hooks'
import {
  useAddHistoryStaffMutation,
  useDeleteHistoryStaffMutation,
  useGetListHistoryStaffQuery,
  useUpdateHistoryStaffMutation
} from '../../../../app/services/staff'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import { HistoryStaffType, StaffType } from '../../../../types/staff'

type FormValues = {
  note: string
  date: string
  type: string
  status: string
}

type Field = 'type' | 'date' | 'note' | 'status'

const validationSchema = yup.object({
  note: yup.string().max(255).required('Trường này là bắt buộc'),
  type: yup.string().max(255).required('Trường này là bắt buộc'),
  status: yup.string().max(255).required('Trường này là bắt buộc'),
  date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
})

const renderContentLeft = (item: HistoryStaffType) => {
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

const renderContentRight = (item: HistoryStaffType) => {
  const labelType = OPTIONTYPEWORK.find((e) => e.value === item.type)?.label || ''
  const labelStatus = OPTIONSTATUSWORK.find((e) => e.value === item.status)?.label || ''
  return (
    <>
      <Typography variant='h6' color='black'>
        {item.note}
      </Typography>
      <Typography variant='caption' color='GrayText'>
        {labelStatus} | {labelType}
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
  dataStaff: StaffType
  reloadData?: () => void
}

export default function TabWorkProgress(Props: Props) {
  const { dataStaff } = Props
  const dialogs = useDialogs()
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

  const myFormRef = useRef<Element | null>(null)
  const [typeList, setTypeList] = useState(false)
  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [rowsData, setRowsData] = useState<HistoryStaffType[]>()

  const {
    data: dataApi,
    isLoading,
    refetch
  } = useGetListHistoryStaffQuery({
    staffId: dataStaff.id
  })
  const [deleteHistoryStaff, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteHistoryStaffMutation()
  const [addHistoryStaff, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddHistoryStaffMutation()
  const [
    updateHistoryStaff,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateHistoryStaffMutation()

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
      renderCell: (params: GridRenderCellParams<HistoryStaffType, number>) =>
        params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
    },
    { field: 'note', headerName: 'Nội dung', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<HistoryStaffType, number>) => {
        const label = OPTIONSTATUSWORK.find((e) => e.value === params.row.status)?.label || ''
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
      field: 'type',
      headerName: 'Hình thức',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<HistoryStaffType, number>) => {
        const label = OPTIONTYPEWORK.find((e) => e.value === params.row.type)?.label || ''
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
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 150,
      getActions: (param: GridRenderCellParams<HistoryStaffType, number>) => {
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

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data, dataApi])

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const date = moment(data.date).startOf('day')
    const isoDateStr = date?.toISOString()
    if (idUpdate) {
      updateHistoryStaff({ ...data, StaffId: dataStaff.id, date: isoDateStr, id: idUpdate })
    } else {
      addHistoryStaff({ ...data, StaffId: dataStaff.id, date: isoDateStr })
    }
    setIdUpdate(0)
    // handleSave(data)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteHistoryStaff({ ids: [Number(id)] })
    }
  }

  const editItem = (item: HistoryStaffType) => {
    setIdUpdate(item.id)
    setValue('date', dayjs(item.date).toString())
    setValue('note', item.note)
    setValue('status', item.status)
    setValue('type', item.type)
    clearErrors()
    scrollFormAddEdit()
  }

  const addItem = () => {
    setIdUpdate(0)
    reset()
    clearErrors()
    scrollFormAddEdit()
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

  const scrollFormAddEdit = () => {
    if (myFormRef.current && matchDownMd) {
      myFormRef.current.scrollIntoView({ behavior: 'smooth' })
    }
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
      dataApi?.data?.map((row: HistoryStaffType, index: number) => ({
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
      <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ mb: 3 }}>
        <SubCard
          title={
            <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
              <Typography variant='h5'>Quá trình làm việc</Typography>
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
              setPaginationModel={(model) => {
                setPaginationModel(model)
              }}
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
                [...dataApi.data]?.reverse()?.map((task: HistoryStaffType, index: number) => (
                  <CustomTimelineItem
                    key={index}
                    leftContent={renderContentLeft(task)}
                    rightContent={renderContentRight(task)}
                    // icon={task.icon}
                  />
                ))}
            </Timeline>
          )}
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} sx={{ mb: 3 }}>
        <SubCard title={`${idUpdate ? 'Cập nhật' : 'Thêm'} quá trình làm việc`}>
          <form ref={(ref) => (myFormRef.current = ref)} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacingForm}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MySelect
                  name='status'
                  control={control}
                  label='Trạng thái'
                  errors={errors}
                  options={OPTIONSTATUSWORK}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MySelect
                  name='type'
                  control={control}
                  label='Hình thức'
                  errors={errors}
                  options={OPTIONTYPEWORK}
                  variant='outlined'
                />
              </Grid>
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
