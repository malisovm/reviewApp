import React, { useState } from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { IReview } from '../interfaces'
import ReviewCard from '../components/ReviewCard'
import useLocMsg from '../localization/useLocMsg'

export default function Main() {
  const locMsg = useLocMsg()
  const { data: reviews, isLoading, isError } = useGetReviewsQuery(undefined, { pollingInterval: 5000 })
  var newestReviews: IReview[] = []
  var highestRatedReviews: IReview[] = []
  var filteredReviews: IReview[] = []
  const [filter, setFilter] = useState('')

  if (reviews) {
    newestReviews = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
    highestRatedReviews = [...reviews]
      .filter((review) => review.avgRate > 0)
      .sort((a, b) => b.avgRate - a.avgRate)
      .slice(0, 6)
    filteredReviews = [...reviews].filter((review) => review.tags?.includes(filter))
  }

  if (isLoading) return <button className="btn loading">{locMsg('Shared.loading')}</button>
  if (isError) return <h1 className="text-red-700">{locMsg('Shared.error')}</h1>

  return (
    <div className="flex flex-row justify-center mx-3 mt-6 flex-wrap  gap-8">
      {!filter && (
        <div className="flex flex-row w-5/6 justify-center flex-wrap gap-12">
          {newestReviews.length > 0 && (
            <section>
              <h1 className="text-center">{locMsg('Main.newReviews')}</h1>
              <article className="flex flex-col justify-center mt-5 gap-5 flex-wrap">
                {newestReviews?.map((review: IReview, index) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
              </article>
            </section>
          )}

          {highestRatedReviews.length > 0 && (
            <section>
              <h1 className="text-center">{locMsg('Main.highestRated')}</h1>
              <article className="flex flex-col justify-center mt-5 gap-5 flex-wrap">
                {highestRatedReviews?.map((review: IReview, index) => (
                  <ReviewCard review={review} key={review._id} />
                ))}
              </article>
            </section>
          )}
          {!newestReviews.length ? (
            <h1 className="text-center">{locMsg('Main.noReviews')}</h1>
          ) : (
            !highestRatedReviews.length && (
              <section>
                <h1 className="text-center">{locMsg('Main.highestRated')}</h1>
                <h2 className="italic text-center">{locMsg('Shared.noneYet')}</h2>
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
              {locMsg('Main.cancelFilter')}
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
        <h1 className="text-center">{locMsg('Shared.tags')}</h1>
        <TagsCloud setFilter={setFilter} reviews={reviews} />
      </div>
    </div>
  )
}
