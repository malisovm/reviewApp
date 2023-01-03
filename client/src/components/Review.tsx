import React from 'react'
import ScoreIndicator from './ScoreIndicator'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import MarkdownText from './MarkdownText'
import { Rating } from 'react-simple-star-rating'
import { useEditReviewMutation } from '../redux/apiSlice'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import Comments from './Comments'
import useLocMsg, {LocMsgKey} from '../localization/useLocMsg'

interface IProps {
  review: IReview
  expanded: boolean
}

export default function Review({ review, expanded }: IProps) {
  const locMsg = useLocMsg()
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
    <article className=" bg-zinc-100 dark:bg-zinc-800 ">
      <figure id='Pic' className="mt-2">
        <img src={review.pic} alt="" className="max-h-72" />
      </figure>

      <header className="card-body">
        <h2 className="flex justify-between card-title" id='First line of card'>
          <span id="Title and group">
            <span id='Title' className="mr-2">{review.title}</span>
            <span id='Group'
              className={`badge ${
                review.group === 'books' ? 'badge-accent' : review.group === 'games' ? 'badge-info' : 'badge-warning'
              }`}
            >
              {locMsg(`Shared.${review.group}` as LocMsgKey)}
            </span>
          </span>

          {review.avgRate > 0 && !expanded && (
            <div className="text-right" id='Average rating (non-expanded card)'>
              <Rating initialValue={review.avgRate} allowFraction readonly SVGclassName="display: inline" size={20} />
            </div>
          )}
        </h2>

        <div className="italic" id="Product">
          {locMsg('Review.reviewOf')} "{review.product}"
        </div>
        <div id="Verdict">
          {locMsg('Shared.verdict')}: <ScoreIndicator score={review.verdict} />
        </div>
      </header>

      <main>
        {expanded && (
          <div className="m-3">
            <MarkdownText text={review.text} />
          </div>
        )}
      </main>

      <footer className="mr-5 mb-2 text-right">
        <section id="Name and date" className="italic">
          <div>
            <PersonOutlineIcon /> {review.user}
          </div>
          <div className="italic text-sm mb-3">{review.date}</div>
        </section>

        <section id="Tags" className="card-actions justify-end mb-3">
          {review?.tags?.map((tag, index) => (
            <div key={index} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </section>

        {expanded && (
          <>
            <section id="Likes" className="my-3">
              <button onClick={handleLike} disabled={user.name && review.user !== user.name ? false : true}>
                <ThumbUpOutlinedIcon
                  className={`${review.likes.includes(user.name) ? 'text-primary' : 'text-zinc-200'} align-text-top`}
                />
              </button>
              {review.likes.length}
            </section>

            <section id="Ratings">
              {user.name && review.user !== user.name && (
                <div id="User rating">
                  <div>{locMsg('Review.yourRate')}:</div>
                  <Rating
                    initialValue={existingRating && existingRating.rate ? existingRating.rate : 0}
                    onClick={handleRating}
                    SVGclassName="display: inline"
                    size={20}
                    fillColor="#4506CB"
                  />
                </div>
              )}
              {locMsg('Review.avgRate')}:
              <div id="Average rating (expanded card)">
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
                  locMsg('Shared.noneYet')
                )}
              </div>
            </section>

            <section id="Comments" className='text-left'>
              <hr className="mb-1 mt-5 border-primary" />
              <Comments review={review} />
            </section>
          </>
        )}
      </footer>
    </article>
  )
}
