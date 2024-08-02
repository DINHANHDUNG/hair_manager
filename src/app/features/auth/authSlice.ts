import { createSlice } from '@reduxjs/toolkit'
import { AccountType } from '../../../types/account'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {} as AccountType,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload.data
      state.accessToken = accessToken
      state.refreshToken = refreshToken

      // Save tokens to local storage
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = {} as AccountType

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})

export const { setCredentials, logout, setUser } = authSlice.actions

export default authSlice.reducer
