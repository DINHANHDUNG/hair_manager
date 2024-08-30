import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, PATCH, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import { SalaryPayType } from '../../../types/SalaryPay'

export const salaryPayApi = createApi({
  reducerPath: 'salaryPayApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['SalaryPay'],
  endpoints: (builder) => ({
    getListSalaryPay: builder.query({
      query: (params) => ({
        url: NetWork.salaryPay,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: SalaryPayType[] }>) =>
          result ? [{ type: 'SalaryPay', id: 'LIST' }] : []
      })
    }),
    getSalaryPayById: builder.query({
      query: (params: { salaryPayId: number }) => ({
        url: NetWork.salaryPayId(params.salaryPayId),
        method: GET
      })
    }),
    addSalaryPay: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryPay,
        method: POST,
        data: data
      })
    }),
    updateSalaryPay: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryPayId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteSalaryPay: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.salaryPay,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'SalaryPay', id: 'LIST' }] // Vô hiệu hóa tag 'SalaryPay' với id 'LIST' để gọi lại getListSalaryPay
      })
    }),
    changeStatusSalaryPay: builder.mutation({
      query: (data: { salaryPayId: number; params: { statusPay: string } }) => ({
        url: NetWork.salaryPayStatus(data.salaryPayId),
        method: PATCH,
        params: data.params
      })
    }),
    uploadFile: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryPayUpload,
        method: POST,
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListSalaryPayQuery,
  useDeleteSalaryPayMutation,
  useAddSalaryPayMutation,
  useGetSalaryPayByIdQuery,
  useUpdateSalaryPayMutation,
  useChangeStatusSalaryPayMutation,
  useUploadFileMutation
} = salaryPayApi
