import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { axiosBaseQuery } from '../../baseQuery'

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Customer', 'DetailCustomer'],
  endpoints: (builder) => ({
    getListCustomer: builder.query({
      query: (params) => ({
        url: NetWork.customer,
        method: GET,
        params: params
      }),
      providesTags: (result) => (result ? [{ type: 'Customer', id: 'LIST' }] : [])
    }),
    getCustomerById: builder.query({
      query: (params: { customerId: number }) => ({
        url: NetWork.customerId(params.customerId),
        method: GET
      }),
      providesTags: (result) => (result ? [{ type: 'DetailCustomer', id: 'DETAIL' }] : [])
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: NetWork.customer,
        method: POST,
        data: data
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }]
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: NetWork.customerId(data.id),
        method: PUT,
        data: data
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }]
    }),
    changeAccCustomer: builder.mutation({
      query: (data) => ({
        url: NetWork.customerChangeAcc(),
        method: POST,
        data: data
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }]
    }),
    deleteCustomer: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.customer,
        method: DELETE,
        data: data
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListCustomerQuery,
  useDeleteCustomerMutation,
  useAddCustomerMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
  useChangeAccCustomerMutation
} = customerApi
