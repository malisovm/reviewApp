export interface IReview {
  title: string
  product: string
  group: string
  tags: {value: string}[]
  text: string
  pic: string
  rating: number
}