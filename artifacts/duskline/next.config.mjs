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
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
