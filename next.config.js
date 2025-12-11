/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: ['nodemailer', 'next-auth'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle nodemailer and its dependencies for server
      config.externals = config.externals || [];
      config.externals.push({
        nodemailer: 'commonjs nodemailer',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
