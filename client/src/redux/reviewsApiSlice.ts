import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IReview } from '../interfaces'

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/reviews' }),
  tagTypes: ['reviews', 'users'],
  endpoints: (builder) => ({
    getReviews: builder.query<IReview[], void>({
      query: (arg: void) => '/',
      providesTags: ['reviews'],
    }),
    addReview: builder.mutation<string, IReview>({
      query: (payload: IReview) => ({
        url: '/',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['reviews'],
    }),
    editReview: builder.mutation<string, IReview>({
      query: (payload: IReview) => ({
        url: '/',
        method: 'PUT',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['reviews'],
    }),
    deleteReview: builder.mutation<string, IReview>({
      query: (payload: IReview) => ({
        url: '/',
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          _id: payload._id,
          username: payload.username,
        },
      }),
      invalidatesTags: ['reviews', 'users'],
    }),
    searchReviews: builder.query<string[], string>({
      query: (payload: string) => ({
        url: '/search',
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          search: encodeURI(payload),
        },
      }),
    }),
  }),
})

export const {
  useAddReviewMutation,
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
  useDeleteReviewMutation,
  useEditReviewMutation,
  useLazySearchReviewsQuery,
} = reviewsApi
