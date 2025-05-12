import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { axiosBaseQuery } from '../../baseQuery'
// import { ReponseData } from '../../types'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Order', 'DetailOrder'], // Đảm bảo tagType là 'Order'
  endpoints: (builder) => ({
    getListOrder: builder.query({
      query: (params) => ({
        url: NetWork.order,
        method: GET,
        params: params
      }),
      providesTags: (result) => (result ? [{ type: 'Order', id: 'LIST' }] : [])
    }),
    getOrderById: builder.query({
      query: (params: { orderId: number }) => ({
        url: NetWork.orderId(params.orderId),
        method: GET
      }),
      providesTags: (result) => (result ? [{ type: 'DetailOrder', id: 'DETAIL' }] : [])
    }),
    addOrder: builder.mutation({
      query: (data) => ({
        url: NetWork.order,
        method: POST,
        data: data
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }]
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: NetWork.orderId(data.id),
        method: PUT,
        data: data
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }]
    }),
    deleteOrder: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.order,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'Order', id: 'LIST' }] // Vô hiệu hóa tag 'Order' với id 'LIST' để gọi lại getListOrder
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }]
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListOrderQuery,
  useDeleteOrderMutation,
  useAddOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation
} = orderApi
