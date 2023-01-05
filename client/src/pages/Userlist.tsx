import React, { useMemo } from 'react'
import { useGetUsersQuery } from '../redux/apiSlice'
import { useNavigate } from 'react-router-dom'
import MaterialReactTable from 'material-react-table'
import type { MRT_ColumnDef } from 'material-react-table'
import { IUser } from '../interfaces'
import useLocMsg from '../localization/useLocMsg'
import routes from '../routes'

export default function Userlist() {
  const locMsg = useLocMsg()
  const navigate = useNavigate()
  const { data: users, isLoading, isError } = useGetUsersQuery()

  function handleClick(user: IUser) {
    navigate(routes.myReviews, {
      state: user,
    })
  }

// component columns API: https://www.material-react-table.com/docs/getting-started/usage

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        header: 'Name',
        Header: <b className="text-primary">{locMsg('Userlist.name')}</b>,
        Cell: ({ cell }) => (
          <span
            className="underline cursor-pointer"
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
        Header: <b className="text-primary">{locMsg('Userlist.role')}</b>,
      },
      {
        accessorFn: (row) => row.likes,
        header: 'Likes',
        Header: <b className="text-primary">{locMsg('Userlist.likes')}</b>,
      },
    ],
    [],
  )

  if (isLoading) return <button className="btn loading">{locMsg('Shared.loading')}</button>
  if (isError) return <h1 className="text-red-700">{locMsg('Shared.error')}</h1>

  return (
    <div className="flex flex-col w-full mt-32">
      <h1 className="place-self-center font-bold text-xl mb-5 uppercase">{locMsg('Userlist.adminAccessTitle')}</h1>
      <div className="place-self-center w-5/6 max-w-xl mb-7">
        <MaterialReactTable columns={columns} data={users as IUser[]} />
      </div>
    </div>
  )
}
