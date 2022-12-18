export interface IReview {
  _id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  rating: number
  user: string
  date: string
}

export interface IUser {
  _id: string
  name: string
  password: string
  role: string
}