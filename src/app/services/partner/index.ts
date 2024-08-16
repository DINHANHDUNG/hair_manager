import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import { PartnerType } from '../../../types/partner'

export const partnerApi = createApi({
  reducerPath: 'partnerApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Partner'],
  endpoints: (builder) => ({
    getListPartner: builder.query({
      query: (params) => ({
        url: NetWork.partner,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: PartnerType[] }>) =>
          result ? [{ type: 'Partner', id: 'LIST' }] : []
      })
    }),
    getPartnerById: builder.query({
      query: (params: { partnerId: number }) => ({
        url: NetWork.partnerId(params.partnerId),
        method: GET
      })
    }),
    addPartner: builder.mutation({
      query: (data) => ({
        url: NetWork.partner,
        method: POST,
        data: data
      })
    }),
    updatePartner: builder.mutation({
      query: (data) => ({
        url: NetWork.partnerId(data.id),
        method: PUT,
        data: data
      })
    }),
    deletePartner: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.partner,
        method: DELETE,
        data: data
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListPartnerQuery,
  useDeletePartnerMutation,
  useAddPartnerMutation,
  useGetPartnerByIdQuery,
  useUpdatePartnerMutation
} = partnerApi
