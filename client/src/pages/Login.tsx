import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../redux/hooks'
import { setUser, setMessage } from '../redux/globalVarsSlice'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  interface IResults {
    username: string
    password: string
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IResults>()

  const onSubmit: SubmitHandler<IResults> = (results) => {
    console.log(results)
    dispatch(setUser({ name: results.username, role: 'authorized' }))
    dispatch(setMessage({ text: `Logged in as ${results.username}`, variant: 'alert-success' }))
    navigate('/')
  }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-gray-900 rounded-xl w-64 max-w-md text-center">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="font-bold text-xl mb-2">Log in</h1>
          <input {...register('username', { required: true, minLength: 3, maxLength: 30 })} />
          {errors.username && <div className="text-red-700">Username must be 3-30 symbols long</div>}
          <input {...register('password', { required: true, minLength: 3, maxLength: 30 })} type="password" />
          {errors.password && <div className="text-red-700">Username must be 3-30 symbols long</div>}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </div>
  )
}
