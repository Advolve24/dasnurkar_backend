const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Blog Images
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blogs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'logo',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp','avif'],
  },
});

module.exports = {
  cloudinary,
  projectStorage,
  blogStorage,
  logoStorage,
};
