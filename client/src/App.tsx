import React, { useState } from 'react'

export default function App() {
  const [darkTheme, setDarkTheme] = useState(false)

  return <h1 className='text-black text-2xl m-3'>Hello World!</h1>
}
