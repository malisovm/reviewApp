import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IReview, IUser } from '../interfaces'

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['reviews', 'users'],
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
          _id: payload._id,
          username: payload.username,
        },
      }),
      invalidatesTags: ['reviews', 'users'],
    }),
    getUsers: builder.query<IUser[], void>({
      query: (arg: void) => '/users',
      providesTags: ['users'],
    }),
    authenticateUser: builder.mutation<string, IUser>({
      query: (payload: IUser) => ({
        url: '/users/login',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['reviews'],
    }),
    socialAuth: builder.mutation<string, any>({
      query: (payload: any) => ({
        url: `/users/socialauth/${payload.socialNetwork}`,
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['reviews'],
    }),
    addUser: builder.mutation<string, IUser>({
      query: (payload: IUser) => ({
        url: '/users/newuser',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['users'],
    }),
    checkSession: builder.mutation<IUser, string>({
      query: (payload: string) => ({
        url: '/users/checksession',
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          token: payload
        },
      }),
    }),
    searchReviews: builder.query<string[], string>({
      query: (payload: string) => ({
        url: '/reviews/search',
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
  useAddUserMutation,
  useAuthenticateUserMutation,
  useGetUsersQuery,
  useLazySearchReviewsQuery,
  useCheckSessionMutation,
  useSocialAuthMutation
} = dataApi
