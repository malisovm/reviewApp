import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch } from '../redux/hooks'
import { setUser, setAlert } from '../redux/localSlice'
import { useAddUserMutation, useAuthenticateUserMutation, useSocialAuthMutation } from '../redux/apiSlice'
import { IUser, IUserResponse } from '../interfaces'
import useLocMsg from '../localization/useLocMsg'
import routes from '../routes'
import { LoginSocialGoogle, IResolveParams } from 'reactjs-social-login'
import { GoogleLoginButton} from 'react-social-login-buttons'

export default function Login() {
  const locMsg = useLocMsg()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [addUser] = useAddUserMutation()
  const [authUser] = useAuthenticateUserMutation()
  const [socialAuth] = useSocialAuthMutation()
  const [createUser, setCreateUser] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUser>()

  function handleUserAction(action: any) {
    action
      .unwrap()
      .then((res: IUserResponse) => {
        dispatch(setAlert({ text: res.message, variant: 'alert-success' }))
        console.log(res)
        dispatch(setUser({ username: res.username, role: res.role, likes: res.likes }))
        res.token && localStorage.setItem('token', res.token)
        navigate(routes.main)
      })
      .catch((err: any) => {
        dispatch(setAlert({ text: err.data, variant: 'alert-error' }))
      })
  }

  const onSubmit: SubmitHandler<IUser> = (results) => {
    if (!createUser) {
      handleUserAction(authUser(results))
    } else if (createUser) {
      handleUserAction(addUser(results))
    }
  }

  return (
    <div className="flex justify-center mt-32">
      <section className="bg-white dark:bg-zinc-900 rounded-xl w-72 max-w-md text-center">
        <form className="p-6 flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
          <h1>{locMsg('Shared.logIn')}</h1>

          <input {...register('username', { required: true, minLength: 3, maxLength: 30 })} autoComplete="off" />
          {errors.username && <div className="text-red-700">{locMsg('Login.usernameValidationError')}</div>}

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

          <div>
            <LoginSocialGoogle
              className="text-sm"
              client_id={'680300813568-ui151qr8a24jope8orj6r90ltcdsde1n.apps.googleusercontent.com' || ''} // todo: how to protect this?
              onResolve={({ provider, data }: IResolveParams) => {
                handleUserAction(socialAuth({ socialNetwork: provider, username: data?.name }))
              }}
              onReject={(err) => {
                console.log(err)
              }}
            >
              <GoogleLoginButton />
            </LoginSocialGoogle>
          </div>
        </form>
      </section>
    </div>
  )
}
