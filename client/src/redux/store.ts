import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { reviewsApi } from './reviewsApiSlice'
import { usersApi } from './usersApiSlice'
import localReducer from './localSlice'

export const store = configureStore({
  reducer: {
    local: localReducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reviewsApi.middleware).concat(usersApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
