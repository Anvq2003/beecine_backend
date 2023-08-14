const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');

const bindController = (method) => {
  return BannerController[method].bind(BannerController);
};

const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('imageUrl');

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', upload, handleUploadOrUpdateFile('imageUrl'), bindController('create'));
router.put(
  '/update/:id',
  upload,
  handleUploadOrUpdateFile('oldImageUrl'),
  bindController('update'),
);
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', handleDeleteFile('oldImageUrl'), bindController('forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleFiles('oldImageUrls'),
  bindController('forceDeleteMany'),
);

module.exports = router;
