import React from 'react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { IReview } from '../interfaces'
import { useAddReviewMutation } from '../redux/apiSlice'
import { BsPlusCircle } from "react-icons/bs"
import { BsXCircle } from "react-icons/bs"

export default function NewReviewForm() {
  const [addReview] = useAddReviewMutation()

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IReview>({
    defaultValues: {
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

  const inputs = ['title', 'product', 'groups', 'text', 'pic', 'rating']

  return (
    <div className="flex h-5/6 justify-center">
      <form className="flex justify-center flex-col m-3 gap-2" onSubmit={handleSubmit(onSubmit)}>
        {inputs.map((input, index) => (
          <label key={index}>
            <span>{input.charAt(0).toUpperCase() + input.slice(1)}</span>
            <div>
              <input
                placeholder={`Enter ${input}`}
                autoComplete="off"
                {...register(input as keyof IReview, { required: true })}
              />
              {errors[input as keyof IReview] && <span>This field is required</span>}
            </div>
          </label>
        ))}
        <label>
          <span>Tags</span>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input placeholder="Enter tags" {...register(`tags.${index}.value` as const, { required: true })} />
              <button className='align-middle mr-1'
                type="button"
                onClick={() => {
                  append({ value: '' })
                }}
              >
                <BsPlusCircle size='1.5em'/>
              </button>
              <button className='align-middle' type="button" onClick={() => remove(index)}>
              <BsXCircle size='1.5em'/>
              </button>
            </div>
          ))}
        </label>
        <button type="submit" className="btn btn-active btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  )
}
