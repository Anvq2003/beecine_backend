const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/EpisodeController');
const bindController = require('../helpers/controllerHelper');
const {
  validationEpisodeData,
  validationEpisodeSingleData,
} = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', bindController(EpisodeController, 'getQuery'));
router.get('/all', bindController(EpisodeController, 'getAll'));
router.get('/trash', bindController(EpisodeController, 'getTrash'));
router.get('/:id', bindController(EpisodeController, 'getOne'));
router.post(
  '/store',
  upload,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'create'),
);
router.post(
  '/store-single',
  upload,
  validationEpisodeSingleData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'update'),
);
router.delete('/delete/:id', bindController(EpisodeController, 'delete'));
router.delete('/delete-many', bindController(EpisodeController, 'deleteMany'));
router.patch('/restore/:id', bindController(EpisodeController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(EpisodeController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(EpisodeController, 'forceDeleteMany'),
);

module.exports = router;
