import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface IProps {
  pic?: string
  setPic: (pic: string) => void
}

export default function PicUpload({ pic, setPic }: IProps) {
  const { acceptedFiles, getRootProps, getInputProps, inputRef } = useDropzone({
    accept: {
      'image/png': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
  })
  const [url, setUrl] = useState<string | undefined>(pic)

  useEffect(() => {
    const data = new FormData()
    data.append('file', acceptedFiles[0])
    data.append('upload_preset', 'xqublzln')
    data.append('cloud_name', 'diriloebp')
    fetch('  https://api.cloudinary.com/v1_1/diriloebp/image/upload', {
      method: 'post',
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (!pic) setUrl(data.url)
        setPic(data.url)
      })
      .catch((err) => console.log(err))
  }, [acceptedFiles])

  function removePic(e: React.MouseEvent) {
    e.preventDefault()
    acceptedFiles.length = 0
    setUrl('')
    setPic('')
    if (inputRef?.current?.value) inputRef.current.value = ''
    console.log(acceptedFiles)
  }

  return (
    <div className="flex flex-col justify-center">
      {url && (
        <>
          <img src={url} alt="" className="text-center" />
          <button onClick={removePic}>Remove pic</button>
        </>
      )}
      {!url && (
        <div
          {...getRootProps({ className: 'dropzone' })}
          className="p-3 py-5 bg-gray-200 dark:bg-gray-800 border rounded-xl"
        >
          <input {...getInputProps()} />
          <div>Drag 'n' drop an image file here</div>
        </div>
      )}
    </div>
  )
}
