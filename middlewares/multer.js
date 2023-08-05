const multer = require('multer');
const path = require('path');
const os = require('os');

const upload = multer({ dest: path.join(os.tmpdir(), 'uploads') });

module.exports = upload;
