import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { axiosBaseQuery } from '../../baseQuery'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Payment'], // Đảm bảo tagType là 'Payment'
  endpoints: (builder) => ({
    getListPayment: builder.query({
      query: (params) => ({
        url: NetWork.payment,
        method: GET,
        params: params
      }),
      providesTags: (result) => (result ? [{ type: 'Payment', id: 'LIST' }] : [])
    }),
    getPaymentById: builder.query({
      query: (params: { paymentId: number }) => ({
        url: NetWork.paymentId(params.paymentId),
        method: GET
      })
    }),
    addPayment: builder.mutation({
      query: (data) => ({
        url: NetWork.payment,
        method: POST,
        data: data
      })
    }),
    updatePayment: builder.mutation({
      query: (data) => ({
        url: NetWork.paymentId(data.orderPaymentId),
        method: PUT,
        data: data
      })
    }),
    deletePayment: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.payment,
        method: DELETE,
        data: data
      })
    }),
    approverPayment: builder.mutation({
      query: (data) => ({
        url: NetWork.paymentApprover(data.id),
        method: PUT
        // data: data
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListPaymentQuery,
  useDeletePaymentMutation,
  useAddPaymentMutation,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useApproverPaymentMutation
} = paymentApi
