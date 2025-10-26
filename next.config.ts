/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize package imports for better performance
  experimental: {
    optimizePackageImports: ['@monaco-editor/react', 'lucide-react']
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // External scripts configuration for Pyodide
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ],
      },
    ]
  },
  
  // Webpack configuration for better Pyodide support
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Pyodide needs these headers for proper functionality
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    return config
  },
  
  // Build configuration - warnings don't block production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,  // Keep TypeScript strict
  },
}

module.exports = nextConfig