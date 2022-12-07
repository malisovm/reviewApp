import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IReview } from '../interfaces'

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    //getPokemonByName: builder.query<any, string>({
    //  query: (name) => `pokemon/${name}`,
    //}),
    addReview: builder.mutation<void, IReview>({
      query: (payload: IReview) => ({
        url: '/reviews',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
})

export const { useAddReviewMutation } = dataApi
