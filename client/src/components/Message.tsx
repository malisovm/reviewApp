import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setMessage } from '../redux/globalVarsSlice'

export default function Message() {
  const {text, variant} = useAppSelector(state => state.globalVars.message)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => {
      dispatch(setMessage({ variant: '', text: '' }))
    }, 1500)
  }, [text])

  return text ? <div className={`${variant} mx-auto text-center w-1/6 p-2 rounded-xl`}>{text}</div> : <></>
}
