/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // App Router is stable in Next.js 15
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Enable React 19 features (disabled for now due to plugin issues)
    // reactCompiler: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  webpack: (config, { isServer }) => {
    // Add polyfills for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      }
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
