import React from 'react'
import ScoreIndicator from './ScoreIndicator'
import MDEditor from '@uiw/react-md-editor'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import MarkdownDetails from './MarkdownDetails'

interface IProps {
  review: IReview
}

export default function ReviewCard({ review }: IProps) {
  const theme = useAppSelector((state) => state.globalVars.theme)

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className='mt-2'>
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
        <details className="container" data-color-mode={theme}>
          <summary>Read full review</summary>
          <MarkdownDetails text={review.text}/>
        </details>
        <div className="card-actions justify-end">
          {review?.tags?.map((tag, index) => (
            <div key={index} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
