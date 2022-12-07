import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  title: string
  product: string
  groups: string
  tags: string
  text: string
  pic: string
  rating: string
}

export default function NewReviewForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
    <div className="flex h-5/6 justify-center">
      <form className="flex justify-center flex-col m-3" onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Enter title" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('title', { required: true })} />
        {errors.title && <span>This field is required</span>}
        <input placeholder="Enter product" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('product', { required: true })} />
        {errors.product && <span>This field is required</span>}
        <input placeholder="Enter groups" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('groups', { required: true })} />
        {errors.groups && <span>This field is required</span>}
        <input placeholder="Enter tags" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('tags', { required: true })} />
        {errors.tags && <span>This field is required</span>}
        <input placeholder="Enter text" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('text', { required: true })} />
        {errors.text && <span>This field is required</span>}
        <input placeholder="Enter pic" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('pic', { required: true })} />
        {errors.pic && <span>This field is required</span>}
        <input placeholder="Enter rating" className="m-1 p-1 dark:bg-slate-800 border-2" {...register('rating', { required: true })} />
        {errors.rating && <span>This field is required</span>}
        <input type="submit" className='mt-3 p-1 bg-primary text-white rounded gray'/>
      </form>
    </div>
  )
}
