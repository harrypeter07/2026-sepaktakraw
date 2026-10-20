/**
 * Server-side ImageKit Upload & Management Utility
 * Allows direct file uploads to ImageKit using API credentials.
 */

export interface ImageKitUploadOptions {
  file: string | Buffer // Base64 string or binary buffer
  fileName: string
  folder?: string
  tags?: string[]
}

export interface ImageKitUploadResponse {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  height: number
  width: number
  size: number
  filePath: string
  fileType: string
}

export async function uploadToImageKit(
  options: ImageKitUploadOptions
): Promise<ImageKitUploadResponse> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not defined in environment variables')
  }

  const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`
  const formData = new FormData()

  if (Buffer.isBuffer(options.file)) {
    formData.append('file', new Blob([new Uint8Array(options.file)]), options.fileName)
  } else {
    formData.append('file', options.file)
  }

  formData.append('fileName', options.fileName)
  formData.append('useUniqueFileName', 'false')

  const folder = options.folder || '/mstaimgkt/imagekit-upload'
  formData.append('folder', folder)

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','))
  }

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`ImageKit Upload failed (${response.status}): ${errorBody}`)
  }

  return response.json()
}
