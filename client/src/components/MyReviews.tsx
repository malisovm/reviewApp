import React from 'react'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ScoreIndicator from './ScoreIndicator'

export default function MyReviews() {
  const { data, isLoading, isError } = useGetReviewsQuery()
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>An error occured</h1>

  return (
    <div className="flex justify-center mt-3 gap-3 flex-wrap">
      {data?.map((review: IReview, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img src="https://placeimg.com/400/225/arch" alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {review.title}
              <div
                className={`badge ${
                  review.group === 'Books' ? 'badge-accent' : review.group === 'Games' ? 'badge-info' : 'badge-warning'
                }`}
              >
                {review.group}
              </div>
            </h2>
            <div className="italic">Review of "{review.product}"</div>
            <div>Verdict: <ScoreIndicator score={review.rating}/></div>
            <div>{review.text}</div>
            <div className="card-actions justify-end">
              {review.tags.map((tag: { value: string }, index) => (
                <div key={index} className="badge badge-outline">
                  {tag.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
