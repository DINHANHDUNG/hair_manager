import './assets/app.scss'
import { RouterProvider } from 'react-router-dom'
import NavigationScroll from './components/layout/NavigationScroll'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
// defaultTheme
import themes from './themes'
import { useAppSelector } from './app/hooks'
import { customTheme } from './app/selectedStore'
import router from './routers'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { DialogsProvider } from '@toolpad/core/useDialogs'

import dayjs from 'dayjs'
import 'dayjs/locale/vi' // Import ngôn ngữ tiếng Việt
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Ho_Chi_Minh') // Đặt múi giờ mặc định

//Chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

LicenseInfo.setLicenseKey(process.env.REACT_APP_PUBLIC_MUI_LICENSE_KEY || '')
function App() {
  const customization = useAppSelector(customTheme)
  return (
    <StyledEngineProvider injectFirst>
      <DialogsProvider>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <NavigationScroll>
              <RouterProvider router={router} />
            </NavigationScroll>
          </SnackbarProvider>
        </ThemeProvider>
      </DialogsProvider>
    </StyledEngineProvider>
  )
}

export default App
