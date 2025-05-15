import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nhm.ac.uk',
        port: '',
        pathname: '/resources/nature-online/life/dinosaurs/dinosaur-directory/images/reconstruction/small/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nhm.ac.uk',
        port: '',
        pathname: '/resources/nature-online/life/dinosaurs/dinosaur-directory/images/reconstruction/medium/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nhm.ac.uk',
        port: '',
        pathname: '/resources/nature-online/life/dinosaurs/dinosaur-directory/images/reconstruction/large/**',
      },
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
