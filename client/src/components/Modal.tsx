import React from 'react'
import { nanoid } from '@reduxjs/toolkit'

interface IProps {
  text: string
  children: JSX.Element
  options?: string
}

export default function Modal({ children, text, options }: IProps) {
  let id = nanoid()

  return (
    <>
      <label htmlFor={id} className={`btn ${options}`}>
        {text}
      </label>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className="modal-box relative bg-zinc-100 dark:bg-zinc-800" htmlFor="">
        {/*do not remove 'htmlFor=""*/}
          {children}
        </label>
      </label>
    </>
  )
}
