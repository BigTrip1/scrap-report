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
    // db
    MONGODB_URI: 'mongodb://localhost:27017/jcb-starter-template',
    // auth
    AUTH_SECRET: 'IWeI3yfGGDKrnN/9doe9IC1ZAvBJIN3HYsW12B9ZgBo=',
    // web socket
    WEB_SOCKET_HOST: 'http://172.30.60.22:3000',
    // images
    IMAGE_ENDPOINT: 'server_address/api/upload',
    // url
    BACKEND_SERVER_HOST: 'http://172.30.60.22:3001',
    PUBLIC_BASE_URL: 'http://172.30.60.22:3000',
    NEXT_PUBLIC_APP_URL: 'http://172.30.60.22:3000',
    // email
    SMTP_HOST: 'smtp.jcb.local',
    SMTP_PORT: '25',
    SMTP_FROM_EMAIL: 'JCB-Quality.Uptime@jcb.com',
    SMTP_FROM_NAME: 'Uptime',
  },
}

export default nextConfig
