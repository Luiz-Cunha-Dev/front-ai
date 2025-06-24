/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/chat/:path*',
        destination: 'http://129.148.34.13:3000/chat/:path*',
      },
    ];
  },
};

export default nextConfig;
