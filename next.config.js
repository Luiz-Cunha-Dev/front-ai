/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/chat/:path*',
        destination: 'http://168.138.148.63:3000/chat/:path*',
      },
    ];
  },
};

export default nextConfig;
