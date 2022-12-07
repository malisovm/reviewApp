import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = 'en'

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state = action.payload
    },
  },
})

export const { setLocale } = localeSlice.actions
export default localeSlice.reducer
