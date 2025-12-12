import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts',
    },
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    // Polyfill untuk Node.js modules di browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
};

export default nextConfig;
