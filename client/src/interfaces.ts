export interface IReview {
  _id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  verdict: number
  username: string
  date: string
  ratings: { _id?: string; user: string; rate: number }[]
  avgRate: number
  likes: string[]
  comments: { _id?: string; user: string; text: string }[]
}

export interface IUser {
  _id: string
  username: string
  password: string
  role: string
  likes: number
}

export type TagFilterType = { type: 'tag', value: string }
export type SearchFilterType = {type: 'search', search: string, ids: string[] }
export type FilterType = TagFilterType | SearchFilterType | null

export interface IState {
  theme: string | null,
  locale: string,
  user: {username: string, role: string, likes:number},
  alert: {text: string, variant: string},
  filter: FilterType
}

export interface IUserResponse extends IUser {
  message: string
  token: string
}
