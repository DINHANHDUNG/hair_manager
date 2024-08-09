import { yupResolver } from '@hookform/resolvers/yup'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { Grid, IconButton, Typography, useMediaQuery } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { COLORS } from '../../../../common/colors'
import { OPTIONSTATUSWORK, OPTIONTYPEWORK } from '../../../../common/contants'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import MyTextField from '../../../../components/input/MyTextField'
import MySelect from '../../../../components/select/MySelect'
import { CustomTimelineItem } from '../../../../components/timeLine/CustomTimelineItem'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../../constants'
import { useTheme } from '@mui/material/styles'
//Icon
import AppsIcon from '@mui/icons-material/Apps'
import CodeIcon from '@mui/icons-material/Code'
import CoffeeIcon from '@mui/icons-material/Coffee'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import TripOriginIcon from '@mui/icons-material/TripOrigin'
import WorkIcon from '@mui/icons-material/Work'
import Timeline from '@mui/lab/Timeline'

import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'

interface tasksType {
  time: string
  date: string
  description: string
  status: string
  typeWork: string
  icon?: React.ReactElement
}

type FormValues = {
  description: string
  date: string
  typeWork: string
  status: string
}

const validationSchema = yup.object({
  description: yup.string().max(255).required('Trường này là bắt buộc'),
  typeWork: yup.string().max(255).required('Trường này là bắt buộc'),
  status: yup.string().max(255).required('Trường này là bắt buộc'),
  date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
})

const renderContentLeft = (item: tasksType) => {
  return (
    <>
      <Typography variant='h6' color='GrayText'>
        {item.time}
      </Typography>
      <Typography variant='caption' color='GrayText'>
        {item.date}
      </Typography>
    </>
  )
}

const renderContentRight = (item: tasksType) => {
  return (
    <>
      <Typography variant='h6' color='black'>
        {item.description}
      </Typography>
      <Typography variant='caption' color='GrayText'>
        {item.status} | {item.typeWork}
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

export default function TabWorkProgress() {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))
  const myFormRef = useRef<Element | null>(null)
  const [typeList, setTypeList] = useState(false)
  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const data = [
    {
      field: 'order',
      headerName: 'No.',
      // flex: 1,
      width: 50,
      renderCell: (params: GridRenderCellParams) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
        const { page, pageSize } = params.api.state.pagination.paginationModel
        return page * pageSize + (rowIndex + 1)
      }
    },
    { field: 'date', headerName: 'Ngày', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Nội dung', flex: 1, minWidth: 150 },
    { field: 'status', headerName: 'Trạng thái', flex: 1, minWidth: 150 },
    { field: 'typeWork', headerName: 'Hình thức', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 150,
      getActions: () => {
        return [
          <GridActionsCellItem
            icon={<EditOutlinedIcon />}
            label='edit'
            className='textPrimary'
            color='inherit'
            onClick={() => {
              setIdUpdate(1)
              setValue('date', dayjs('2022-04-17T15:30').toString())
              setValue(
                'description',
                'Payment transaction [method: Credit Card, typeWork: sale, amount: $90,020, status: Processing ]'
              )
              setValue('status', 'WORKING')
              setValue('typeWork', 'PROBATION')
              clearErrors()
              if (myFormRef.current && matchDownMd) {
                myFormRef.current.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          />,
          <GridActionsCellItem icon={<DeleteOutlinedIcon />} label='Delete' className='textPrimary' color='inherit' />
        ]
      }
    }
  ]

  const tasks = [
    {
      time: 'Thứ 7',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Start Work',
      icon: <WorkIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 6',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Payment transaction [method: Credit Card, typeWork: sale, amount: $90,020, status: Processing ]',
      icon: <CoffeeIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 6',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Sent a notification to the client by e-mail.',
      icon: <MeetingRoomIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 5',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'he order was placed.',
      icon: <CodeIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 5',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Lunch Break',
      icon: <TripOriginIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 3',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Continue Coding',
      icon: <CodeIcon sx={{ color: COLORS.bgButton }} />
    },
    {
      time: 'Thứ 5',
      date: '20/05/2024',
      status: 'Đang làm việc',
      typeWork: 'Chính thức',
      description: 'Client Meeting',
      icon: <MeetingRoomIcon sx={{ color: COLORS.bgButton }} />
    },
    { time: 'Thứ 5', date: '20/05/2024', description: 'End Work', status: 'Đang làm việc', typeWork: 'Thử việc' }
  ] as tasksType[]

  const rows: GridRowsProp = tasks.map((task, index) => ({
    id: index,
    order: index + 1,
    date: task.date,
    status: task.status,
    typeWork: task.typeWork,
    description: task.description
  }))

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data])

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
    reset()
    setIdUpdate(0)
    // handleSave(data)
  }

  return (
    <Grid container spacing={gridSpacingForm}>
      <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ mb: 3 }}>
        <SubCard
          title={
            <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
              <Typography variant='h5'>Quá trình làm việc</Typography>
              <IconButton color='inherit' size='small' onClick={() => setTypeList(!typeList)}>
                {typeList ? <FormatListNumberedRtlIcon fontSize='inherit' /> : <AppsIcon fontSize='inherit' />}
              </IconButton>
            </Grid>
          }
        >
          {typeList ? (
            <TableDataGrid
              rows={rows}
              columns={columns}
              isLoading={false}
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
            />
          ) : (
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2
                }
              }}
            >
              {tasks.map((task, index) => (
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
                  name='typeWork'
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
                  name='description'
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
