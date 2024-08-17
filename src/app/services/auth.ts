import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../baseQuery'
import { setCredentials, setUser } from '../features/auth/authSlice'
import { NetWork } from '../../common/apiKey'
import { GET, POST } from '../../common/contants'
// import { ReponseData } from '../../types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  //   tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: NetWork.login,
        method: POST,
        data: data
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (err) {
          console.error('Login failed', err)
        }
      }
    }),
    change_pass_staff: builder.mutation({
      query: (data) => ({
        url: NetWork.account_changePass,
        method: POST,
        data: data
      })
    }),
    getAccount: builder.query({
      query: () => ({
        url: NetWork.account,
        method: GET
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
        } catch (err) {
          console.error('Get Account failed', err)
        }
      }
    }),
    getRoles: builder.query({
      query: () => ({
        url: NetWork.role,
        method: GET
      })
    })
  })
})

// Export hooks for usage in functional components
export const { useLoginMutation, useGetAccountQuery, useGetRolesQuery, useChange_pass_staffMutation } = authApi
