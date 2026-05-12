/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for catching bugs early
  reactStrictMode: true,

  // Optimize production builds
  poweredByHeader: false,

  // Image optimization for external sources (if needed later)
  images: {
    remotePatterns: [],
  },

  // Server external packages — these must run in Node.js, not Edge
  serverExternalPackages: ["pg", "bcryptjs", "jsonwebtoken"],
};

export default nextConfig;
