import React, { useState } from 'react'
import ScoreIndicator from './ScoreIndicator'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import MarkdownText from './MarkdownText'
import { Rating } from 'react-simple-star-rating'
import { useEditReviewMutation } from '../redux/apiSlice'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

interface IProps {
  review: IReview
  expanded: boolean
}

export default function Review({ review, expanded }: IProps) {
  const user = useAppSelector((state) => state.local.user)
  const [editReview] = useEditReviewMutation()
  const existingRating = review.ratings.find((rating) => rating.user === user.name)

  function handleRating(inputRate: number) {
    let inputRating = { user: user.name, rate: inputRate }
    let newReview: IReview = JSON.parse(JSON.stringify(review))
    let exsRatingInNewRev = newReview.ratings.find((rating) => rating.user === user.name)
    if (exsRatingInNewRev) exsRatingInNewRev.rate = inputRating.rate
    else newReview.ratings.push(inputRating)
    editReview(newReview)
  }

  function handleLike() {
    let newReview: IReview = JSON.parse(JSON.stringify(review))
    let exsLikeIndex = newReview.likes.findIndex((like) => like === user.name)
    if (exsLikeIndex >= 0) newReview.likes.splice(exsLikeIndex, 1)
    else newReview.likes.push(user.name)
    editReview(newReview)
  }

  return (
    <article className=' bg-zinc-100 dark:bg-zinc-800 '>
      <figure className="mt-2">
        <img src={review.pic} alt="" />
      </figure>

      <header className="card-body">
        <h2 className="flex justify-between card-title">
          <span id="title and group">
            <span className="mr-2">{review.title}</span>
            <span
              className={`badge ${
                review.group === 'Books' ? 'badge-accent' : review.group === 'Games' ? 'badge-info' : 'badge-warning'
              }`}
            >
              {review.group}
            </span>
          </span>
          {review.avgRate > 0 && !expanded && (
            <div className="text-right">
              <Rating initialValue={review.avgRate} allowFraction readonly SVGclassName="display: inline" size={20} />
            </div>
          )}
        </h2>
        <div className="italic">Review of "{review.product}"</div>
        <div>
          Verdict: <ScoreIndicator score={review.verdict} />
        </div>
      </header>

      <main>
        {expanded && (
          <div className="m-3">
            <MarkdownText text={review.text} />
          </div>
        )}
      </main>

      <footer className="mr-5 mb-2">
        <div className="text-right italic">{review.user}</div>
        <div className="text-right italic text-sm mb-3">{review.date}</div>
        <div className="card-actions justify-end mb-3">
          {review?.tags?.map((tag, index) => (
            <div key={index} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
        {expanded && user.name && review.user !== user.name && (
          <section>
            <div className="text-right">
              <div>
                <button onClick={handleLike}>
                  <ThumbUpIcon className={review.likes.includes(user.name) ? 'text-primary' : 'text-zinc-200'} />
                </button>{' '}
                {review.likes.length}
              </div>
              Your rate:
              <div>
                <Rating
                  initialValue={existingRating && existingRating.rate ? existingRating.rate : 0}
                  onClick={handleRating}
                  SVGclassName="display: inline"
                  size={20}
                  fillColor="#4506CB"
                />
              </div>
            </div>
          </section>
        )}
        {expanded && (
          <div className="text-right">
            Average rate:
            <div>
              {review.avgRate ? (
                <Rating
                  initialValue={review.avgRate}
                  allowFraction
                  readonly
                  fillColor="#4506CB"
                  SVGclassName="display: inline"
                  size={20}
                />
              ) : (
                'None yet'
              )}
            </div>
          </div>
        )}
      </footer>
    </article>
  )
}
