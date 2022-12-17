import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../redux/hooks'
import { setUser, setAlert } from '../redux/localSlice'
import { useAddUserMutation, useAuthenticateUserMutation } from '../redux/apiSlice'
import { nanoid } from '@reduxjs/toolkit'
import { IUser } from '../interfaces'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [addUser] = useAddUserMutation()
  const [authUser] = useAuthenticateUserMutation()
  const [createUser, setCreateUser] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUser>()

  const onSubmit: SubmitHandler<IUser> = (results) => {
    results._id = nanoid()
    results.role = 'user'
    if (!createUser) {
      authUser(results)
        .unwrap()
        .then((fulfulled) => {
          dispatch(setAlert({ text: fulfulled, variant: 'alert-success' }))
          dispatch(setUser(results))
          navigate('/')
        })
        .catch((rejected) => {
          dispatch(setAlert({ text: rejected.data, variant: 'alert-error' }))
        })
    } else if (createUser) {
      addUser(results)
        .unwrap()
        .then((fulfulled) => {
          dispatch(setAlert({ text: fulfulled, variant: 'alert-success' }))
          dispatch(setUser(results))
          navigate('/')
        })
        .catch((rejected) => {
          dispatch(setAlert({ text: rejected.data, variant: 'alert-error' }))
        })
    }
  }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-gray-900 rounded-xl w-64 max-w-md text-center">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="font-bold text-xl mb-2">Log in</h1>
          <input {...register('name', { required: true, minLength: 3, maxLength: 30 })} />
          {errors.name && <div className="text-red-700">Username must be 3-30 symbols long</div>}
          <input {...register('password', { required: true, minLength: 3, maxLength: 30 })} type="password" />
          {errors.password && <div className="text-red-700">Username must be 3-30 symbols long</div>}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <label className="label cursor-pointer mt-3">
            <span className="label-text">Create new account</span>
            <input
              type="checkbox"
              checked={createUser ? true : false}
              onChange={() => {
                setCreateUser(!createUser)
              }}
              className="checkbox checkbox-primary"
            />
          </label>
        </form>
      </section>
    </div>
  )
}
