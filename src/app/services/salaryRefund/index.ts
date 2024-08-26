import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, PATCH, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import { SalaryRefundType } from '../../../types/salaryRefund'

export const salaryRefundApi = createApi({
  reducerPath: 'salaryRefundApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['SalaryRefund'],
  endpoints: (builder) => ({
    getListSalaryRefund: builder.query({
      query: (params) => ({
        url: NetWork.salaryRefund,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: SalaryRefundType[] }>) =>
          result ? [{ type: 'SalaryRefund', id: 'LIST' }] : []
      })
    }),
    getSalaryRefundById: builder.query({
      query: (params: { salaryRefundId: number }) => ({
        url: NetWork.salaryRefundId(params.salaryRefundId),
        method: GET
      })
    }),
    addSalaryRefund: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryRefund,
        method: POST,
        data: data
      })
    }),
    updateSalaryRefund: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryRefundId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteSalaryRefund: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.salaryRefund,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'SalaryRefund', id: 'LIST' }] // Vô hiệu hóa tag 'SalaryRefund' với id 'LIST' để gọi lại getListSalaryRefund
      })
    }),
    changeStatusSalaryRefund: builder.mutation({
      query: (data: { salaryRefundId: number; params: { statusRefund: string } }) => ({
        url: NetWork.salaryRefundStatus(data.salaryRefundId),
        method: PATCH,
        params: data.params
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListSalaryRefundQuery,
  useDeleteSalaryRefundMutation,
  useAddSalaryRefundMutation,
  useGetSalaryRefundByIdQuery,
  useUpdateSalaryRefundMutation,
  useChangeStatusSalaryRefundMutation
} = salaryRefundApi
