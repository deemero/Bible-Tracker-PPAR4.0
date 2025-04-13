/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "vcknnjdutdomnxgmvhos.supabase.co", // ✅ Supabase Storage
      "api.dicebear.com",                 // ✅ Dicebear Avatar
    ],
  },
};

export default nextConfig;
