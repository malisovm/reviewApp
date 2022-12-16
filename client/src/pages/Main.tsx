import React from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'

export default function Main() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1 className="text-red-700">An error occured</h1>

  return (
    <div className="flex flex-row w-5/ justify-between mx-3 mt-6">
      <div className="flex justify-center mt-3 gap-3 flex-wrap">
        {reviews?.map((review: IReview, index) => (
          <ReviewCard review={review} key={review.title} />
        ))}
      </div>
      <div className="1/6">
        <TagsCloud />
      </div>
    </div>
  )
}
