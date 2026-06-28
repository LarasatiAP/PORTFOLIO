/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  // better-sqlite3 hanya dipakai saat local dev, exclude dari server bundle
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
