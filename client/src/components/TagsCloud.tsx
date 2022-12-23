import React from 'react'
import { TagCloud } from 'react-tagcloud'
import { useAppSelector } from '../redux/hooks'
import { useGetReviewsQuery } from '../redux/apiSlice'

export default function TagsCloud() {
  const theme = useAppSelector((state) => state.local.theme)
  const { data: reviews } = useGetReviewsQuery()
  const tags = reviews?.flatMap((review) => review.tags)

  // TagCloud API. tags = [ {value: string, count: number}, ...]

  function countUniqueTags(tags: string[]): { value: string; count: number }[] {
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

  var uniqueTagsAndCounts: { value: string; count: number }[] = []
  if (tags) uniqueTagsAndCounts = countUniqueTags(tags.filter((tag) => tag !== undefined) as string[])

  return (
    <div className="bg-zinc-800 dark:bg-stone-200 w-56 h-56 flex justify-center items-center rounded-xl">
      {tags && tags.length > 0 ? (
        <TagCloud
          minSize={12}
          maxSize={32}
          tag-cloud="bg-white"
          tags={uniqueTagsAndCounts}
          colorOptions={{ hue: 'blue', luminosity: theme === 'dark' ? 'bright' : 'light' }}
        />
      ) : (
        <span className="text-white dark:text-black">No tags yet</span>
      )}
    </div>
  )
}
