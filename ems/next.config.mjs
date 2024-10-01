/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        APIKEY: process.env.APIURL,
      },
      
      reactStrictMode: false,
};

export default nextConfig;
