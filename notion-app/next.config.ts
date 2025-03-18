import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images:{
    domains:[
      'files.edgestore.dev'
    ]
  }
};

export default nextConfig;
