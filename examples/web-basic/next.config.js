/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aura/core-schema', '@aura/renderer-web', '@aura/validator'],
};

module.exports = nextConfig;
