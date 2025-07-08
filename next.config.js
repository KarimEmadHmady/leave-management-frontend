// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'], // إعدادات الصور
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://leave-management-backend-plum.vercel.app/api/:path*',
      },
    ];
  },
};
