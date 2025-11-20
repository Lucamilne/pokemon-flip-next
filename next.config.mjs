/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pokemon-flip-next',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
};

export default nextConfig;
