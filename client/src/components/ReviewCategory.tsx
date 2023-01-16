import React from 'react'
import { IReview } from '../interfaces'
import ReviewCard from './ReviewCard'

interface IProps {
  reviews: IReview[]
  title: string
}

export default function ReviewColumn({ reviews, title }: IProps) {
  return (
    <section>
      <h1 className="text-center">{title}</h1>
      <article className="flex flex-col justify-center mt-5 gap-5 flex-wrap">
        {reviews?.map((review: IReview, index) => (
          <ReviewCard review={review} key={review._id} />
        ))}
      </article>
    </section>
  )
}
