import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { CompanyType } from '../../../types/company'
import { axiosBaseQuery } from '../../baseQuery'

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Company'], // Đảm bảo tagType là 'Company'
  endpoints: (builder) => ({
    getListCompany: builder.query({
      query: (params) => ({
        url: NetWork.company,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: CompanyType[] }>) =>
          result ? [{ type: 'Company', id: 'LIST' }] : [] // Cung cấp tag 'Company' với id 'LIST'
      })
    }),
    getCompanyById: builder.query({
      query: (params: { companyId: number }) => ({
        url: NetWork.companyId(params.companyId),
        method: GET
      })
    }),
    addCompany: builder.mutation({
      query: (data) => ({
        url: NetWork.company,
        method: POST,
        data: data
      })
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: NetWork.companyId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteCompany: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.company,
        method: DELETE,
        data: data
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListCompanyQuery,
  useDeleteCompanyMutation,
  useAddCompanyMutation,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation
} = companyApi
