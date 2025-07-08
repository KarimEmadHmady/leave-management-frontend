module.exports = {
    images: {
      domains: ['res.cloudinary.com'], // إضافة نطاق Cloudinary
    },
  };
  


  module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://leave-management-backend-plum.vercel.app/api/:path*',
      },
    ];
  },
};