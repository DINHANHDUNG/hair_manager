import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {} as { role: string },
    accessToken: null,
    refreshToken: null
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user
    },
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = { role: '' }
    }
  }
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
