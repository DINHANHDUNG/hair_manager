import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRange } from '@mui/x-date-pickers-pro/models'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi' // Import ngôn ngữ tiếng Việt
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { SxProps } from '@mui/system'
import { TextFieldVariants, Theme } from '@mui/material'
import Calendar from '@mui/icons-material/Event'
import { PickersShortcutsItem } from '@mui/x-date-pickers'
// Sử dụng các plugin của dayjs
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Ho_Chi_Minh') // Đặt múi giờ mặc định

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'Hôm nay',
    getValue: () => {
      const today = dayjs()
      return [today, today]
    }
  },
  {
    label: 'Tuần này',
    getValue: () => {
      const today = dayjs()
      return [today.startOf('week'), today.endOf('week')]
    }
  },
  {
    label: 'Tuần trước',
    getValue: () => {
      const today = dayjs()
      const prevWeek = today.subtract(7, 'day')
      return [prevWeek.startOf('week'), prevWeek.endOf('week')]
    }
  },
  {
    label: '7 ngày qua',
    getValue: () => {
      const today = dayjs()
      return [today.subtract(7, 'day'), today]
    }
  },
  {
    label: 'Tháng này',
    getValue: () => {
      const today = dayjs()
      return [today.startOf('month'), today.endOf('month')]
    }
  },
  {
    label: 'Tháng sau',
    getValue: () => {
      const today = dayjs()
      const startOfNextMonth = today.endOf('month').add(1, 'day')
      return [startOfNextMonth, startOfNextMonth.endOf('month')]
    }
  }
  // { label: 'Reset', getValue: () => [null, null] }
]

interface Props {
  value: DateRange<Dayjs> | undefined
  setValue: (newValue: DateRange<Dayjs> | undefined) => void
  sx?: SxProps<Theme>
  variant?: TextFieldVariants
}

export default function DateRangePickerShortCut({ value, setValue, sx, variant }: Props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale='vi' // Thiết lập ngôn ngữ tiếng Việt
    >
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker
          sx={sx}
          slots={{ field: SingleInputDateRangeField }}
          name='allowedRange'
          value={value ?? undefined}
          onChange={(newValue) => setValue(newValue)}
          //   localeText={{ //Không hoạt động
          //     start: 'ádsd',
          //     end: 'ádasd'
          //   }}
          slotProps={{
            actionBar: {
              //   actions: ['clear'] // Button clear bên dưới
            },
            shortcuts: {
              items: shortcutsItems
            },
            // field: { clearable: true },
            textField: { variant: variant || 'outlined', InputProps: { endAdornment: <Calendar fontSize='small' /> } }
          }}
          //   slotProps={{
          //     field: {
          //       startText: 'Ngày bắt đầu',
          //       endText: 'Ngày kết thúc'
          //     }
          //   }}
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}
