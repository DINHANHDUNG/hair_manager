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
          console.log('data', data)

          dispatch(setCredentials(data))
        } catch (err) {
          console.error('Login failed', err)
        }
      }
    }),
    getAccount: builder.query({
      query: () => ({
        url: NetWork.account,
        method: GET
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log('data', data)
          dispatch(setUser(data))
        } catch (err) {
          console.error('Get Account failed', err)
        }
      }
    })
  })
})

// Export hooks for usage in functional components
export const { useLoginMutation, useGetAccountQuery } = authApi
