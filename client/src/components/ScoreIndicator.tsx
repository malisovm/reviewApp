import React from 'react'

interface IProps {
  score: number
}

export default function ScoreIndicator({ score }: IProps) {
  let colors = {
    1: 'bg-red-600',
    2: 'bg-red-600',
    3: 'bg-orange-600',
    4: 'bg-orange-600',
    5: 'bg-yellow-600',
    6: 'bg-yellow-600',
    7: 'bg-lime-600',
    8: 'bg-lime-600',
    9: 'bg-green-600',
    10: 'bg-green-600',
  }

  return (
    <span className={`${colors[score as keyof typeof colors]} text-white py-1 px-3 rounded-full not-italic`}>
      {score}
    </span>
  )
}
