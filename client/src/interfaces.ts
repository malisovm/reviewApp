export interface IReview {
  id: string
  title: string
  product: string
  group: string
  tags?: string[]
  text: string
  pic?: string
  rating: number
}