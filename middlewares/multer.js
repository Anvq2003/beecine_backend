const multer = require('multer');
const path = require('path');
const os = require('os');

const uploadImage = multer({ dest: path.join(os.tmpdir(), 'uploads') });

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = { uploadImage, uploadVideo };
