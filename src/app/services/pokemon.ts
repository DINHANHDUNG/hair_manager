import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../common/apiKey'
import { axiosBaseQuery } from '../baseQuery'
import { GET } from '../../common/contants'
// import { ReponseData } from '../../types'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: axiosBaseQuery,
  //   tagTypes: [],
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: string) => ({ method: GET, url: NetWork.pokemon + `pokemon/${name}` })
      // transformResponse: (response) => response, //Trả ra theo ý muốn nếu cần
    })
  })
})

// Export hooks for usage in functional components
export const { useGetPokemonByNameQuery } = pokemonApi
