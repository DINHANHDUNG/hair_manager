import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
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
      query: (params: { employeeId: number }) => ({
        url: NetWork.salaryAdvanceId(params.employeeId),
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
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListSalaryAdvanceQuery,
  useDeleteSalaryAdvanceMutation,
  useAddSalaryAdvanceMutation,
  useGetSalaryAdvanceByIdQuery,
  useUpdateSalaryAdvanceMutation
} = salaryAdvanceApi
