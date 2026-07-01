/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "*.replit.dev",
    "*.picard.replit.dev",
    "*.repl.co",
    "*.picard.repl.co",
    "*.replit.app",
  ],
};

export default nextConfig;
