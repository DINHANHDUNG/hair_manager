import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../baseQuery'
import { setCredentials } from '../features/auth/authSlice'
// import { ReponseData } from '../../types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  //   tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { username, password }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (err) {
          console.error('Login failed', err)
        }
      }
    })
  })
})

// Export hooks for usage in functional components
export const { useLoginMutation } = authApi
