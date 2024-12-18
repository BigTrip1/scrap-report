'use client'

import { ChangeEvent, useState } from 'react'
import axios from 'axios'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleFileUpload = async () => {
    if (!file) return
    setStatus('uploading')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // post image to api route to save in backend folder

      const response = await axios.post(process.env.IMAGE_ENDPOINT as string, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
          setUploadProgress(progress)
        },
      })

      setStatus('success')
      setUploadProgress(100)
    } catch (error) {
      console.log(error)
      setStatus('error')
      setUploadProgress(0)
    }
  }

  return (
    <div className='space-y-4'>
      <input type='file' onChange={handleFileChange} />
      {file && (
        <div className='mb-4 text-sm'>
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
          <a href={`${process.env.SERVER_HOST}1732447595402f5.jpeg`} target='_blank' rel='noopener noreferrer'>
            Uploaded file
          </a>
        </div>
      )}

      {status === 'uploading' && (
        <div className='space-y-2'>
          <div className='h-2.5 w-full rounded-full bg-gray-200'>
            <div className='h-2.5 rounded-full bg-blue-600 transition-all duration-300' style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className='text-sm text-gray-600'>{uploadProgress}% uploaded</p>
        </div>
      )}

      {file && status !== 'uploading' && (
        <button className='bg-cyan-500 p-2 rounded' onClick={handleFileUpload}>
          Upload
        </button>
      )}

      {status === 'success' && <p className='text-sm text-green-600'> File uploaded successfully</p>}
      {status === 'error' && <p className='text-sm text-green-600'> File failed. Please try again</p>}
    </div>
  )
}

export default FileUploader
