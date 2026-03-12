import type { NextConfig } from 'next'

// Disable SVGR's internal SVGO pass globally. The logo variants exported by
// scripts/optimize-logo.mjs rely on Inkscape's translate(-8080) origin offset,
// and running SVGO's convertPathData would resolve that transform into absolute
// path coordinates (x≈−7299), placing all artwork outside the viewBox.
// Any SVG added to the project that requires SVGO optimisation should be
// pre-processed externally before committing.
const svgrOptions = { svgo: false }

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },

  // Turbopack config (default in Next.js 16).
  // @svgr/webpack is invoked via Turbopack's webpack-loader compatibility layer.
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: svgrOptions }],
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
        use: [{ loader: '@svgr/webpack', options: svgrOptions }],
      }
    )

    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default nextConfig
