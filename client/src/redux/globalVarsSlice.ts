import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

var initialTheme: string | null
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  initialTheme = 'dark'
else initialTheme = 'light'

const initialState = { theme: initialTheme, locale: 'en' }

const globalVarsSlice = createSlice({
  name: 'globalVars',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    },
  },
})

export const { setLocale, setTheme } = globalVarsSlice.actions
export default globalVarsSlice.reducer
