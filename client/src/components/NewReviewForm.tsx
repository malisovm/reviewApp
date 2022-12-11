import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation, useGetReviewsQuery } from '../redux/apiSlice'
import { capitalize } from '../utility'
import Autocomplete from '@mui/joy/Autocomplete'
import { useNavigate } from 'react-router-dom'

export default function NewReviewForm() {
  const [addReview] = useAddReviewMutation()
  const { data: reviews } = useGetReviewsQuery()
  const [newReviewTags, setNewReviewTags] = useState<string[]>([])
  const [resetTags, setResetTags] = useState<string>(Math.random().toString())
  const navigate = useNavigate()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IReview>()

  const onSubmit: SubmitHandler<IReview> = (newReview) => {
    newReview.tags = newReviewTags
    addReview(newReview)
    reset()
    setResetTags(Math.random().toString())
    navigate('/myreviews')
  }

  const uniqueTags = [...new Set(reviews?.flatMap((review) => review.tags))]
  const textInputs = ['title', 'product', 'text', 'pic']
  const selectInputs = { group: ['Books', 'Movies', 'Games'], rating: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-gray-900 rounded-xl w-5/6 max-w-md">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <header className="text-center font-bold text-2xl mb-3">Create new review</header>
          {textInputs.map((input, index) => (
            <label key={index}>
              <div className="mb-1">{capitalize(input)}</div>
              <div>
                <input
                  placeholder={`Enter ${input}`}
                  className="w-full"
                  autoComplete="off"
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
              <div className="mb-1">{capitalize(selectInput)}</div>
              <select
                defaultValue="default"
                className="border rounded p-2 w-full"
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
            <div className="mb-1">Tags</div>
            <Autocomplete
              className="w-4/6"
              multiple
              onChange={(_, value) => {
                let tags = value as string[]
                setNewReviewTags(tags)
              }}
              freeSolo
              autoHighlight
              blurOnSelect
              options={uniqueTags}
              placeholder="Add tag"
              renderOption={(props, option) => (
                <li {...props} className="bg-gray-200 text-black">
                  {`+${option}`}
                </li>
              )}
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
