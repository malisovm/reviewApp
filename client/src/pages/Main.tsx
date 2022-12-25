import React, { useEffect, useState } from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'

export default function Main() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery(undefined, {pollingInterval: 5000})
  var newestReviews: IReview[] = []
  var highestRatedReviews: IReview[] = []
  var filteredReviews: IReview[] = []
  const [filter, setFilter] = useState('')
  const memoTagCloud = React.memo(TagsCloud)

  if (reviews) {
    newestReviews = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
    highestRatedReviews = [...reviews]
      .filter((review) => review.avgRate > 0)
      .sort((a, b) => b.avgRate - a.avgRate)
      .slice(0, 6)
    filteredReviews = [...reviews].filter((review) => review.tags?.includes(filter))
  }

  if (isLoading) return <button className="btn loading">Loading</button>
  if (isError) return <h1 className="text-red-700">An error occured</h1>

  return (
    <div className="flex flex-row justify-center mx-3 mt-6">
      {!filter && (
        <div className="flex flex-col w-5/6">
          {newestReviews.length > 0 && (
            <section>
              <header className="text-lg font-bold text-center mb-3 uppercase">Newest reviews</header>
              <article className="flex justify-center mt-5 gap-3 flex-wrap">
                {newestReviews?.map((review: IReview, index) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
              </article>
            </section>
          )}

          {highestRatedReviews.length > 0 && (
            <section className="mt-6">
              <header className="text-lg font-bold text-center mb-3 uppercase">Highest rated</header>
              <article className="flex justify-center mt-5 gap-3 flex-wrap">
                {highestRatedReviews?.map((review: IReview, index) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
              </article>
            </section>
          )}
          {!newestReviews.length ? (
            <header className="text-lg font-bold text-center mb-3 uppercase italic">No reviews yet</header>
          ) : (
            !highestRatedReviews.length && (
              <section className="mt-6">
                <header className="text-lg font-bold text-center mb-3 uppercase">Highest rated</header>
                <div className="text-lg font-bold text-center mb-3 uppercase italic">No user ratings yet</div>
              </section>
            )
          )}
        </div>
      )}
      {filter && (
        <div className="flex flex-col w-5/6">
          <section className="flex flex-col justify-center">
            <h1 className="self-center">{`#${filter}`}</h1>
            <button
              className="btn btn-primary self-center w-auto"
              onClick={() => {
                setFilter('')
              }}
            >
              Cancel filter
            </button>
            <article className="flex justify-center mt-5 gap-3 flex-wrap">
              {filteredReviews?.map((review: IReview, index) => (
                <ReviewCard review={review} key={review._id} />
              ))}
            </article>
          </section>
        </div>
      )}
      <div>
        <TagsCloud setFilter={setFilter} reviews={reviews}/>
      </div>
    </div>
  )
}
