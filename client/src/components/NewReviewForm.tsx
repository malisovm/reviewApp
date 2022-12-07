import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation } from '../redux/apiSlice'

export default function NewReviewForm() {
  const [addReview] = useAddReviewMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReview>()
  const onSubmit: SubmitHandler<IReview> = (data) => {
    console.log(data)
    addReview(data)
  }

  return (
    <div className="flex h-5/6 justify-center">
      <form className="flex justify-center flex-col m-3" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-3 text-center bold">Create new review</h3>
        <input placeholder="Enter title" {...register('title', { required: true })} />
        {errors.title && <span>This field is required</span>}
        <input placeholder="Enter product" {...register('product', { required: true })} />
        {errors.product && <span>This field is required</span>}
        <input placeholder="Enter groups" {...register('groups', { required: true })} />
        {errors.groups && <span>This field is required</span>}
        <input placeholder="Enter tags" {...register('tags', { required: true })} />
        {errors.tags && <span>This field is required</span>}
        <input placeholder="Enter text" {...register('text', { required: true })} />
        {errors.text && <span>This field is required</span>}
        <input placeholder="Enter pic" {...register('pic', { required: true })} />
        {errors.pic && <span>This field is required</span>}
        <input placeholder="Enter rating" {...register('rating', { required: true })} />
        {errors.rating && <span>This field is required</span>}
        <button type="submit" className="btn btn-active btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  )
}
