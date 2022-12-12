import React from 'react'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'

export default function MyReviews() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>An error occured</h1>

  return (
    <div className="flex justify-center mt-3 gap-3 flex-wrap">
      {reviews?.map((review: IReview, index) => (
        <ReviewCard review={review} />
      ))}
    </div>
  )
}
