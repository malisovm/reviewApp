import React, { useEffect, useMemo } from 'react'
import { useGetUsersQuery } from '../redux/apiSlice'
import { useNavigate } from 'react-router-dom'
import MaterialReactTable from 'material-react-table'
import type { MRT_ColumnDef } from 'material-react-table'
import { useAppSelector } from '../redux/hooks'
import { IUser } from '../interfaces'

export default function Userlist() {
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)
  const navigate = useNavigate()
  const { data: users, isLoading, isError } = useGetUsersQuery()

  function handleClick(user: IUser) {
    navigate('/myreviews', {
      state: user,
    })
  }

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        header: 'Name',
        Header: <b className="text-primary">Name</b>,
        Cell: ({ cell }) => (
          <span className='underline cursor-pointer'
            onClick={() => {
              handleClick(cell.row.original)
            }}
          >
            {cell.row.original.name}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.role,
        header: 'Role',
        Header: <b className="text-primary">Role</b>,
      },
      {
        accessorFn: (row) => row.likes,
        header: 'Likes',
        Header: <b className="text-primary">Likes</b>,
      },
    ],
    [],
  )

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1 className="text-red-700">An error occured</h1>

  return (
    <div className="flex flex-col w-full mt-32">
      <h1 className="place-self-center font-bold text-xl mb-5 uppercase">Admin access to users</h1>
      <div className="place-self-center w-5/6 max-w-xl mb-7">
          <MaterialReactTable columns={columns} data={users as IUser[]} />
      </div>
    </div>
  )
}
