import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import { useEditReviewMutation } from '../redux/apiSlice'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import TextareaAutosize from 'react-textarea-autosize'

interface IComment {
  user: string
  text: string
  _id?: string
}

interface IProps {
  review: IReview
}

export default function Comments({ review }: IProps) {
  const user = useAppSelector((state) => state.local.user)
  const comments = review.comments
  const [editReview] = useEditReviewMutation()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IComment>()

  const onSubmit: SubmitHandler<{ text: string }> = (inputComment) => {
    let newComment = { user: user.name, text: inputComment.text }
    let newReview: IReview = JSON.parse(JSON.stringify(review))
    newReview.comments.push(newComment)
    if (user.name) editReview(newReview)
  }

  return (
    <div>
      <h3 className="ml-3 ">Comments</h3>
      {comments &&
        comments.map((comment) => (
          <div key={comment._id} className="chat chat-start">
            <div className="chat-header">
              <PersonOutlineIcon /> {comment.user}
            </div>
            <div className="chat-bubble bg-primary mb-2 text-zinc-50">{comment.text}</div>
          </div>
        ))}
      {user.name && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 ml-3">
          <label>
            Add comment:
            <div>
              <TextareaAutosize
                placeholder="Type comment here"
                className="textarea w-full resize-none dark:bg-zinc-700"
                {...register('text', { required: true, minLength: 3, maxLength: 100 })}
              />
              {errors.text && <div className="text-red-700">Comments must be 3-100 symbols long</div>}
            </div>
          </label>
          <div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
