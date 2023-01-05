import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

var initialTheme: string | null
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  initialTheme = 'dark'
else initialTheme = 'light'

export const initialUser = { name: '', role: 'unauthorized', likes: 0 }

export type TagFilterType = { type: 'tag', value: string }
export type SearchFilterType = {type: 'search', search: string, ids: string[] }
type FilterType = TagFilterType | SearchFilterType | null

interface IState {
  theme: string | null,
  locale: string,
  user: {name: string, role: string, likes:number},
  alert: {text: string, variant: string},
  filter: FilterType
}

const initialState: IState = {
  theme: initialTheme,
  locale: 'en',
  user: initialUser,
  alert: { text: '', variant: '' },
  filter: null
}

const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    },
    setUser(state, action: PayloadAction<{ name: string; role: string, likes: number }>) {
      state.user = action.payload
    },
    setAlert(state, action: PayloadAction<{ text: string; variant: string }>) {
      state.alert = action.payload
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload
    },
  },
})

export const { setLocale, setTheme, setUser, setAlert, setFilter } = localSlice.actions
export default localSlice.reducer
