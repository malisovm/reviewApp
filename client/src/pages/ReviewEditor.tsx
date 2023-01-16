import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation, useGetReviewsQuery, useEditReviewMutation } from '../redux/reviewsApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import PicUpload from '../components/PicUpload'
import MDEditor from '@uiw/react-md-editor'
import MarkdownText from '../components/MarkdownText'
import { setAlert } from '../redux/localSlice'
import useLocMsg, { LocMsgKey } from '../localization/useLocMsg'
import routes from '../routes'
import TagsInput from '../components/TagsInput'

export default function ReviewEditor() {
  const locMsg = useLocMsg()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: reviews } = useGetReviewsQuery()
  const [addReview] = useAddReviewMutation()
  const [editReview] = useEditReviewMutation()
  const theme = useAppSelector((state) => state.local.theme)
  const { state } = useLocation() // this state is the props passed via react router if the component was launched in "edit" mode
  const user = state.user
  let review: IReview | undefined = undefined
  if (state && state.review) review = state.review
  const [newReviewTags, setNewReviewTags] = useState<string[]>([])
  const [text, setText] = useState(review ? review.text : '')
  const [pic, setPic] = useState<string>()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue: setFieldValue,
  } = useForm<IReview>()

  useEffect(() => {
    register('text', { required: true, minLength: 10, maxLength: 2000 })
  }, [register])

  function handleTextChange(text?: string) {
    setText(text || '')
    setFieldValue('text', text || '', { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<IReview> = (newReview) => {
    newReview.tags = newReviewTags
    newReview.pic = pic
    newReview.username = user.username
    if (review) {
      newReview._id = review._id
      newReview.ratings = review.ratings
      editReview(newReview)
    } else if (!review) {
      addReview(newReview)
    }
    reset()
    dispatch(setAlert({ text: !review ? 'New review added' : 'Review updated', variant: 'alert-success' }))
    navigate(routes.myReviews, { state: user })
  }

  const uniqueTags = [...new Set(reviews?.flatMap((review) => review.tags))]
  const textInputs = ['title', 'product']
  const selectInputs = { group: ['books', 'movies', 'games'], verdict: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-zinc-900 rounded-xl w-5/6 max-w-md">
        <form className="p-6 flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <header className="text-center font-bold text-2xl mb-3">
            {!review ? locMsg('ReviewEditor.createNewReview') : locMsg('ReviewEditor.editReview')}
          </header>

          {textInputs.map((input, index) => (
            <label key={index}>
              {locMsg(`ReviewEditor.textInputs.${input}` as LocMsgKey)}
              <div>
                <input
                  placeholder={locMsg(`ReviewEditor.textInputs.${input}Placeholder` as LocMsgKey)}
                  className="w-full"
                  autoComplete="off"
                  defaultValue={review ? (input === 'title' ? review.title : review.product) : ''}
                  {...register(input as keyof IReview, { required: true, maxLength: input === 'text' ? 2000 : 30 })}
                />
                {errors[input as keyof IReview] && (
                  <div className="text-red-700">
                    {errors[input as keyof IReview]?.type === 'required'
                      ? locMsg('ReviewEditor.textInputs.fieldEmpty')
                      : locMsg('ReviewEditor.textInputs.fieldTooLong')}
                  </div>
                )}
              </div>
            </label>
          ))}

          {Object.entries(selectInputs).map(([selectInput, inputOptions]) => (
            <label key={selectInput}>
              {locMsg(`ReviewEditor.selectInputs.${selectInput}` as LocMsgKey)}
              <select
                defaultValue={review ? (selectInput === 'group' ? review.group : review.verdict) : 'default'}
                className="border rounded p-2 w-full dark:bg-zinc-800"
                {...register(selectInput as keyof IReview, { required: true, pattern: /^(?!default$)/ })}
              >
                <option value="default" disabled>
                  {locMsg(`ReviewEditor.selectInputs.${selectInput}Placeholder` as LocMsgKey)}
                </option>
                {inputOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {selectInput === 'group' ? locMsg(`Shared.${option}` as LocMsgKey) : option}
                  </option>
                ))}
              </select>
              {errors[selectInput as keyof IReview] && (
                <div className="text-red-700">
                  {locMsg(`ReviewEditor.selectInputs.${selectInput}ValidationError` as LocMsgKey)}
                </div>
              )}
            </label>
          ))}

          <label>
            {locMsg('ReviewEditor.text')}
            <div className="container dark:bg-zinc-800" data-color-mode={theme}>
              <MDEditor
                className="dark:bg-zinc-800"
                value={text}
                onChange={handleTextChange}
                preview="edit"
                textareaProps={{
                  name: 'text',
                  placeholder: locMsg('ReviewEditor.defaultReviewText'),
                }}
              />
              {errors.text && <div className="text-red-700">{locMsg('ReviewEditor.textValidationError')}</div>}
              <details className="border rounded mt-1 p-1">
                <summary>{locMsg('ReviewEditor.seePreview')}</summary>
                <MarkdownText text={text} />
              </details>
            </div>
          </label>

          <label>
            {locMsg('ReviewEditor.pic')}
            {<PicUpload pic={review ? review.pic : undefined} setPic={setPic} />}
          </label>

          <TagsInput uniqueTags={uniqueTags as string[]} setNewReviewTags={setNewReviewTags} review={review} />

          <button type="submit" className="btn btn-active btn-primary mt-3">
            {locMsg('Shared.submit')}
          </button>
        </form>
      </section>     </div>
  )
}
