import React, { useMemo } from 'react'
import { useGetReviewsQuery } from '../redux/apiSlice'
import { useNavigate } from 'react-router-dom'
import MaterialReactTable from 'material-react-table'
import type { MRT_ColumnDef } from 'material-react-table'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useAppSelector } from '../redux/hooks'
import { IReview } from '../interfaces'
import Modal from '../components/Modal'
import Review from '../components/Review'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDeleteReviewMutation } from '../redux/apiSlice'

export default function MyReviews() {
  const theme = useAppSelector((state) => state.local.theme)
  const navigate = useNavigate()
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  const [deleteReview] = useDeleteReviewMutation()

  function handleEdit(row: IReview) {
    navigate('/revieweditor', {
      state: row
    })
  }

  function handleDelete(row: IReview) {
    deleteReview(row)
  }

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme as 'light' | 'dark',
        },
      }),
    [theme],
  )

  const columns = useMemo<MRT_ColumnDef<IReview>[]>(
    () => [
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: 'Title',
        Header: <b className="text-primary">Title</b>,
        Cell: ({ cell }) => (
          <Modal text={cell.getValue() as string}>
            <Review review={cell.row.original} expanded={true} />
          </Modal>
        ),
      },
      {
        accessorFn: (row) => row.group,
        id: 'group',
        header: 'Group',
        Header: <b className="text-primary">Group</b>,
      },
      {
        accessorFn: (row) => row.product,
        id: 'product',
        header: 'Product',
        Header: <b className="text-primary">Product</b>,
      },
      {
        accessorFn: (row) => row.rating,
        id: 'rating',
        header: 'Rating',
        Header: <b className="text-primary">Rating</b>,
      },
      {
        accessorFn: (row) => (
          <>
            <EditIcon
              className="cursor-pointer"
              onClick={() => {
                handleEdit(row)
              }}
            />
            <DeleteIcon
              className="cursor-pointer"
              onClick={() => {
                handleDelete(row)
              }}
            />
          </>
        ),
        id: 'actions',
        header: 'Actions',
        Header: <b className="text-primary">Actions</b>,
      },
    ],
    [],
  )

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1 className="text-red-700">An error occured</h1>

  return (
    <div className="flex flex-col w-full mt-32">
      <>
        <h1 className="place-self-center font-bold text-2xl mb-4">Your reviews</h1>
        <div className="place-self-center w-auto mb-7">
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <MaterialReactTable columns={columns} data={reviews as IReview[]} />
          </ThemeProvider>
        </div>

        <button
          className="btn btn-primary place-self-center"
          onClick={() => {
            navigate('/revieweditor')
          }}
        >
          Add new review
        </button>
      </>
    </div>
  )
}
