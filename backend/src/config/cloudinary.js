const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpgnkmmpk',
  api_key: process.env.CLOUDINARY_API_KEY || '837468486554111',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Cm3LNhx5Bpp-czG_LXxqeH21RL8',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'trello_clone',
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
