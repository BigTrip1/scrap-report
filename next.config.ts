import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'server_address',
        pathname: '**',
      },
    ],
  },
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    MONGODB_URI: 'mongodb://localhost:27017/jcb-starter-template',
    AUTH_SECRET: 'IWeI3yfGGDKrnN/9doe9IC1ZAvBJIN3HYsW12B9ZgBo=',
    WEB_SOCKET_HOST: 'http://172.30.60.22:3000',
    IMAGE_ENDPOINT: 'server_address/api/upload',
    BACKEND_SERVER_HOST: 'http://172.30.60.22:3001',
    PUBLIC_BASE_URL: 'http://172.30.60.22:3000',
    NEXT_PUBLIC_APP_URL: 'http://172.30.60.22:3000',
  },
}

export default nextConfig
