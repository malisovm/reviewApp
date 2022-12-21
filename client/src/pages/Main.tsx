import React from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'

export default function Main() {
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  var fiveNewest: IReview[] = []
  var fiveHighestRated: IReview[] = []
  if (reviews) {
    fiveNewest = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
    fiveHighestRated = [...reviews]
      .filter((review) => review.avgRate > 0)
      .sort((a, b) => b.avgRate - a.avgRate)
      .slice(0, 6)
  }

  if (isLoading) return <button className="btn loading">Loading</button>
  if (isError) return <h1 className="text-red-700 text-xl">An error occured</h1>

  return (
    <div className="flex flex-row justify-center mx-3 mt-6">
      <div className="flex flex-col w-5/6">
        {fiveNewest.length > 0 && (
          <section>
            <header className="text-lg font-bold text-center mb-3 uppercase">Newest reviews</header>
            <article className="flex justify-center mt-5 gap-3 flex-wrap">
              {fiveNewest?.map((review: IReview, index) => (
                <ReviewCard review={review} key={review._id} />
              ))}
            </article>
          </section>
        )}

        {fiveHighestRated.length > 0 && (
          <section className="mt-6">
            <header className="text-lg font-bold text-center mb-3 uppercase">Highest rated</header>
            <article className="flex justify-center mt-5 gap-3 flex-wrap">
              {fiveHighestRated?.map((review: IReview, index) => (
                <ReviewCard review={review} key={review._id} />
              ))}
            </article>
          </section>
        )}
        {!fiveNewest.length ? (
          <header className="text-lg font-bold text-center mb-3 uppercase italic">*** No reviews yet ***</header>
        ) : (
          !fiveHighestRated.length && (
            <section className="mt-6">
              <header className="text-lg font-bold text-center mb-3 uppercase">Highest rated</header>
              <div className="text-lg font-bold text-center mb-3 uppercase italic">*** No user ratings yet ***</div>
            </section>
          )
        )}
      </div>
      <div>
        <TagsCloud />
      </div>
    </div>
  )
}
