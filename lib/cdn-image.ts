/**
 * Resolves image paths to ImageKit CDN with automatic WebP/AVIF format and quality optimization,
 * or gracefully returns the local public fallback path.
 */

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'avif'
}

export function getCdnUrl(src?: string | null, options?: ImageTransformOptions): string {
  if (!src) return '/placeholder.svg'

  // If already an absolute external URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
    return src
  }

  // Ensure path starts with a slash
  const normalizedPath = src.startsWith('/') ? src : `/${src}`

  // Check for ImageKit or CDN endpoint
  const cdnEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    process.env.NEXT_PUBLIC_CDN_URL

  if (!cdnEndpoint) {
    return normalizedPath
  }

  const base = cdnEndpoint.endsWith('/') ? cdnEndpoint.slice(0, -1) : cdnEndpoint

  // Safeguard: avoid repeating /imagekit-upload if both base and path contain it
  let cleanPath = normalizedPath
  if (base.endsWith('/imagekit-upload') && cleanPath.startsWith('/imagekit-upload/')) {
    cleanPath = cleanPath.slice('/imagekit-upload'.length)
  }

  // Don't append query transformations to video files
  if (cleanPath.endsWith('.mp4') || cleanPath.endsWith('.webm')) {
    return `${base}${cleanPath}`
  }

  const trParts: string[] = ['f-auto', 'q-80']
  if (options?.width) trParts.push(`w-${options.width}`)
  if (options?.height) trParts.push(`h-${options.height}`)
  if (options?.quality) trParts[1] = `q-${options.quality}`
  if (options?.format) trParts[0] = `f-${options.format}`

  return `${base}${cleanPath}?tr=${trParts.join(',')}`
}

export default getCdnUrl
