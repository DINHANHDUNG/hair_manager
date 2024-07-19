import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import authReducer from './features/auth/authSlice'
import customizationReducer from './features/customization/customizationSlice'
import { pokemonApi } from './services/pokemon'
import { authApi } from './services/auth'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    customization: customizationReducer,
    //RTKQR
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware, authApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
