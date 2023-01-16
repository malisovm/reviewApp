import React, { useMemo, useCallback } from 'react'
import { useGetReviewsQuery, useDeleteReviewMutation } from '../redux/reviewsApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import MaterialReactTable from 'material-react-table'
import type { MRT_ColumnDef } from 'material-react-table'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { IReview } from '../interfaces'
import Modal from '../components/Modal'
import Review from '../components/Review'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import useLocMsg, { LocMsgKey } from '../localization/useLocMsg'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_RU } from 'material-react-table/locales/ru'
import routes from '../routes'
import { setUser } from '../redux/localSlice'

export default function MyReviews() {
  const dispatch = useAppDispatch()
  const locMsg = useLocMsg()
  let user = useAppSelector((state) => state.local.user)
  let locale = useAppSelector((state) => state.local.locale)
  const navigate = useNavigate()
  const { state: adminViewUser } = useLocation()
  if (adminViewUser) user = adminViewUser
  const { data: reviews, isLoading, isError } = useGetReviewsQuery()
  const [deleteReview] = useDeleteReviewMutation()

  const userReviews = reviews?.filter((review) => review.username === user.username)

  const tableLocalizationMap = {
    en: MRT_Localization_EN,
    ru: MRT_Localization_RU,
  }
  const tableLocalization = tableLocalizationMap[locale as keyof typeof tableLocalizationMap]

  function handleCreate() {
    navigate(routes.reviewEditor, { state: { user: user } })
  }
  const handleEdit = useCallback(function (row: IReview) {
    navigate(routes.reviewEditor, {
      state: { review: row, user: user },
    })
  }, [navigate, user])

  const handleDelete = useCallback(function (row: IReview) {
    deleteReview(row)
      .unwrap()
      .then((fulfilled: any) => {
        if (!adminViewUser) {
          let updUser = JSON.parse(JSON.stringify(user))
          updUser.likes = fulfilled.newLikesCount
          dispatch(setUser(updUser))
        }
        navigate(routes.main)
      })
  }, [adminViewUser, deleteReview, dispatch, navigate, user])

  // component columns API: https://www.material-react-table.com/docs/getting-started/usage

  const columns = useMemo<MRT_ColumnDef<IReview>[]>(
    () => [
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: 'Title',
        Header: <b className="text-primary">{locMsg('MyReviews.title')}</b>,
        Cell: ({ cell }) => (
          <Modal options={'normal-case btn-sm btn-active btn-ghost'} text={cell.getValue() as string}>
            <Review review={cell.row.original} expanded={true} />
          </Modal>
        ),
      },
      {
        accessorFn: (row) => row.product,
        id: 'product',
        header: 'Product',
        Header: <b className="text-primary">{locMsg('MyReviews.product')}</b>,
      },
      {
        accessorFn: (row) => row.group,
        id: 'group',
        header: 'Group',
        Header: <b className="text-primary">{locMsg('MyReviews.group')}</b>,
        size: 100,
        Cell: ({ cell }) => <span>{locMsg(`Shared.${cell.getValue()}` as LocMsgKey)}</span>,
      },
      {
        accessorFn: (row) => row.verdict,
        id: 'verdict',
        header: 'Verdict',
        Header: <b className="text-primary">{locMsg('Shared.verdict')}</b>,
        size: 40,
      },
      {
        accessorFn: (row) => row.avgRate,
        id: 'average rate',
        header: 'Average rate',
        Header: <b className="text-primary">{locMsg('MyReviews.avgRating')}</b>,
        size: 40,
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
        Header: <b className="text-primary">{locMsg('MyReviews.actions')}</b>,
        size: 40,
      },
    ],
    [handleDelete, handleEdit, locMsg],
  )

  if (isLoading) return <button className="btn loading">{locMsg('Shared.loading')}</button>
  if (isError) return <h1 className="text-red-700">{locMsg('Shared.error')}</h1>

  return (
    <div className="flex flex-col w-full mt-32">
      <h1 className="place-self-center">
        {!adminViewUser
          ? locMsg('MyReviews.yourReviews')
          : locMsg('MyReviews.usernameReviews', { username: user.username })}
      </h1>
      <div className="place-self-center mb-7 w-5/6 max-w-5xl">
        <MaterialReactTable localization={tableLocalization} columns={columns} data={userReviews as IReview[]} />
      </div>

      <button className="btn btn-primary place-self-center" onClick={handleCreate}>
        {locMsg('MyReviews.addNewReview')}
      </button>
    </div>
  )
}
