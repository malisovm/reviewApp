import React from 'react'
import EditReviewForm from '../components/ReviewEditorForm'
import { useLocation } from 'react-router-dom'

export default function NewReview() {
  const { state: review } = useLocation()
  return <EditReviewForm review={review} />
}
