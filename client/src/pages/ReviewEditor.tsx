import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation, useGetReviewsQuery, useEditReviewMutation } from '../redux/apiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import PicUpload from '../components/PicUpload'
import MarkdownText from '../components/MarkdownText'
import { setAlert } from '../redux/localSlice'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export default function ReviewEditor() {
  const { state } = useLocation()
  const user = state.user
  var review: IReview | undefined = undefined
  if (state && state.review) review = state.review
  const [addReview] = useAddReviewMutation()
  const [editReview] = useEditReviewMutation()
  const { data: reviews } = useGetReviewsQuery()
  const [newReviewTags, setNewReviewTags] = useState<string[]>([])
  const [resetTags, setResetTags] = useState<string>(Math.random().toString())
  const navigate = useNavigate()
  const [text, setText] = useState(review ? review.text : `**Write your review here** (*Markdown syntax supported*)`)
  const theme = useAppSelector((state) => state.local.theme)
  const [pic, setPic] = useState<string>()
  const dispatch = useAppDispatch()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IReview>()

  const onSubmit: SubmitHandler<IReview> = (newReview) => {
    newReview.tags = newReviewTags
    newReview.text = text
    newReview.pic = pic
    newReview.user = user.name
    if (review) {
      newReview._id = review._id
      newReview.ratings = review.ratings
      editReview(newReview)
    } else if (!review) {
      addReview(newReview)
    }
    reset()
    setResetTags(Math.random().toString())
    dispatch(setAlert({ text: !review ? 'New review added' : 'Review updated', variant: 'alert-success' }))
    navigate('/myreviews', { state: user })
  }

  const uniqueTags = [...new Set(reviews?.flatMap((review) => review.tags))]
  const textInputs = ['title', 'product']
  const selectInputs = { group: ['Books', 'Movies', 'Games'], verdict: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-zinc-900 rounded-xl w-5/6 max-w-md">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <header className="text-center font-bold text-2xl mb-3">
            {!review ? 'Create new review' : 'Edit review'}
          </header>
          {textInputs.map((input, index) => (
            <label key={index}>
              <div className="mb-1 capitalize">{input}</div>
              <div>
                <input
                  placeholder={`Enter ${input}`}
                  className="w-full"
                  autoComplete="off"
                  defaultValue={review ? (input === 'title' ? review.title : review.product) : ''}
                  {...register(input as keyof IReview, { required: true, maxLength: input === 'text' ? 2000 : 30 })}
                />
                {errors[input as keyof IReview] && (
                  <div className="text-red-700">
                    {errors[input as keyof IReview]?.type === 'required'
                      ? 'Please fill in this field'
                      : 'This field is too long'}
                  </div>
                )}
              </div>
            </label>
          ))}

          {Object.entries(selectInputs).map(([selectInput, inputOptions]) => (
            <label key={selectInput}>
              <div className="mb-1 capitalize">{selectInput}</div>
              <select
                defaultValue={review ? (selectInput === 'group' ? review.group : review.verdict) : 'default'}
                className="border rounded p-2 w-full dark:bg-zinc-800"
                {...register(selectInput as keyof IReview, { required: true, pattern: /^(?!default$)/ })}
              >
                <option value="default" disabled>
                  Select {selectInput.toLowerCase()}
                </option>
                {inputOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
              {errors[selectInput as keyof IReview] && <div className="text-red-700">Please select {selectInput}</div>}
            </label>
          ))}

          <label>
            <div className="mb-1">Text</div>
            <div className="container dark:bg-zinc-800" data-color-mode={theme}>
              <MDEditor
                className="dark:bg-zinc-800"
                value={text}
                //@ts-ignore
                onChange={setText}
                preview="edit"
                fill="red"
              />
              <details className="border rounded mt-1 p-1">
                <summary>See preview</summary>
                <MarkdownText text={text} />
              </details>
            </div>
          </label>

          <label>
            <div>Pic</div>
            {<PicUpload pic={review ? review.pic : undefined} setPic={setPic} />}
          </label>

          <label>
            <div className="mb-1">Tags</div>
            <Autocomplete
              multiple
              options={uniqueTags as string[]}
              defaultValue={review ? review.tags : undefined}
              freeSolo
              onChange={(_, values) => {
                setNewReviewTags(values)
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => <TextField {...params} variant="filled" placeholder="Type and press/tap Enter to add new tag" />}
              key={resetTags}
            />
          </label>

          <button type="submit" className="btn btn-active btn-primary mt-3">
            Submit
          </button>
        </form>
      </section>
    </div>
  )
}
