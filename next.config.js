/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dyrhgvgdltnvqpfatafs.supabase.co', // <-- SỬA LẠI CHỖ NÀY
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
