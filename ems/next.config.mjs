/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        // APIKEY: process.env.APIURL,
        // for local development 
        APIKEY: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5500",
      },
      
      reactStrictMode: false,
};

export default nextConfig;
