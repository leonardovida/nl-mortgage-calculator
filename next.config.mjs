import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', '@radix-ui/react-tabs', '@radix-ui/react-slot'],
  },
  webpack: (config) => {
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          recharts: {
            name: 'recharts',
            test: /[\\/]node_modules[\\/]recharts/,
            chunks: 'all',
            priority: 30,
          },
          radix: {
            name: 'radix-ui',
            test: /[\\/]node_modules[\\/]@radix-ui/,
            chunks: 'all',
            priority: 25,
          },
          react: {
            name: 'react-vendors',
            test: /[\\/]node_modules[\\/](react|react-dom)/,
            chunks: 'all',
            priority: 40,
          },
        },
      },
    };
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
