import React from 'react'
import { IReview } from '../interfaces'
import Review from './Review'
import Modal from './Modal'
import useLocMsg from '../localization/useLocMsg'

interface IProps {
  review: IReview
}

export default function ReviewCard({ review }: IProps) {
const locMsg = useLocMsg()

  return (
    <div className="card w-96 bg-zinc-100 dark:bg-zinc-800 shadow-xl">
      <Review review={review} expanded={false} />
      <div className="text-center mb-3">
        <Modal text={locMsg('ReviewCard.readReview')}>
          <div className="text-left">
            <Review review={review} expanded={true} />
          </div>
        </Modal>
      </div>
    </div>
  )
}
