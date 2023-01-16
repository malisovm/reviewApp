import React from 'react'
import { TagCloud } from 'react-tagcloud'
import { useAppSelector } from '../redux/hooks'
import { IReview } from '../interfaces'
import useLocMsg from '../localization/useLocMsg'
import { useAppDispatch } from '../redux/hooks'
import { setFilter } from '../redux/localSlice'

interface ITag {
  value: string
  count: number
}

interface IProps {
  reviews: IReview[] | undefined
}

function TagsCloud({ reviews }: IProps) {
  const dispatch = useAppDispatch()
  const locMsg = useLocMsg()
  const theme = useAppSelector((state) => state.local.theme)
  const tags = reviews?.flatMap((review) => review.tags)

  // TagCloud API; tags = [ {value: string, count: number}, ...]

  function countUniqueTags(tags: string[]): ITag[] {
    const counts: { [tag: string]: number } = {}
    for (const tag of tags) {
      if (counts[tag]) {
        counts[tag]++
      } else {
        counts[tag] = 1
      }
    }
    const result = Object.keys(counts).map((value) => ({ value, count: counts[value] }))
    result.sort((a, b) => b.count - a.count)
    return result
  }

  let uniqueTagsAndCounts: ITag[] = []
  if (tags) uniqueTagsAndCounts = countUniqueTags(tags.filter((tag) => tag !== undefined) as string[])

  return (
    <div className="dark:bg-zinc-800 bg-zinc-100 w-56 h-56 flex justify-center items-center rounded-xl">
      {tags && tags.length > 0 ? (
        <TagCloud
          minSize={12}
          maxSize={32}
          tag-cloud="bg-white"
          tags={uniqueTagsAndCounts}
          colorOptions={{ hue: 'blue', luminosity: theme === 'dark' ? 'light' : 'bright' }}
          onClick={(tag: ITag) => dispatch(setFilter({ type: 'tag', value: tag.value }))}
        />
      ) : (
        <span className="text-white dark:text-black">{locMsg('Shared.noneYet')}</span>
      )}
    </div>
  )
}

export default React.memo(TagsCloud)
