export interface IReview {
  _id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  verdict: number
  user: string
  date: string
  ratings: { user: string; rate: number }[]
  likes: string[]
  avgRate?: number
  comments: { user: string; text: string }[]
}

export interface IUser {
  _id: string
  name: string
  password: string
  role: string
  likes: number
}