import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning by setting the correct tracing root
  outputFileTracingRoot: dirname,
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ensure bare imports like `app/(payload)/...` resolve to `src/app`
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      app: path.resolve(dirname, 'src/app'),
      '@': path.resolve(dirname, 'src'),
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
