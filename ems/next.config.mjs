/** @type {import('next').NextConfig} */

const nextConfig = { 
    env: {
        // "http://localhost:3050/api" so localhost uses nginx to communcate between containers inside docker, and "/api" so production uses nginx to communcate between frontend and backend
        APIKEY: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5500/api",
      },
      reactStrictMode: false,
      basePath: "/production/ems",
      assetPrefix: "/production/ems"
};

export default nextConfig;
