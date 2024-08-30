import { configureStore } from '@reduxjs/toolkit'

//Slice
import counterReducer from './features/counter/counterSlice'
import authReducer from './features/auth/authSlice'
import customizationReducer from './features/customization/customizationSlice'

//Api
import { pokemonApi } from './services/pokemon'
import { authApi } from './services/auth'
import { staffApi } from './services/staff'
import { companyApi } from './services/company'
import { partnerApi } from './services/partner'
import { employeeApi } from './services/employee'
import { salaryAdvanceApi } from './services/salaryAdvance'
import { salaryRefundApi } from './services/salaryRefund'
import { salaryPayApi } from './services/salaryPay'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    customization: customizationReducer,
    //RTKQR
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [partnerApi.reducerPath]: partnerApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [salaryAdvanceApi.reducerPath]: salaryAdvanceApi.reducer,
    [salaryRefundApi.reducerPath]: salaryRefundApi.reducer,
    [salaryPayApi.reducerPath]: salaryPayApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pokemonApi.middleware,
      authApi.middleware,
      staffApi.middleware,
      companyApi.middleware,
      partnerApi.middleware,
      employeeApi.middleware,
      salaryAdvanceApi.middleware,
      salaryRefundApi.middleware,
      salaryPayApi.middleware
    )
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
