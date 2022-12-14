import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { dataApi } from './apiSlice'
import localReducer from './localSlice'

export const store = configureStore({
  reducer: {
    local: localReducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dataApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
