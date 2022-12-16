import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setAlert } from '../redux/localSlice'

export default function Alert() {
  const { text, variant } = useAppSelector((state) => state.local.alert)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(setAlert({ variant: '', text: '' }))
    }, 2000)
  }, [text])

  return text ? <div className={`${variant} mx-auto text-center w-1/6 p-2 rounded-xl`}>{text}</div> : <></>
}
