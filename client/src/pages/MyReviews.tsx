import React from 'react'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { useNavigate } from 'react-router-dom'

export default function MyReviews() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  const navigate = useNavigate()

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>An error occured</h1>
  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        navigate('/newreview')
      }}
    >
      New review
    </button>
  )
}
