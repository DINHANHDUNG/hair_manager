import './assets/app.scss'
import { RouterProvider } from 'react-router-dom'
import NavigationScroll from './components/layout/NavigationScroll'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

// defaultTheme
import themes from './themes'
import { useAppSelector } from './app/hooks'
import { customTheme } from './app/selectedStore'
import router from './routers'
import { LicenseInfo } from '@mui/x-data-grid-pro'

LicenseInfo.setLicenseKey(process.env.REACT_APP_PUBLIC_MUI_LICENSE_KEY || '')
function App() {
  // const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  const customization = useAppSelector(customTheme)
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <RouterProvider router={router} />
          {/* <Counter /> */}

          {/* {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null} */}
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
