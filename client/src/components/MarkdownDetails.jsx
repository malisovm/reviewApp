import React from 'react'
import MDEditor from '@uiw/react-md-editor'

export default function MarkdownDetails({ text }) {
  return (
    <MDEditor.Markdown
      style={{ whiteSpace: 'pre-wrap' }}
      source={text}
      rehypeRewrite={(node, _, parent) => {
        if (node.tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
          parent.children = parent.children.slice(1)
        }
      }}
    />
  )
}
