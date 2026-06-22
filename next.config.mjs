/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep the Chromium binary and puppeteer out of the bundle (serverless PDF).
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
};

export default nextConfig;
