const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/EpisodeController');

const bindController = (method) => {
  return EpisodeController[method].bind(EpisodeController);
};
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('thumbnailUrl');

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', upload, handleUploadOrUpdateFile('thumbnailUrl'), bindController('create'));
router.put(
  '/update/:id',
  upload,
  handleUploadOrUpdateFile('thumbnailUrl', 'oldThumbnailUrl'),
  bindController('update'),
);
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', handleDeleteFile('oldThumbnailUrl'), bindController('forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleFiles('oldThumbnailUrls'),
  bindController('forceDeleteMany'),
);

module.exports = router;
