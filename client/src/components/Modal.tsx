import React from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { useAppSelector } from '../redux/hooks'

interface IProps {
  text: string
  children: JSX.Element
}

export default function Modal({ children, text }: IProps) {
  const theme = useAppSelector((state) => state.local.theme)
  let id = nanoid()

  return (
    <div className="cursor-pointer ">
      <label htmlFor={id} className="btn">
        {text}
      </label>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer ">
        <label className="modal-box relative bg-zinc-100 dark:bg-zinc-800" htmlFor="">
          {children}
        </label>
      </label>
    </div>
  )
}
