import React from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useAppSelector } from '../redux/hooks'

export default function MarkdownText({ text }) {
  const theme = useAppSelector((state) => state.local.theme)
  let bgColor = theme === 'dark' ? '#2A303C' : 'white'
  let textColor = theme === 'dark' ? 'white' : 'black'

  return (
    <MDEditor.Markdown
      style={{ backgroundColor: bgColor, color: textColor, whiteSpace: 'pre-wrap' }}
      source={text}
      rehypeRewrite={(node, _, parent) => {
        if (node.tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
          parent.children = parent.children.slice(1)
        }
      }}
    />
  )
}
