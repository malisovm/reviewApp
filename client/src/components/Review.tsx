import React from 'react'
import ScoreIndicator from './ScoreIndicator'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import MarkdownText from './MarkdownText'

interface IProps {
  review: IReview,
  expanded: boolean
}

export default function Review({ review, expanded }: IProps) {
  const theme = useAppSelector((state) => state.local.theme)

  return (
      <>
      <figure className="mt-2">
        <img src={review.pic} alt="" />
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
        <div>
          Verdict: <ScoreIndicator score={review.rating} />
        </div>
        {expanded && <div className='my-3'><MarkdownText text={review.text} /></div>}
        <div className="card-actions justify-end">
          {review?.tags?.map((tag, index) => (
            <div key={index} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
      </div>
      </>

  )
}
