// import { useGetPokemonByNameQuery } from './app/services/pokemon'
// import { Counter } from './components/counter'
import './assets/app.scss'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import HomePage from './page/home/HomePage'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'
import Login from './page/login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import AdminPage from './page/admin/AdminPage'
import DatabaseLayout from './components/layout/DatabaseLayout'
import DatabasePage from './page/database/DatabasePage'
import NavigationScroll from './components/layout/NavigationScroll'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

// defaultTheme
import themes from './themes'
import { useAppSelector } from './app/hooks'
import { customTheme } from './app/selectedStore'

function App() {
  // const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  const customization = useAppSelector(customTheme)
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route element={<UnauthenticatedRoute />}>
                <Route path='/login' element={<Login />} />
              </Route>
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path='/admin' element={<AdminLayout />}>
                  <Route index element={<AdminPage />} />
                </Route>
              </Route>
              <Route element={<ProtectedRoute roles={['database']} />}>
                <Route path='/database' element={<DatabaseLayout />}>
                  <Route index element={<DatabasePage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
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
