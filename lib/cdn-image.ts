/**
 * Resolves image paths to ImageKit CDN or returns local public fallback.
 * If NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT or NEXT_PUBLIC_CDN_URL is configured,
 * it prepends the CDN endpoint.
 * Otherwise, it returns the local path as-is (with leading slash).
 */
export function getCdnUrl(src?: string | null): string {
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
  return `${base}${normalizedPath}`
}

export default getCdnUrl
