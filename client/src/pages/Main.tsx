import React from 'react'
import TagsCloud from '../components/TagsCloud'
import { useGetReviewsQuery } from '../redux/reviewsApiSlice'
import { IReview, TagFilterType, SearchFilterType } from '../interfaces'
import ReviewCard from '../components/ReviewCard'
import useLocMsg from '../localization/useLocMsg'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setFilter } from '../redux/localSlice'
import ReviewColumn from '../components/ReviewCategory'

export default function Main() {
  const dispatch = useAppDispatch()
  const locMsg = useLocMsg()
  const { data: reviews, isLoading, isError } = useGetReviewsQuery(undefined, { pollingInterval: 5000 }) // the interval is used to update comments
  let newestReviews: IReview[] = []
  let highestRatedReviews: IReview[] = []
  let filteredReviews: IReview[] = []
  let filter = useAppSelector((state) => state.local.filter)

  if (reviews) {
    newestReviews = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
    highestRatedReviews = [...reviews]
      .filter((review) => review.avgRate > 0)
      .sort((a, b) => b.avgRate - a.avgRate)
      .slice(0, 6)
    if (filter) {
      if (filter.type === 'tag')
        filteredReviews = [...reviews].filter((review) => review.tags?.includes((filter as TagFilterType).value))
      else if (filter.type === 'search')
        filteredReviews = [...reviews].filter((review) => (filter as SearchFilterType).ids.includes(review._id))
    }
  }

  if (isLoading) return <button className="btn loading">{locMsg('Shared.loading')}</button>
  if (isError) return <h1 className="text-red-700">{locMsg('Shared.error')}</h1>

  return (
    <div className="flex flex-row justify-center mx-3 mt-6 flex-wrap  gap-8">
      {!filter && (
        <div className="flex flex-row w-5/6 justify-center flex-wrap gap-12">
          {newestReviews.length > 0 && (
            <ReviewColumn reviews={newestReviews} title={locMsg('Main.newReviews')}/>
          )}

          {highestRatedReviews.length > 0 && (
            <ReviewColumn reviews={highestRatedReviews} title={locMsg('Shared.highestRated')}/>
          )}

          {!newestReviews.length ? (
            <h1 className="text-center">{locMsg('Main.noReviews')}</h1>
          ) : (
            !highestRatedReviews.length && (
              <section>
                <h1 className="text-center">{locMsg('Shared.highestRated')}</h1>
                <h2 className="italic text-center">{locMsg('Shared.noneYet')}</h2>
              </section>
            )
          )}
        </div>
      )}

      {filter && (
        <div className="flex flex-col w-5/6">
          <section className="flex flex-col justify-center">
            <h1 className="self-center">
              {filter.type === 'tag' ? `#${filter.value}` : `${locMsg('Shared.search')}: "${filter.search}"`}
            </h1>
            <button
              className="btn btn-primary self-center w-auto"
              onClick={() => {
                dispatch(setFilter(null))
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
        <TagsCloud reviews={reviews} />
      </div>
    </div>
  )
}
