import React from 'react'

interface IProps {
  text: string
  children: JSX.Element
}

export default function Modal({ children, text }: IProps) {
  return (
    <div className='cursor-pointer'>
      <label htmlFor="my-modal-4" className="btn">
        {text}
      </label>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          {children}
        </label>
      </label>
    </div>
  )
}
