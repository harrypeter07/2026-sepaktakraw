/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors now fail the build instead of being silently ignored.
  // (Previously `ignoreBuildErrors: true` masked real bugs such as the broken
  // async `cookies()` server client and the TeamManager.update ReferenceError.)
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
