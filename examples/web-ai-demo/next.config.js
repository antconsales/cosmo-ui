/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cosmo/core-schema",
    "@cosmo/validator",
    "@cosmo/renderer-web",
    "@cosmo/ai-adapter",
  ],
};

module.exports = nextConfig;
