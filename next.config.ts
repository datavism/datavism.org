/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ['@monaco-editor/react'] },
}
module.exports = nextConfig
