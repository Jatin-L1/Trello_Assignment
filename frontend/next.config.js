/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.pravatar.cc', 'images.unsplash.com'],
  },
  // Ensure CSS is processed
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
