import React from 'react'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'

export default function MyReviews() {
  const { data, isLoading, isError } = useGetReviewsQuery()
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>An error occured</h1>

  return (
    <>
      {data?.map((review: IReview, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl">
        <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
        <div className="card-body">
          <h2 className="card-title">
            {review.title}
            <div className="badge badge-secondary">{review.groups}</div>
          </h2>
          <p>{review.text}</p>
          <div className="card-actions justify-end">
            {review.tags.map((tag: {value: string}) => <div className="badge badge-outline">{tag.value}</div>)}
          </div>
        </div>
      </div>
      ))}
    </>
  )
}