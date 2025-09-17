/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This is the wildcard that allows ANY hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Also allow http sources
      },
    ],
  },
};

export default nextConfig;
