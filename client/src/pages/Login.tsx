import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../redux/hooks'
import { setUser, setAlert } from '../redux/localSlice'
import { useAddUserMutation, useAuthenticateUserMutation } from '../redux/apiSlice'
import { IUser } from '../interfaces'
import useLocMsg from '../localization/useLocMsg'
import routes from '../routes'

export default function Login() {
  const locMsg = useLocMsg()
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
    if (!createUser) {
      authUser(results)
        .unwrap()
        .then((fulfilled: any) => {
          results.role = fulfilled.role
          results.likes = fulfilled.likes
          dispatch(setAlert({ text: fulfilled.message, variant: 'alert-success' }))
          dispatch(setUser(results))
          navigate(routes.main)
        })
        .catch((rejected) => {
          dispatch(setAlert({ text: rejected.data, variant: 'alert-error' }))
        })
    } else if (createUser) {
      results.role = 'user'
      addUser(results)
        .unwrap()
        .then((fulfulled) => {
          dispatch(setAlert({ text: fulfulled, variant: 'alert-success' }))
          dispatch(setUser(results))
          navigate(routes.main)
        })
        .catch((rejected) => {
          dispatch(setAlert({ text: rejected.data, variant: 'alert-error' }))
        })
    }
  }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-zinc-900 rounded-xl w-64 max-w-md text-center">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <h1>{locMsg('Shared.logIn')}</h1>

          <input {...register('name', { required: true, minLength: 3, maxLength: 30 })} autoComplete="off" />
          {errors.name && <div className="text-red-700">{locMsg('Login.usernameValidationError')}</div>}

          <input
            {...register('password', { required: true, minLength: 3, maxLength: 30 })}
            type="password"
            autoComplete="off"
          />
          {errors.password && <div className="text-red-700">{locMsg('Login.passwordValidationError')}</div>}

          <button type="submit" className="btn btn-primary">
            {locMsg('Shared.submit')}
          </button>

          <label className="label cursor-pointer mt-3">
            <span className="label-text">{locMsg('Login.createNewAccount')}</span>
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
