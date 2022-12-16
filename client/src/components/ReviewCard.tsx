import React from 'react'
import { IReview } from '../interfaces'
import Review from './Review'
import Modal from './Modal'

interface IProps {
  review: IReview
}

export default function ReviewCard({ review }: IProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <Review review={review} expanded={false} />
      <div className="text-center mb-3">
        <Modal text="Read review">
          <div className='text-left'>
          <Review review={review} expanded={true} />
          </div>
        </Modal>
      </div>
    </div>
  )
}
