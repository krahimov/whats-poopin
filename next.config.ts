import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor
  output: process.env.CAPACITOR_BUILD === 'true' ? 'export' : undefined,
  
  // Disable image optimization for static export
  images: {
    unoptimized: process.env.CAPACITOR_BUILD === 'true',
  },
  
  // Add trailing slash for better compatibility
  trailingSlash: true,
};

export default nextConfig;
