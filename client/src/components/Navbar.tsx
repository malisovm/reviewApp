import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarButtons from './NavbarButtons'
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="navbar bg-zinc-900 dark:bg-stone-200 text-zinc-50 dark:text-black">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <MenuIcon/>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-zinc-900 dark:bg-stone-200 text-zinc-50 dark:text-black items-center"
          >
            <NavbarButtons />
          </ul>
        </div>
        <button
          className="italic text-2xl font-bold btn btn-ghost normal-case text-zinc-50 dark:text-primary"
          onClick={() => {
            navigate('/')
          }}
        >
          RatingApp
        </button>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center">
          <NavbarButtons />
        </ul>
      </div>
    </div>
  )
}
