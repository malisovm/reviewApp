import React from 'react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation } from '../redux/apiSlice'
import { BsPlusCircle } from 'react-icons/bs'
import { BsXCircle } from 'react-icons/bs'
import { capitalize } from '../utility'

export default function NewReviewForm() {
  const [addReview] = useAddReviewMutation()

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IReview>({
    defaultValues: {
      group: 'default',
      tags: [{ value: '' }],
    },
  })
  const onSubmit: SubmitHandler<IReview> = (data) => {
    console.log(data)
    addReview(data)
  }

  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })

  const textInputs = ['title', 'product', 'text', 'pic']
  const selectInputs = { group: ['Books', 'Movies', 'Games'], rating: Array.from({length: 10}, (_, i) => i + 1) }

  return (
    <div className="flex h-5/6 justify-center">
      <form className="flex justify-center flex-col m-3 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <>
          <header className="text-center font-bold text-2xl mb-3">Create new review</header>
          {textInputs.map((input, index) => (
            <label key={index}>
              <span>{capitalize(input)}</span>
              <div>
                <input
                  placeholder={`Enter ${input}`}
                  className="w-full"
                  autoComplete="off"
                  {...register(input as keyof IReview, { required: true, maxLength: input === 'text' ? 2000 : 30 })}
                />
                {errors[input as keyof IReview] && <div className="text-red-700">The field is empty or too long</div>}
              </div>
            </label>
          ))}

          {Object.entries(selectInputs).map(([selectInput, inputOptions]) =>
            <label>
            <span>{capitalize(selectInput)}</span>
            <select
              defaultValue="default"
              className="border rounded p-2 w-full"
              {...register(selectInput as keyof IReview, { required: true, pattern: /^(?!default$)/ })}
            >
              <option value="default" disabled>
                Select {selectInput.toLowerCase()}
              </option>
              {inputOptions.map((option)=><option>{option}</option>)}
            </select>
            {errors.group && <div className="text-red-700">Please select an option</div>}
          </label>
          )}

          <label>
            <span>Tags</span>
            {fields.map((field, index) => (
              <div key={field.id}>
                <input
                  placeholder="Enter tag"
                  {...register(`tags.${index}.value` as const, { required: true, maxLength: 30 })}
                />
                <button
                  className="align-middle mr-1"
                  type="button"
                  onClick={() => {
                    append({ value: '' })
                  }}
                >
                  <BsPlusCircle size="1.5em" />
                </button>
                <button className="align-middle" type="button" onClick={() => remove(index)}>
                  <BsXCircle size="1.5em" />
                </button>
              </div>
            ))}
            {errors.tags && <div className="text-red-700">One of the tags is too long</div>}
          </label>
          <button type="submit" className="btn btn-active btn-primary mt-3">
            Submit
          </button>
        </>
      </form>
    </div>
  )
}
