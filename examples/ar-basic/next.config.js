/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@cosmo/core-schema',
    '@cosmo/validator',
    '@cosmo/renderer-ar',
    '@cosmo/ai-adapter',
  ],
  webpack: (config) => {
    // Handle Three.js and React Three Fiber
    config.externals = config.externals || [];
    config.externals.push({
      canvas: 'canvas',
    });
    return config;
  },
};

module.exports = nextConfig;
