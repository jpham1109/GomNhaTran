import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  // Turbopack config (default in Next.js 16).
  // @svgr/webpack is invoked via Turbopack's webpack-loader compatibility layer.
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack config kept for explicit --webpack builds.
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test: (s: string) => boolean } }) => rule.test?.test?.('.svg')
    )

    config.module.rules.push(
      // Keep existing rule for *.svg?url imports.
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      // All other *.svg imports → SVGR React components.
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
        use: ['@svgr/webpack'],
      }
    )

    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default nextConfig
