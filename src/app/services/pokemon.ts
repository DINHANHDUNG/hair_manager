import { createApi } from '@reduxjs/toolkit/query/react'
import { API_URL, NetWork } from '../../common/apiKey'
import { axiosBaseQuery } from '../baseQuery'
import { GET } from '../../common/contants'

export const pokemonApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: API_URL }),
  //   tagTypes: [],
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: string) => ({ method: GET, url: NetWork.pokemon + `pokemon/${name}` })
    })
  })
})

// Export hooks for usage in functional components
export const { useGetPokemonByNameQuery } = pokemonApi
