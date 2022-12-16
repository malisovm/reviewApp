import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IReview } from '../interfaces'

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['reviews'],
  endpoints: (builder) => ({
    getReviews: builder.query<IReview[], void>({
      query: (arg: void) => '/reviews',
      providesTags: ['reviews'],
    }),
    addReview: builder.mutation<string, IReview>({
      query: (payload: IReview) => ({
        url: '/reviews',
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
        url: '/reviews',
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
        url: '/reviews',
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          title: payload.title,
        },
      }),
      invalidatesTags: ['reviews'],
    }),
  }),
})

export const { useAddReviewMutation, useGetReviewsQuery, useDeleteReviewMutation, useEditReviewMutation } = dataApi
