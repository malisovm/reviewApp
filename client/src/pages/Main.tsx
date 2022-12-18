import React from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'

export default function Main() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  var fiveNewest: IReview[] = []
  if (reviews) fiveNewest = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  if (isLoading) return <h1 className="text-xl">Loading...</h1>
  if (isError) return <h1 className="text-red-700 text-xl">An error occured</h1>

  return (
    <div className="flex flex-row justify-between mx-3 mt-6">
      <section>
        <h1 className='text-lg font-bold text-center mb-3'>NEWEST REVIEWS</h1>
        <div className="flex justify-center mt-5 gap-3 flex-wrap">
          {fiveNewest?.map((review: IReview, index) => (
            <ReviewCard review={review} key={review.title} />
          ))}
        </div>
      </section>
      <div>
        <TagsCloud />
      </div>
    </div>
  )
}
