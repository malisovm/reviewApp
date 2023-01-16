import React from 'react'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useLocMsg from '../localization/useLocMsg'
import { IReview } from '../interfaces'

interface IProps {
  uniqueTags: string[]
  review: IReview | undefined
  setNewReviewTags: (newReviewTags: string[]) => void
}

export default function TagsInput({ uniqueTags, review, setNewReviewTags }: IProps) {
  const locMsg = useLocMsg()

  return (
    <label>
      {locMsg('Shared.tags')}
      <Autocomplete
        multiple
        options={uniqueTags as string[]}
        defaultValue={review ? review.tags : undefined}
        freeSolo
        onChange={(_, values) => {
          setNewReviewTags(values)
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="filled" placeholder={locMsg('ReviewEditor.tagsPlaceholder')} />
        )}
      />
    </label>
  )
}
