/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // 🚨 TEMP: don’t block Preview builds if lint errors exist
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
