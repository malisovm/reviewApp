import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../interfaces'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/users' }),
  tagTypes: ['reviews', 'users'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: (arg: void) => '/users',
      providesTags: ['users'],
    }),
    authenticateUser: builder.mutation<string, IUser>({
      query: (payload: IUser) => ({
        url: '/login',
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
        url: `/socialauth/${payload.socialNetwork}`,
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
        url: '/newuser',
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
        url: '/checksession',
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          token: payload,
        },
      }),
    }),
  }),
})

export const {
  useAddUserMutation,
  useAuthenticateUserMutation,
  useGetUsersQuery,
  useCheckSessionMutation,
  useSocialAuthMutation,
} = usersApi
