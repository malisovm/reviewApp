import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface IProps {
  setPic: (pic: string) => void
}

export default function PicUpload({setPic}: IProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
  })
  const [url, setUrl] = useState('')

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
        setUrl(data.url)
        setPic(data.url)
      })
      .catch((err) => console.log(err))
  }, [acceptedFiles])

  return (
    <div className="flex flex-col justify-center">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className="p-3 py-5 bg-gray-200 dark:bg-gray-800 border rounded-xl"
      >
        <input {...getInputProps()} />
        <div>Drag 'n' drop an image file here</div>
      </div>
      {acceptedFiles[0] && <img src={url} className="text-center" />}
    </div>
  )
}
