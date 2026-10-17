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

  // Don't append query transformations to video files
  if (normalizedPath.endsWith('.mp4') || normalizedPath.endsWith('.webm')) {
    return `${base}${normalizedPath}`
  }

  const trParts: string[] = ['f-auto', 'q-80']
  if (options?.width) trParts.push(`w-${options.width}`)
  if (options?.height) trParts.push(`h-${options.height}`)
  if (options?.quality) trParts[1] = `q-${options.quality}`
  if (options?.format) trParts[0] = `f-${options.format}`

  return `${base}${normalizedPath}?tr=${trParts.join(',')}`
}

export default getCdnUrl
