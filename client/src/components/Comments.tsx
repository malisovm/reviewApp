import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAppSelector } from '../redux/hooks'
import { useEditReviewMutation } from '../redux/reviewsApiSlice'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import TextareaAutosize from 'react-textarea-autosize'
import useLocMsg from '../localization/useLocMsg'
import DeleteIcon from '@mui/icons-material/Delete'

interface IComment {
  user: string
  text: string
  _id?: string
}

interface IProps {
  review: IReview
}

export default function Comments({ review }: IProps) {
  const locMsg = useLocMsg()
  const user = useAppSelector((state) => state.local.user)
  const comments = review.comments
  const [editReview] = useEditReviewMutation()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<IComment>()

  const onSubmit: SubmitHandler<{ text: string }> = (inputComment) => {
    let newComment = { user: user.username, text: inputComment.text }
    let newReview: IReview = JSON.parse(JSON.stringify(review))
    reset()
    newReview.comments.push(newComment)
    user.username && editReview(newReview)
  }

  function handleDelete(_id?: string) {
    if (_id) {
      let newReview: IReview = JSON.parse(JSON.stringify(review))
      newReview.comments = newReview.comments.filter(comment => comment._id !== _id)
      editReview(newReview)
    }
  }

  return (
    <div>
      <h3 className="ml-3 ">{locMsg('Comments.header')}</h3>
      {comments &&
        comments.map((comment) => (
          <div key={comment._id} className="chat chat-start">
            <div className="chat-header">
              <PersonOutlineIcon /> {comment.user}
            </div>
            <div className="chat-bubble bg-primary mb-2 text-zinc-50 flex flex-row">
              {comment.text}
              {(comment.user === user.username || user.role === 'admin') && (
                <button className="ml-1 self-start" onClick={() => handleDelete(comment._id)}>
                  <DeleteIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      {user.username && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3 ml-3">
          <label>
            {locMsg('Comments.addComment')}:
            <div>
              <TextareaAutosize
                placeholder={locMsg('Comments.placeholder')}
                className="textarea w-full resize-none dark:bg-zinc-700"
                {...register('text', { required: true, minLength: 3, maxLength: 300 })}
              />
              {errors.text && <div className="text-red-700">{locMsg('Comments.validationError')}</div>}
            </div>
          </label>
          <div>
            <button type="submit" className="btn btn-primary">
              {locMsg('Shared.submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
