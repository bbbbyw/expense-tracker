/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Next.js API routes - we're using Express serverless function
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
