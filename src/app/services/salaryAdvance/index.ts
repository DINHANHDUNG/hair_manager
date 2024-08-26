import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, PATCH, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import { SalaryAdvanceType } from '../../../types/salaryAdvance'

export const salaryAdvanceApi = createApi({
  reducerPath: 'salaryAdvanceApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['SalaryAdvance'],
  endpoints: (builder) => ({
    getListSalaryAdvance: builder.query({
      query: (params) => ({
        url: NetWork.salaryAdvance,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: SalaryAdvanceType[] }>) =>
          result ? [{ type: 'SalaryAdvance', id: 'LIST' }] : []
      })
    }),
    getSalaryAdvanceById: builder.query({
      query: (params: { salaryAdvanceId: number }) => ({
        url: NetWork.salaryAdvanceId(params.salaryAdvanceId),
        method: GET
      })
    }),
    addSalaryAdvance: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryAdvance,
        method: POST,
        data: data
      })
    }),
    updateSalaryAdvance: builder.mutation({
      query: (data) => ({
        url: NetWork.salaryAdvanceId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteSalaryAdvance: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.salaryAdvance,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'SalaryAdvance', id: 'LIST' }] // Vô hiệu hóa tag 'SalaryAdvance' với id 'LIST' để gọi lại getListSalaryAdvance
      })
    }),
    changeStatusSalaryAdvance: builder.mutation({
      query: (data: { salaryAdvanceId: number; params: { statusAdvance: string } }) => ({
        url: NetWork.salaryAdvanceStatus(data.salaryAdvanceId),
        method: PATCH,
        params: data.params
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListSalaryAdvanceQuery,
  useDeleteSalaryAdvanceMutation,
  useAddSalaryAdvanceMutation,
  useGetSalaryAdvanceByIdQuery,
  useUpdateSalaryAdvanceMutation,
  useChangeStatusSalaryAdvanceMutation
} = salaryAdvanceApi
