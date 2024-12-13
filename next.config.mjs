/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '172.30.60.22',
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
    // NEXTAUTH_URL: 'http://172.30.60.22:3000',
    // AUTH_TRUST_HOST: 'http://172.30.60.22:3000',

    // images
    IMAGE_ENDPOINT: 'http://172.30.60.22:3000/api/upload',
    // url
    BACKEND_SERVER_URL: 'http://172.30.60.22:3010',
    BASE_URL: 'http://172.30.60.22:3000',
    // email
    SMTP_HOST: 'smtp.jcb.local',
    SMTP_PORT: '25',
    SMTP_FROM_EMAIL: 'JCB-Quality.Uptime@jcb.com',
    SMTP_FROM_NAME: 'Uptime',
  },
}

export default nextConfig
